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
  "Bir şampuan formülünde SLES yerine daha yumuşak alternatif ne kullanılabilir?",
  "Krem formülünde pH neden zamanla yükselir?",
];

const ingredientCards = [
  {
    title: "Niacinamide",
    desc: "Cilt bariyeri, ton eşitsizliği ve sebum dengesi için popüler aktif.",
    detail:
      "Genellikle %2-5 aralığında kullanılır. Çok düşük pH sistemlerde stabilite ve tolerans açısından dikkatli değerlendirilmelidir.",
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

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
};

const fetchFontAsBase64 = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Font indirilemedi.");
  }

  const buffer = await response.arrayBuffer();
  return arrayBufferToBase64(buffer);
};

const registerTurkishPdfFont = async (doc: any) => {
  const regularFontUrl =
    "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf";

  const boldFontUrl =
    "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Bold.ttf";

  const [regularBase64, boldBase64] = await Promise.all([
    fetchFontAsBase64(regularFontUrl),
    fetchFontAsBase64(boldFontUrl),
  ]);

  doc.addFileToVFS("NotoSans-Regular.ttf", regularBase64);
  doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");

  doc.addFileToVFS("NotoSans-Bold.ttf", boldBase64);
  doc.addFont("NotoSans-Bold.ttf", "NotoSans", "bold");

  return "NotoSans";
};

export default function InciLabPage() {
  const [question, setQuestion] = useState("");
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

  const visibleFormulas = showAllFormulas ? formulaCards : formulaCards.slice(0, 2);

  const visibleHistory = showAllHistory ? history : history.slice(0, 2);

  const reportPreview = useMemo(() => {
    if (!report?.answer) return "";
    return report.answer.length > 420
      ? `${report.answer.slice(0, 420)}...`
      : report.answer;
  }, [report]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const askInciLab = async () => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion) {
      showToast("Önce sorunu yaz kanka.");
      return;
    }

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

Kullanıcının sorusu:
${cleanQuestion}
`;

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
      showToast("Analiz cevabı hazır.");
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

    try {
      showToast("PDF hazırlanıyor...");

      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      let pdfFont = "helvetica";

      try {
        pdfFont = await registerTurkishPdfFont(doc);
      } catch {
        pdfFont = "helvetica";
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const margin = 16;
      const maxWidth = pageWidth - margin * 2;
      let y = 18;

      const setTextColor = (type: "dark" | "muted" | "soft" = "dark") => {
        if (type === "dark") doc.setTextColor(15, 23, 42);
        if (type === "muted") doc.setTextColor(71, 85, 105);
        if (type === "soft") doc.setTextColor(100, 116, 139);
      };

      const addPageBackground = () => {
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(9, 9, pageWidth - 18, pageHeight - 18, 5, 5, "F");

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.roundedRect(9, 9, pageWidth - 18, pageHeight - 18, 5, 5, "S");
      };

      const checkPage = (space = 20) => {
        if (y + space > pageHeight - 18) {
          doc.addPage();
          addPageBackground();
          y = 18;
        }
      };

      const addTitle = (text: string) => {
        checkPage(18);

        doc.setFont(pdfFont, "bold");
        doc.setFontSize(18);
        setTextColor("dark");
        doc.text(text, margin, y);

        y += 8;

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);

        y += 8;
      };

      const addMeta = (text: string) => {
        checkPage(8);

        doc.setFont(pdfFont, "normal");
        doc.setFontSize(9);
        setTextColor("soft");
        doc.text(text, margin, y);

        y += 7;
      };

      const addSection = (title: string, content: string | string[]) => {
        checkPage(24);

        const finalText = Array.isArray(content)
          ? content.length
            ? content.map((item, index) => `${index + 1}. ${item}`).join("\n")
            : "Bilgi yok."
          : content || "Bilgi yok.";

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin - 2, y - 5, maxWidth + 4, 9, 2, 2, "FD");

        doc.setFont(pdfFont, "bold");
        doc.setFontSize(11);
        setTextColor("dark");
        doc.text(title, margin, y);

        y += 8;

        doc.setFont(pdfFont, "normal");
        doc.setFontSize(10.2);
        setTextColor("muted");
        doc.setLineHeightFactor(1.35);

        const lines = doc.splitTextToSize(finalText, maxWidth) as string[];

        lines.forEach((line) => {
          checkPage(7);
          doc.text(line, margin, y);
          y += 5.7;
        });

        y += 5;
      };

      const addFooter = () => {
        const pageCount = doc.getNumberOfPages();

        for (let i = 1; i <= pageCount; i += 1) {
          doc.setPage(i);
          doc.setFont(pdfFont, "normal");
          doc.setFontSize(8);
          setTextColor("soft");

          doc.text("InciLab Analiz Raporu", margin, pageHeight - 9);
          doc.text(
            `${i} / ${pageCount}`,
            pageWidth - margin,
            pageHeight - 9,
            { align: "right" }
          );
        }
      };

      const today = new Date().toISOString().slice(0, 10);

      addPageBackground();

      addTitle("InciLab Analiz Raporu");
      addMeta(`Oluşturulma tarihi: ${report.createdAt}`);
      addMeta("Kimya · Kozmetik · Laboratuvar Analiz Asistanı");

      y += 3;

      addSection("Kullanıcının Sorusu", report.question);
      addSection("Analiz Cevabı", report.answer);
      addSection("Detaylı Açıklama", report.details);
      addSection("Muhtemel Nedenler", report.causes);
      addSection("Çözüm Önerileri", report.suggestions);
      addSection("Notlar / Uyarılar", report.notes);

      addFooter();

      doc.save(`incilab-analiz-raporu-${today}.pdf`);
      showToast("PDF indiriliyor.");
    } catch {
      showToast("PDF oluşturulamadı. Font veya jsPDF bağlantısı kontrol edilmeli.");
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff,#eef1f5_45%,#dfe5ec)] px-4 py-6 text-slate-900">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-500">
                Kimya · Kozmetik · Analiz Asistanı
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                InciLab
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Analiz sonucunu, formülasyon mantığını veya hammadde yorumunu yaz;
                ben sana anlaşılır, bilimsel ve uygulanabilir şekilde toparlayayım.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">Durum</p>
              <p>{loading ? "Analiz hazırlanıyor..." : "Hazır"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Analiz Sorusu
                </h2>
                <p className="text-sm text-slate-500">
                  Laboratuvar sonucu, formül problemi veya içerik sorusu yazabilirsin.
                </p>
              </div>
            </div>

            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Örn: Çıkış suyunda KOİ yüksek ama numune berrak değil. Kit ile ölçüm yaptım, neden olabilir?"
              className="min-h-[170px] w-full resize-none rounded-3xl border border-slate-200 bg-white/90 p-4 text-sm leading-6 text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {samplePrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuestion(item)}
                  className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={askInciLab}
                disabled={loading}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Temizle
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Analiz Cevabı
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cevap geldikten sonra detay, tümünü gör ve PDF butonları aktif çalışır.
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
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Detayları görüntüle
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!report) {
                        showToast("Önce analiz cevabı oluşturmalısın.");
                        return;
                      }
                      setShowDetails(true);
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Tümünü gör
                  </button>

                  <button
                    type="button"
                    onClick={exportPDF}
                    className="rounded-2xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"
                  >
                    PDF dışa aktar
                  </button>
                </div>
              </div>

              {report ? (
                <div className="space-y-4">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
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
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-500">
                  Henüz analiz cevabı yok. Sorunu yazıp “Analiz et”e basınca cevap burada
                  görünecek.
                </div>
              )}
            </div>
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
                      className="w-full rounded-2xl border border-slate-200 bg-white/80 p-3 text-left text-xs text-slate-600 transition hover:bg-slate-50"
                    >
                      <p className="mb-1 font-semibold text-slate-900">
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
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  InciLab
                </p>
                <h2 className="text-2xl font-bold text-slate-950">
                  Analiz Detayları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {report.createdAt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Bu raporu PDF indir
              </button>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Panele dön
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}

function InfoMiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3">
      <p className="mb-1 text-xs font-semibold text-slate-900">{title}</p>
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
    <section className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <button
          type="button"
          onClick={onButtonClick}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
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
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          {open ? "Kapat" : "Detay"}
        </button>
      </div>

      {open && (
        <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          {detail}
        </p>
      )}
    </div>
  );
}

function DetailBlock({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
      <h3 className="mb-2 font-semibold text-slate-950">{title}</h3>
      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
        {content || "Bilgi yok."}
      </p>
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
      <h3 className="mb-2 font-semibold text-slate-950">{title}</h3>
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
