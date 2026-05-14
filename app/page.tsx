"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type AnalysisReport = {
  question: string;
  answer: string;
  details: string;
  causes: string[];
  suggestions: string[];
  notes: string[];
  createdAt: string;
};

const samplePrompts = [
  "KOİ yüksek, çıkış suyu bulanık. Neden olabilir?",
  "Toplam azot ve nitrat sonucu uyumsuz çıkıyor. Nasıl yorumlanır?",
  "Krem formülünde pH neden zamanla yükselir?",
  "Şampuan formülünde SLES yerine daha yumuşak alternatif ne olabilir?",
];

const ingredientCards = [
  {
    title: "Niacinamide",
    desc: "Bariyer, ton eşitsizliği ve sebum dengesi için popüler aktif.",
    detail:
      "Genelde %2-5 aralığında kullanılır. Çok düşük pH sistemlerde stabilite ve tolerans açısından dikkatli değerlendirilmelidir.",
  },
  {
    title: "Panthenol",
    desc: "Yatıştırıcı, nem destekleyici ve bariyer dostu yardımcı aktif.",
    detail:
      "Leave-on ve rinse-off ürünlerde kullanılabilir. Hassas cilt ürünlerinde iyi bir destek hammaddesidir.",
  },
  {
    title: "Azelaic Acid",
    desc: "Leke, kızarıklık ve akne eğilimli ciltlerde kullanılan güçlü aktif.",
    detail:
      "Formülasyon pH’ı, çözünürlük ve partikül dağılımı kritik olabilir. Ev tipi kullanımda dikkatli olunmalıdır.",
  },
  {
    title: "PHA",
    desc: "AHA’ya göre daha nazik eksfoliasyon sağlayabilen asit grubu.",
    detail:
      "Gluconolactone gibi PHA’lar hassas cilt iletişiminde daha soft bir seçenek olarak anlatılabilir.",
  },
];

const formulaCards = [
  {
    title: "Nemlendirici krem bazı",
    desc: "Su fazı + yağ fazı + emülgatör + koruyucu + pH ayarı mantığı.",
    detail:
      "Basit bir kremde su fazı, humektanlar, yağ fazı, emülgatör sistemi, kıvam verici, koruyucu ve pH ayarı ayrı ayrı kontrol edilmelidir.",
  },
  {
    title: "Nazik temizleyici jel",
    desc: "Anyonik + amfoterik + noniyonik yüzey aktif kombinasyonu.",
    detail:
      "Cilt dostu temizleyicilerde aktif madde yüzdesi, pH, viskozite ve irritasyon potansiyeli birlikte değerlendirilmelidir.",
  },
  {
    title: "Tonik / mist",
    desc: "Düşük yağlı, su bazlı, aktif destekli hafif ürün mantığı.",
    detail:
      "Toniklerde çözünürlük, koruyucu uyumu, pH ve ambalaj hijyeni çok önemlidir.",
  },
  {
    title: "Saç bakım serumu",
    desc: "Silikon, ester yağlar veya bitkisel yağlarla tasarlanabilir.",
    detail:
      "Saç serumlarında ağırlık hissi, parlaklık, kayganlık ve uçlardaki görünüm hedeflenir.",
  },
];

const splitToList = (text: string, fallback: string[]) => {
  const lines = text
    .split(/\n|•|-|\d+\./)
    .map((item) => item.trim())
    .filter((item) => item.length > 8);

  return lines.length >= 3 ? lines.slice(0, 6) : fallback;
};

const buildLocalReport = (question: string, answer: string): AnalysisReport => {
  return {
    question,
    answer,
    details:
      answer ||
      "Analiz cevabı oluşturuldu ancak detay metni ayrı gelmedi. Ana cevap üzerinden kimyasal değerlendirme yapılabilir.",
    causes: splitToList(answer, [
      "Numune matriksi değişmiş olabilir.",
      "Seyreltme katsayısı veya ölçüm aralığı hatalı seçilmiş olabilir.",
      "Kitin bekleme süresi, sıcaklığı veya reaktif sırası sonucu etkilemiş olabilir.",
      "Cihaz kalibrasyonu, blank değeri veya küvet temizliği kontrol edilmelidir.",
    ]),
    suggestions: [
      "Aynı numuneyi uygun seyreltme ile tekrar çalış.",
      "Kitin ölçüm aralığını ve cihaz metodunu kontrol et.",
      "Blank, küvet temizliği ve reaktif son kullanma tarihini kontrol et.",
      "Şüpheli sonuçlarda paralel numune veya farklı seyreltme ile doğrulama yap.",
    ],
    notes: [
      "Bu yorum laboratuvar ön değerlendirmesidir; resmi rapor yerine geçmez.",
      "Sonuçlar numune alma zamanı, bekletme koşulu ve metoda göre değişebilir.",
    ],
    createdAt: new Date().toLocaleString("tr-TR"),
  };
};

export default function InciLabPage() {
  const [question, setQuestion] = useState("");
  const [formulaProduct, setFormulaProduct] = useState("Nemlendirici krem");
  const [formulaAmount, setFormulaAmount] = useState("100");
  const [formulaGoal, setFormulaGoal] = useState(
    "Hafif dokulu, bariyer destekli, hassas cilde uygun bir başlangıç formülü."
  );

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [history, setHistory] = useState<AnalysisReport[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllFormulas, setShowAllFormulas] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [toast, setToast] = useState("");

  const visibleIngredients = showAllIngredients
    ? ingredientCards
    : ingredientCards.slice(0, 2);

  const visibleFormulas = showAllFormulas
    ? formulaCards
    : formulaCards.slice(0, 2);

  const visibleHistory = showAllHistory ? history : history.slice(0, 2);

  const reportPreview = useMemo(() => {
    if (!report?.answer) return "";
    return report.answer.length > 460
      ? `${report.answer.slice(0, 460)}...`
      : report.answer;
  }, [report]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const createFormulaPrompt = () => {
    return `
Kozmetik formülasyon isteği:

Ürün tipi: ${formulaProduct}
Hedef miktar: ${formulaAmount} g / ml
Hedef: ${formulaGoal}

Bana AR-GE başlangıç mantığıyla bir formülasyon taslağı hazırla.
Cevap düzeni şöyle olsun:
1. Ürün mantığı
2. 100 g/ml üzerinden yüzde ve gram tablo mantığı
3. Faz A / Faz B / Faz C ayrımı
4. Üretim adımları
5. pH hedefi
6. Stabilite ve koruyucu notları
7. Dikkat edilmesi gereken güvenlik ve mevzuat notları

Not: Kesin ticari reçete gibi değil, laboratuvar başlangıç formülü gibi anlat.
`.trim();
  };

  const askInciLab = async (forcedQuestion?: string) => {
    const cleanQuestion = (forcedQuestion ?? question).trim();

    if (!cleanQuestion) {
      showToast("Önce sorunu yaz kanka.");
      return;
    }

    setQuestion(cleanQuestion);
    setLoading(true);

    try {
      const systemPrompt = `
Sen InciLab adlı kimya, kozmetik formülasyon ve laboratuvar analiz asistanısın.
Kullanıcıya Türkçe, anlaşılır ama bilimsel cevap ver.

Cevabında şu düzeni koru:
1. Kısa yorum
2. Muhtemel nedenler
3. Kontrol edilmesi gerekenler
4. Çözüm önerileri
5. Dikkat notu

Kullanıcı formülasyon istiyorsa:
- Fazlara ayır.
- Yüzde ve gram mantığı ver.
- pH, stabilite, koruyucu ve üretim adımlarını ekle.
- Ev tipi tehlikeli uygulama gibi anlatma; AR-GE başlangıç mantığında güvenli çerçeve kur.

Kullanıcının sorusu:
${cleanQuestion}
`.trim();

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: systemPrompt,
          prompt: systemPrompt,
          question: cleanQuestion,
        }),
      });

      const data = await response.json().catch(() => null);

      const aiAnswer =
        data?.answer ||
        data?.reply ||
        data?.text ||
        data?.result ||
        data?.content ||
        data?.message ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "";

      if (!response.ok || !aiAnswer) {
        const fallbackMessage =
          data?.error ||
          "Cevabı alamadım kanka. Gemini route çalışıyor olabilir ama dönen cevap alanı farklı isimde olabilir.";

        const fallbackReport = buildLocalReport(
          cleanQuestion,
          `Analiz cevabı alınamadı.\n\nTeknik detay: ${fallbackMessage}`
        );

        setReport(fallbackReport);
        setHistory((prev) => [fallbackReport, ...prev]);
        showToast("Cevap geldi ama teknik uyarı var.");
        return;
      }

      const newReport = buildLocalReport(cleanQuestion, aiAnswer);

      setReport(newReport);
      setHistory((prev) => [newReport, ...prev]);
      showToast("InciLab cevabı hazır.");
    } catch {
      const errorReport = buildLocalReport(
        cleanQuestion,
        "Bağlantı hatası oluştu. /api/gemini route, environment key veya response formatı kontrol edilmeli."
      );

      setReport(errorReport);
      setHistory((prev) => [errorReport, ...prev]);
      showToast("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!report) {
      showToast("PDF için önce analiz cevabı oluşturmalısın.");
      return;
    }

    const cleanPdfText = (value: string) => {
      return value
        .replace(/\*\*/g, "")
        .replace(/###/g, "")
        .replace(/`/g, "")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[•·]/g, "-")
        .replace(/ğ/g, "g")
        .replace(/Ğ/g, "G")
        .replace(/ü/g, "u")
        .replace(/Ü/g, "U")
        .replace(/ş/g, "s")
        .replace(/Ş/g, "S")
        .replace(/ı/g, "i")
        .replace(/İ/g, "I")
        .replace(/ö/g, "o")
        .replace(/Ö/g, "O")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "C");
    };

    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      doc.setProperties({
        title: "InciLab Analiz Raporu",
        subject: "Kimya ve kozmetik analiz raporu",
        author: "InciLab",
      });

      const margin = 14;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      let y = 18;

      const checkPage = (space = 18) => {
        if (y + space > pageHeight - 15) {
          doc.addPage();
          y = 18;
        }
      };

      const addTitle = (text: string) => {
        checkPage(18);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(cleanPdfText(text), margin, y);
        y += 10;
      };

      const addMeta = (text: string) => {
        checkPage(10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(cleanPdfText(text), margin, y);
        y += 8;
      };

      const addSection = (title: string, content: string | string[]) => {
        checkPage(20);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(cleanPdfText(title), margin, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        const finalText = Array.isArray(content)
          ? content.length
            ? content.map((item, index) => `${index + 1}. ${item}`).join("\n")
            : "Bilgi yok."
          : content || "Bilgi yok.";

        const cleaned = cleanPdfText(finalText);
        const lines = doc.splitTextToSize(cleaned, maxWidth) as string[];

        lines.forEach((line) => {
          checkPage(6);
          doc.text(line, margin, y);
          y += 5;
        });

        y += 5;
      };

      const today = new Date().toISOString().slice(0, 10);

      addTitle("InciLab Analiz Raporu");
      addMeta(`Olusturulma tarihi: ${report.createdAt}`);
      addMeta("Not: Bu rapor on degerlendirme amaclidir.");
      y += 3;

      addSection("Kullanicinin Sorusu", report.question);
      addSection("Analiz Cevabi", report.answer);
      addSection("Detayli Kimyasal Yorum", report.details);
      addSection("Muhtemel Nedenler", report.causes);
      addSection("Cozum Onerileri", report.suggestions);
      addSection("Notlar / Uyarilar", report.notes);

      doc.save(`incilab-analiz-raporu-${today}.pdf`);
      showToast("PDF indiriliyor.");
    } catch {
      showToast("PDF için jspdf paketi eksik olabilir. Terminal: npm i jspdf");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ffffff_0%,#f7f2ff_28%,#eee7ff_52%,#f8fbff_100%)] px-4 py-6 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <div className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-2xl shadow-purple-100/70 backdrop-blur">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-purple-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-fuchsia-200/40 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-purple-200 bg-white/80 px-3 py-1 text-xs font-semibold text-purple-600">
                Kimya · Kozmetik · Formülasyon · Analiz
              </p>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                InciLab
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Analiz sonucunu, formülasyon mantığını veya hammadde yorumunu yaz;
                InciLab sana bilimsel ama anlaşılır şekilde toparlasın.
              </p>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-white/85 px-5 py-4 text-sm text-slate-600 shadow-sm">
              <p className="font-bold text-slate-950">Durum</p>
              <p className="mt-1 text-purple-600">
                {loading ? "Analiz hazırlanıyor..." : "Hazır"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-5">
            <PanelFrame>
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Analiz Sorusu
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Laboratuvar sonucu, içerik sorusu veya üretim problemi yazabilirsin.
                  </p>
                </div>
              </div>

              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Örn: Çıkış suyunda KOİ yüksek ama numune berrak değil. Kit ile ölçüm yaptım, neden olabilir?"
                className="min-h-[170px] w-full resize-none rounded-3xl border border-purple-100 bg-white/95 p-4 text-sm leading-6 text-slate-800 outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {samplePrompts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuestion(item)}
                    className="rounded-full border border-purple-100 bg-white/85 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-purple-200 hover:bg-purple-50"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => askInciLab()}
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Analiz ediliyor..." : "Analiz et"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuestion("");
                    setReport(null);
                    showToast("Ekran temizlendi.");
                  }}
                  className="rounded-2xl border border-purple-100 bg-white/85 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-purple-50"
                >
                  Temizle
                </button>
              </div>
            </PanelFrame>

            <PanelFrame>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-500">
                  Formülasyon Bölümü
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Formülasyon Sor
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ürün tipini, miktarı ve hedefi yaz; InciLab fazlara ayrılmış formülasyon mantığı çıkarsın.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-slate-500">
                    Ürün tipi
                  </span>
                  <input
                    value={formulaProduct}
                    onChange={(event) => setFormulaProduct(event.target.value)}
                    className="w-full rounded-2xl border border-purple-100 bg-white p-3 text-sm outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-slate-500">
                    Hedef miktar
                  </span>
                  <input
                    value={formulaAmount}
                    onChange={(event) => setFormulaAmount(event.target.value)}
                    className="w-full rounded-2xl border border-purple-100 bg-white p-3 text-sm outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  />
                </label>
              </div>

              <label className="mt-3 block">
                <span className="mb-1 block text-xs font-bold text-slate-500">
                  Formül hedefi
                </span>
                <textarea
                  value={formulaGoal}
                  onChange={(event) => setFormulaGoal(event.target.value)}
                  className="min-h-[110px] w-full resize-none rounded-3xl border border-purple-100 bg-white p-4 text-sm leading-6 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => askInciLab(createFormulaPrompt())}
                  disabled={loading}
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-100 transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Formülasyon oluştur
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormulaProduct("Nazik temizleyici jel");
                    setFormulaAmount("100");
                    setFormulaGoal(
                      "Sülfatsız, hassas cilde uygun, pH 5.2-5.8 aralığında nazik temizleyici."
                    );
                    showToast("Temizleyici jel örneği yüklendi.");
                  }}
                  className="rounded-2xl border border-purple-100 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-purple-50"
                >
                  Örnek yükle
                </button>
              </div>
            </PanelFrame>

            <PanelFrame>
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Analiz Cevabı
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Cevap geldikten sonra detay, tümünü gör ve PDF butonları çalışır.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!report) {
                        showToast("Önce analiz cevabı oluşturmalısın.");
                        return;
                      }
                      setShowDetails(true);
                    }}
                    className="rounded-2xl border border-purple-100 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-purple-50"
                  >
                    Tümünü gör
                  </button>

                  <button
                    type="button"
                    onClick={exportPDF}
                    className="rounded-2xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700"
                  >
                    PDF indir
                  </button>
                </div>
              </div>

              {report ? (
                <div className="space-y-4">
                  <p className="whitespace-pre-line rounded-3xl border border-purple-100 bg-white/80 p-4 text-sm leading-7 text-slate-700">
                    {reportPreview}
                  </p>

                  <div className="grid gap-3 md:grid-cols-3">
                    <InfoMiniCard
                      title="Muhtemel neden"
                      text={report.causes[0] || "Neden bilgisi yok."}
                    />
                    <InfoMiniCard
                      title="Öneri"
                      text={report.suggestions[0] || "Öneri bilgisi yok."}
                    />
                    <InfoMiniCard
                      title="Uyarı"
                      text={report.notes[0] || "Uyarı bilgisi yok."}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-purple-200 bg-white/70 p-5 text-sm text-slate-500">
                  Henüz analiz cevabı yok. Sorunu yazıp “Analiz et”e ya da formül bölümünden “Formülasyon oluştur”a basınca cevap burada görünecek.
                </div>
              )}
            </PanelFrame>
          </section>

          <aside className="space-y-5">
            <PanelCard
              title="Trend Hammaddeler"
              buttonText={showAllIngredients ? "Kısalt" : "Tümünü gör"}
              onButtonClick={() => setShowAllIngredients((prev) => !prev)}
            >
              <div className="space-y-3">
                {visibleIngredients.map((item) => (
                  <SmallCard key={item.title} {...item} />
                ))}
              </div>
            </PanelCard>

            <PanelCard
              title="Formül Alanı"
              buttonText={showAllFormulas ? "Kısalt" : "Tümünü gör"}
              onButtonClick={() => setShowAllFormulas((prev) => !prev)}
            >
              <div className="space-y-3">
                {visibleFormulas.map((item) => (
                  <SmallCard key={item.title} {...item} />
                ))}
              </div>
            </PanelCard>

            <PanelCard
              title="Analiz Geçmişi"
              buttonText={showAllHistory ? "Kısalt" : "Tümünü gör"}
              onButtonClick={() => {
                if (!history.length) {
                  showToast("Henüz analiz geçmişi yok.");
                  return;
                }
                setShowAllHistory((prev) => !prev);
              }}
            >
              {visibleHistory.length ? (
                <div className="space-y-3">
                  {visibleHistory.map((item, index) => (
                    <button
                      key={`${item.createdAt}-${index}`}
                      type="button"
                      onClick={() => {
                        setReport(item);
                        setQuestion(item.question);
                        showToast("Geçmiş analiz açıldı.");
                      }}
                      className="w-full rounded-2xl border border-purple-100 bg-white/80 p-3 text-left text-xs text-slate-600 transition hover:bg-purple-50"
                    >
                      <p className="mb-1 font-bold text-slate-900">
                        {item.question}
                      </p>
                      <p>{item.createdAt}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Henüz geçmiş analiz yok. İlk cevaptan sonra burada görünecek.
                </p>
              )}
            </PanelCard>
          </aside>
        </div>
      </section>

      {showDetails && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/80 bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-purple-500">
                  InciLab
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  Analiz Detayları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {report.createdAt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-purple-50"
              >
                Kapat
              </button>
            </div>

            <div className="space-y-4">
              <DetailBlock title="Kullanıcının Sorusu" content={report.question} />
              <DetailBlock title="Analiz Cevabı" content={report.answer} />
              <DetailBlock title="Detaylı Kimyasal Yorum" content={report.details} />
              <DetailList title="Muhtemel Nedenler" items={report.causes} />
              <DetailList title="Çözüm Önerileri" items={report.suggestions} />
              <DetailList title="Notlar / Uyarılar" items={report.notes} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportPDF}
                className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
              >
                Bu raporu PDF indir
              </button>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-2xl border border-purple-100 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-purple-50"
              >
                Panele dön
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}

function PanelFrame({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-2xl shadow-purple-100/50 backdrop-blur">
      {children}
    </section>
  );
}

function InfoMiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white/85 p-3">
      <p className="mb-1 text-xs font-bold text-purple-700">{title}</p>
      <p className="text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function PanelCard({
  title,
  buttonText,
  onButtonClick,
  children,
}: {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-2xl shadow-purple-100/50 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        <button
          type="button"
          onClick={onButtonClick}
          className="rounded-full border border-purple-100 bg-white px-3 py-1.5 text-xs font-bold text-purple-600 transition hover:bg-purple-50"
        >
          {buttonText}
        </button>
      </div>
      {children}
    </section>
  );
}

function SmallCard({
  title,
  desc,
  detail,
}: {
  title: string;
  desc: string;
  detail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-purple-100 bg-white/85 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 rounded-full border border-purple-100 px-3 py-1 text-xs font-bold text-purple-600 transition hover:bg-purple-50"
        >
          {open ? "Kapat" : "Detay"}
        </button>
      </div>

      {open && (
        <p className="mt-3 rounded-2xl bg-purple-50/80 p-3 text-sm leading-6 text-slate-600">
          {detail}
        </p>
      )}
    </div>
  );
}

function DetailBlock({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-3xl border border-purple-100 bg-purple-50/50 p-4">
      <h3 className="mb-2 font-black text-slate-950">{title}</h3>
      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
        {content || "Bilgi yok."}
      </p>
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-purple-100 bg-purple-50/50 p-4">
      <h3 className="mb-2 font-black text-slate-950">{title}</h3>
      {items.length ? (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">Bilgi yok.</p>
      )}
    </section>
  );
}
