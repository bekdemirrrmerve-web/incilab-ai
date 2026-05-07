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

const MODEL = "gemini-2.5-flash-lite";

// Şimdilik basit koruma:
// Aynı IP için 1 saatte en fazla 40 istek.
// Yayına alınca bunu istersen 20/50/100 yaparız.
const HOURLY_LIMIT = 40;
const WINDOW_MS = 60 * 60 * 1000;

type RateRecord = {
  count: number;
  resetAt: number;
};

const rateStore = new Map<string, RateRecord>();

function getClientIp(req: NextApiRequest) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0] || "unknown";
  }

  return req.socket.remoteAddress || "unknown";
}

function checkRateLimit(req: NextApiRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  const current = rateStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateStore.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return {
      allowed: true,
      remaining: HOURLY_LIMIT - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  if (current.count >= HOURLY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  rateStore.set(ip, current);

  return {
    allowed: true,
    remaining: HOURLY_LIMIT - current.count,
    resetAt: current.resetAt,
  };
}

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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
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
          temperature: 0.55,
          topP: 0.9,
          maxOutputTokens: 1800,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      error:
        data?.error?.message ||
        `Gemini isteği başarısız oldu. Model: ${MODEL}`,
    };
  }

  const text = extractText(data);

  if (!text) {
    return {
      ok: false,
      error: "Gemini boş cevap döndürdü.",
    };
  }

  return {
    ok: true,
    model: MODEL,
    text,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rate = checkRateLimit(req);

    res.setHeader("X-RateLimit-Limit", String(HOURLY_LIMIT));
    res.setHeader("X-RateLimit-Remaining", String(rate.remaining));
    res.setHeader("X-RateLimit-Reset", String(rate.resetAt));

    if (!rate.allowed) {
      return res.status(429).json({
        ok: false,
        error:
          "Saatlik kullanım limitine ulaştın. Biraz sonra tekrar dene.",
        rateLimit: {
          limit: HOURLY_LIMIT,
          remaining: 0,
          resetAt: rate.resetAt,
        },
      });
    }

    if (req.method === "GET") {
      const test = String(req.query.test || "").trim();

      if (!test) {
        return res.status(200).json({
          ok: true,
          route: "/api/gemini",
          hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
          model: MODEL,
          hourlyLimit: HOURLY_LIMIT,
          message: "Test için /api/gemini?test=merhaba yaz.",
        });
      }

      const result = await askGemini(test);

      return res.status(result.ok ? 200 : 500).json({
        ...result,
        rateLimit: {
          limit: HOURLY_LIMIT,
          remaining: rate.remaining,
          resetAt: rate.resetAt,
        },
      });
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

      return res.status(result.ok ? 200 : 500).json({
        ...result,
        rateLimit: {
          limit: HOURLY_LIMIT,
          remaining: rate.remaining,
          resetAt: rate.resetAt,
        },
      });
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
