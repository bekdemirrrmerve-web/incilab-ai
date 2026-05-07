import type { NextApiRequest, NextApiResponse } from 'next';

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

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

function extractText(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) return '';

  return parts
    .map((part) => {
      if (typeof part?.text === 'string') return part.text;
      return '';
    })
    .join('')
    .trim();
}

async function askGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error:
        'GEMINI_API_KEY bulunamadı. .env.local dosyası package.json ile aynı seviyede olmalı.',
    };
  }

  let lastError = '';

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.65,
              topP: 0.9,
              maxOutputTokens: 1800,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        lastError =
          data?.error?.message ||
          `Gemini isteği başarısız oldu. Model: ${model}`;
        continue;
      }

      const text = extractText(data);

      if (!text) {
        lastError = `Gemini boş cevap döndürdü. Model: ${model}`;
        continue;
      }

      return {
        ok: true,
        model,
        text,
      };
    } catch (error: any) {
      lastError = error?.message || 'Bilinmeyen Gemini bağlantı hatası.';
    }
  }

  return {
    ok: false,
    error: lastError || 'Gemini modellerinden cevap alınamadı.',
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const test = String(req.query.test || '').trim();

    if (!test) {
      return res.status(200).json({
        ok: true,
        route: '/api/gemini',
        hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
        message: 'Test için /api/gemini?test=merhaba yaz.',
      });
    }

    const result = await askGemini(test);
    return res.status(result.ok ? 200 : 500).json(result);
  }

  if (req.method === 'POST') {
    const message = String(req.body?.message || '').trim();

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: 'Mesaj boş geldi.',
      });
    }

    const result = await askGemini(message);
    return res.status(result.ok ? 200 : 500).json(result);
  }

  return res.status(405).json({
    ok: false,
    error: 'Sadece GET ve POST destekleniyor.',
  });
}
