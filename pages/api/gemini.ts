import type { NextApiRequest, NextApiResponse } from "next";

const SYSTEM_PROMPT = `
Sen InciLab adlı AI laboratuvar platformunun bilimsel asistanısın.

Görevlerin:
- Kozmetik, INCI, formülasyon, analiz sonucu yorumlama ve kimyasal içerik açıklama konularında yardımcı ol.
- Cevapları Türkçe, anlaşılır, profesyonel ama sıcak bir dille ver.
- Kimyasal ad sorulursa: INCI Name, Türkçe adı, diğer adları, ne işe yaradığı, hangi sektörlerde kullanıldığı ve sade Türkçe anlamını açıkla.
- Formül istenirse önce 100 ml / 100 gr bazlı örnek formül ver, sonra miktarın ölçeklenebileceğini belirt.
- Analiz sonucu sorulursa: olası nedenler, çözüm önerileri ve dikkat edilmesi gerekenleri yaz.
- Tehlikeli, mevzuata aykırı veya kesin uzman onayı gerektiren konularda uyarı ver.
- Kesin tıbbi tedavi, reçete veya yasal garanti gibi konuşma.
- Cevapları düzenli başlıklarla ver.
`;

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
];

function extractText(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) return "";

  return parts
    .map((part) => {
      if (typeof part?.text === "string") return part.text;
      return "";
    })
    .join("")
    .trim();
}

async function askGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error:
        "GEMINI_API_KEY bulunamadı. .env veya .env.local dosyası package.json ile aynı seviyede olmalı. Vercel'de de Environment Variables alanına eklenmeli.",
    };
  }

  const errors: string[] = [];

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.65,
              topP: 0.9,
              maxOutputTokens: 2200,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error?.message ||
          `Gemini isteği başarısız oldu. Model: ${model}`;

        errors.push(`${model}: ${message}`);
        continue;
      }

      const text = extractText(data);

      if (!text) {
        errors.push(`${model}: Gemini boş cevap döndürdü.`);
        continue;
      }

      return {
        ok: true,
        model,
        text,
      };
    } catch (error: any) {
      errors.push(`${model}: ${error?.message || "Bilinmeyen bağlantı hatası."}`);
    }
  }

  return {
    ok: false,
    error:
      "Gemini modellerinden cevap alınamadı. Detay: " + errors.join(" | "),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const test = String(req.query.test || "").trim();

      if (!test) {
        return res.status(200).json({
          ok: true,
          route: "/api/gemini",
          hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
          models: MODELS,
          message: "Test için /api/gemini?test=merhaba yaz.",
        });
      }

      const result = await askGemini(test);
      return res.status(result.ok ? 200 : 500).json(result);
    }

    if (req.method === "POST") {
      const message = String(req.body?.message || "").trim();

      if (!message) {
        return res.status(400).json({
          ok: false,
          error: "Mesaj boş geldi.",
        });
      }

      const result = await askGemini(message);
      return res.status(result.ok ? 200 : 500).json(result);
    }

    return res.status(405).json({
      ok: false,
      error: "Sadece GET ve POST destekleniyor.",
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Beklenmeyen sunucu hatası oluştu.",
    });
  }
}
