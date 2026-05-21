import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function localFallback(question: string) {
  const q = question.toLocaleLowerCase("tr-TR");

  if (q.includes("parfüm") || q.includes("parfum") || q.includes("esans") || q.includes("koku")) {
    return `Fresh kokulu bir parfüm yapmak için önce esans akordu kurulur, sonra bu akort alkol bazlı parfüme dönüştürülür.

1) Esans mantığı:
Fresh kokularda üç yapı vardır:
- Üst nota: ilk gelen ferah kısım. Bergamot, limon, greyfurt, mandalina, yeşil elma, yeşil çay, nane.
- Orta nota: kokunun gövdesi. Neroli, frezya, yasemin, lavanta, beyaz çay, müge.
- Dip nota: kalıcılığı veren kısım. Temiz musk, sedir, amber, sandal, hafif odunsu notalar.

2) Fresh esans oranı:
Başlangıç için:
- %45 üst nota
- %35 orta nota
- %20 dip nota

3) 10 g fresh esans örneği:
- Bergamot: 2 g
- Limon: 1 g
- Greyfurt: 0.8 g
- Yeşil nota / yeşil elma akordu: 0.7 g
- Neroli: 1.5 g
- Beyaz çay: 1 g
- Frezya: 1 g
- Temiz musk: 0.8 g
- Sedir: 0.7 g
- Amber: 0.5 g

4) Esans yapımı:
Tüm esans bileşenleri cam beherde veya koyu renk cam şişede tartılır. Yavaşça karıştırılır. 24-48 saat dinlendirilir. Bu aşama esans konsantresidir.

5) Parfüme çevirme:
100 ml EDP için örnek:
- 18 ml esans
- 80 ml parfüm alkolü / etil alkol
- 2 ml saf su veya uygun çözücü destek

6) Sıra:
Önce alkol alınır. Esans yavaşça eklenir. Homojen karıştırılır. Gerekirse az miktar saf su eklenir. Koyu renk cam şişede 2-4 hafta dinlendirilir. Sonra filtrelenir.

7) Dikkat:
Alkol yanıcıdır. Açık alevden uzak çalışılmalı. Esanslar alerjen içerebilir. Cilde uygulanacak ürünlerde IFRA uygunluğu, alerjen beyanı ve yama testi gerekir.`;
  }

  if (
    q.includes("niasinamid") ||
    q.includes("niasin amid") ||
    q.includes("niacinamide") ||
    q.includes("b3")
  ) {
    return `Niasinamid kozmetik formüllerde genelde %2-5 aralığında kullanılır. Hassas cilt ürünlerinde %2-4 daha güvenli ve konforlu olur. Bazı serumlarda %10 seviyesine kadar çıkılabilir ama bu her formül için otomatik doğru değildir.

Yüksek oranlarda:
- kızarma,
- batma,
- yapışkan his,
- çözünme problemi,
- pH uyumsuzluğu görülebilir.

Pratikte pH 5.2-6.2 bandı güzel çalışır. Çok asidik sistemlerle birlikte kullanılacaksa stabilite ve tolerans ayrıca kontrol edilmelidir.`;
  }

  return `Sorunu aldım. Bunu kimya, formülasyon, INCI, üretim yöntemi, pH, stabilite, mevzuat ve pratik uygulama açısından yorumlayabilirim.

Genel yaklaşım:
1. Ürün tipini belirlerim.
2. Hedef etkiyi çıkarırım.
3. Gerekli hammaddeleri seçerim.
4. Kullanım oranlarını öneririm.
5. Faz faz üretim yöntemini yazarım.
6. Beklenen pH, viskozite, renk, koku ve görünümü açıklarım.
7. Stabilite ve güvenlik uyarılarını eklerim.

API bağlı değilse bu yedek mod çalışır. Daha güçlü cevap için Gemini/OpenAI API bağlantısı gerekir.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = String(body?.question || "");

    if (!question.trim()) {
      return NextResponse.json({
        ok: true,
        answer: "Sorunu yazınca kimya ve formülasyon açısından yorumlayebilirim.",
      });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        ok: true,
        answer: localFallback(question),
        source: "local-fallback",
      });
    }

    const systemInstruction = `
Sen İnciLab adlı profesyonel bir kimya, kozmetik, formülasyon, laboratuvar ve mevzuat asistanısın.

Kullanıcı soru ne kadar dağınık, eksik, yazım hatalı veya absürt sorarsa sorsun:
- "Daha net sor" deme.
- Önce niyetini tahmin et.
- En olası anlam üzerinden detaylı cevap ver.
- Kimyager gibi ama anlaşılır konuş.
- Ürün formülasyonu istenirse faz faz anlat.
- Hammadde sorulursa kullanım oranı, görev, pH, çözünürlük, stabilite ve dikkat notu ver.
- Parfüm/esans sorulursa nota yapısı, esans akordu, oran, hazırlama, dinlendirme, alkol oranı ve güvenlik uyarısı ver.
- Mevzuat sorulursa hedef pazar, kısıtlı/yasaklı içerik, ürün tipi, tedarikçi dokümanı ve güvenlik değerlendirmesinden bahset.
- Cevap verirken sabit tek cümle kullanma.
- Net, öğretici, uygulanabilir cevap ver.
- Tehlikeli, evde riskli veya profesyonel test gerektiren konularda güvenlik uyarısı ekle.
- Türkçe cevap ver.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: question }],
            },
          ],
          generationConfig: {
            temperature: 0.45,
            topP: 0.9,
            maxOutputTokens: 1800,
          },
        }),
      }
    );

    const data = await response.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      localFallback(question);

    return NextResponse.json({
      ok: true,
      answer,
      source: "gemini-or-fallback",
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      answer:
        "İnciLab beyni şu an cevap üretirken hata aldı. Yedek mod: Sorunu formülasyon, içerik analizi, üretim yöntemi ve stabilite açısından yorumlayabilirim.",
    });
  }
}
