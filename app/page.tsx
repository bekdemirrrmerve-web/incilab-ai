"use client";

import { useMemo, useRef, useState } from "react";

type FormulaIngredient = {
  name: string;
  percent: number;
  function: string;
};

type FormulaPhase = {
  title: string;
  percent: number;
  ingredients: FormulaIngredient[];
};

type Message = {
  role: "user" | "assistant";
  text: string;
};

const formulaPhases: FormulaPhase[] = [
  {
    title: "Faz A (Sulu Faz)",
    percent: 65,
    ingredients: [
      { name: "Deiyonize Su", percent: 55.6, function: "Çözücü" },
      { name: "Glycerin", percent: 5, function: "Nemlendirici" },
      { name: "Pentylene Glycol", percent: 3, function: "Nemlendirici / Çözücü" },
      { name: "Panthenol", percent: 1.4, function: "Yatıştırıcı" },
    ],
  },
  {
    title: "Faz B (Aktif Faz)",
    percent: 20,
    ingredients: [
      { name: "Niacinamide", percent: 5, function: "Aydınlatıcı / Sebum Dengesi" },
      { name: "Sodium Hyaluronate", percent: 0.3, function: "Nemlendirici" },
      { name: "Allantoin", percent: 0.2, function: "Yatıştırıcı" },
      { name: "Beta-Glucan", percent: 1, function: "Cilt Bariyeri Desteği" },
    ],
  },
  {
    title: "Faz C (Yağ Fazı)",
    percent: 5,
    ingredients: [
      { name: "Squalane", percent: 3, function: "Yumuşatıcı" },
      { name: "Caprylic/Capric Triglyceride", percent: 2, function: "Emollient" },
    ],
  },
  {
    title: "Faz D (Koruyucu / pH)",
    percent: 10,
    ingredients: [
      { name: "Phenoxyethanol & Ethylhexylglycerin", percent: 1, function: "Koruyucu" },
      { name: "Citric Acid / NaOH", percent: 0.2, function: "pH Ayarı" },
      { name: "Aqua q.s.", percent: 8.8, function: "Tamamlama" },
    ],
  },
];

const inciSuggestions = [
  "Niacinamide",
  "Panthenol",
  "Hyaluronic Acid",
  "Bakuchiol",
  "Peptides",
  "Centella Asiatica",
];

const sectorCards = [
  "Kozmetik",
  "Farmasötik",
  "Gıda",
  "Petrokimya",
  "Çevre Kimyası",
  "Tekstil & Boya",
];

export default function InciLabPage() {
  const [activeMenu, setActiveMenu] = useState("Ana Sayfa");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Merhaba, ben InciLab. Bana formülasyon, analiz sonucu, INCI, pH, stabilite veya mevzuatla ilgili soru sorabilirsin.",
    },
  ]);

  const [analysisQuestion, setAnalysisQuestion] = useState(
    "Hassas ciltler için nazik, nemlendirici etkili bir yüz temizleme jeli formülü önerir misin?"
  );
  const [analysisAnswer, setAnalysisAnswer] = useState(
    "Hassas ciltler için nazik ve nemlendirici etkili yüz temizleme jeli formülünü aşağıda öneriyorum."
  );
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [inciQuery, setInciQuery] = useState("Niacinamide");
  const [targetAmount, setTargetAmount] = useState(500);
  const [formulaPrompt, setFormulaPrompt] = useState(
    "Hassas ciltler için nemlendirici serum"
  );

  const [radarProduct, setRadarProduct] = useState("Hassas cilt serumu");
  const [radarPh, setRadarPh] = useState("5.5");
  const [radarActives, setRadarActives] = useState(
    "Niacinamide, Panthenol, Hyaluronic Acid"
  );
  const [radarPreservative, setRadarPreservative] = useState(
    "Phenoxyethanol & Ethylhexylglycerin"
  );
  const [radarResult, setRadarResult] = useState(
    "Bu alan formülün pH, aktif uyumu, koruyucu uyumu ve stabilite risklerini hızlıca yorumlamak için kullanılacak."
  );

  const [showDetail, setShowDetail] = useState(false);

  const homeRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const inciRef = useRef<HTMLDivElement | null>(null);
  const formulaRef = useRef<HTMLDivElement | null>(null);
  const analysisRef = useRef<HTMLDivElement | null>(null);
  const trendRef = useRef<HTMLDivElement | null>(null);
  const radarRef = useRef<HTMLDivElement | null>(null);
  const sectorRef = useRef<HTMLDivElement | null>(null);
  const libraryRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const totalPercent = useMemo(
    () => formulaPhases.reduce((sum, phase) => sum + phase.percent, 0),
    []
  );

  const totalGram = useMemo(() => {
    return formulaPhases.reduce((sum, phase) => {
      return (
        sum +
        phase.ingredients.reduce((inner, item) => {
          return inner + (targetAmount * item.percent) / 100;
        }, 0)
      );
    }, 0);
  }, [targetAmount]);

  const scrollTo = (label: string) => {
    setActiveMenu(label);

    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      "Ana Sayfa": homeRef,
      Sohbet: chatRef,
      "INCI Sorgula": inciRef,
      "Formül Oluştur": formulaRef,
      "Analiz Sonuçları": analysisRef,
      "Trend Bileşenler": trendRef,
      "Kimya Risk Radar": radarRef,
      "Endüstriyel Sektörler": sectorRef,
      Kütüphane: libraryRef,
      Favoriler: libraryRef,
      Ayarlar: settingsRef,
    };

    map[label]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const askGemini = async (prompt: string) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          prompt,
          question: prompt,
        }),
      });

      const data = await response.json().catch(() => null);

      const answer =
        data?.answer ||
        data?.reply ||
        data?.text ||
        data?.result ||
        data?.content ||
        data?.message ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "";

      if (!response.ok || !answer) {
        return "Cevabı alamadım kanka. Gemini route çalışıyor olabilir ama dönen cevap alanı farklı isimde olabilir. /api/gemini içinde answer, reply veya text döndürdüğünden emin ol.";
      }

      return answer;
    } catch {
      return "Bağlantı hatası oluştu. /api/gemini route, GEMINI_API_KEY veya Vercel environment ayarını kontrol etmek gerekiyor.";
    }
  };

  const sendChatMessage = async () => {
    const clean = chatInput.trim();
    if (!clean) return;

    setMessages((prev) => [...prev, { role: "user", text: clean }]);
    setChatInput("");
    setChatLoading(true);

    const prompt = `
Sen InciLab'ın karşılıklı mesajlaşma asistanısın.
Kullanıcıyla sohbet eder gibi ama bilimsel doğruluğu koruyarak cevap ver.
Kimya, kozmetik, analiz, formülasyon, INCI, pH, stabilite, mevzuat ve içerik araştırması konularında yardımcı ol.

Kullanıcının mesajı:
${clean}
`.trim();

    const answer = await askGemini(prompt);

    setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    setChatLoading(false);
  };

  const runAnalysis = async () => {
    const clean = analysisQuestion.trim();
    if (!clean) return;

    setAnalysisLoading(true);

    const prompt = `
Sen InciLab analiz motorusun.
Kullanıcının sorusunu teknik olarak analiz et.
Cevabı şu formatta ver:
1. Kısa yorum
2. Muhtemel nedenler
3. Kontrol edilmesi gerekenler
4. Çözüm önerileri
5. Dikkat notu

Kullanıcının analiz sorusu:
${clean}
`.trim();

    const answer = await askGemini(prompt);

    setAnalysisAnswer(answer);
    setAnalysisLoading(false);
  };

  const createFormula = () => {
    setAnalysisQuestion(`${formulaPrompt} - ${targetAmount} ml/g hedef miktar`);
    setAnalysisAnswer(
      "Formül oluşturuldu. Sağ panelde fazlara ayrılmış başlangıç reçetesi, yüzde oranları ve gram karşılıkları gösteriliyor. Bu taslak AR-GE başlangıç formülü gibi düşünülmelidir; stabilite, mikrobiyoloji, pH ve ambalaj uyumu ayrıca test edilmelidir."
    );
    scrollTo("Formül Oluştur");
  };

  const runRadar = async () => {
    const prompt = `
Sen InciLab Kimya Risk Radar modusun.
Aşağıdaki formülü pH, aktif uyumu, koruyucu uyumu, stabilite, irritasyon potansiyeli ve üretim riski açısından değerlendir.

Ürün tipi: ${radarProduct}
pH: ${radarPh}
Aktifler: ${radarActives}
Koruyucu: ${radarPreservative}

Cevabı şu formatta ver:
- Genel risk seviyesi
- pH yorumu
- Aktif uyumluluğu
- Koruyucu uyumu
- Stabilite riski
- Ne test edilmeli?
- Daha güvenli öneri
`.trim();

    setRadarResult("Radar çalışıyor, formül riskleri taranıyor...");
    const answer = await askGemini(prompt);
    setRadarResult(answer);
  };

  const exportPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF("p", "mm", "a4");
      const margin = 14;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;
      let y = 18;

      const clean = (text: string) =>
        text
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

      const addText = (title: string, content: string) => {
        if (y > 260) {
          doc.addPage();
          y = 18;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(clean(title), margin, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        const lines = doc.splitTextToSize(clean(content), maxWidth);

        lines.forEach((line: string) => {
          if (y > 280) {
            doc.addPage();
            y = 18;
          }
          doc.text(line, margin, y);
          y += 5;
        });

        y += 5;
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("InciLab Raporu", margin, y);
      y += 10;

      addText("Analiz Sorusu", analysisQuestion);
      addText("Analiz Cevabi", analysisAnswer);
      addText("Kimya Risk Radar", radarResult);
      addText("Hedef Miktar", `${targetAmount} ml / g`);
      addText(
        "Formul Fazlari",
        formulaPhases
          .map((phase) => {
            const items = phase.ingredients
              .map((item) => {
                const gram = ((targetAmount * item.percent) / 100).toFixed(2);
                return `${item.name}: %${item.percent} - ${gram} g - ${item.function}`;
              })
              .join("\n");

            return `${phase.title} - %${phase.percent}\n${items}`;
          })
          .join("\n\n")
      );

      doc.save("incilab-raporu.pdf");
    } catch {
      alert("PDF için jspdf paketi eksik olabilir. package.json içine jspdf eklediğinden emin ol.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f1ff] text-[#181a35]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(170,140,255,0.35),transparent_28%),radial-gradient(circle_at_75%_18%,rgba(210,225,255,0.6),transparent_30%),linear-gradient(135deg,#f7f4ff,#eef3ff,#ffffff)]" />

      <div className="mx-auto flex max-w-[1800px] gap-5 px-6 py-6">
        <aside className="sticky top-6 h-[calc(100vh-48px)] w-[280px] shrink-0 rounded-[32px] border border-white/70 bg-white/55 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.16)] backdrop-blur-2xl">
          <div className="mb-7 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-lg shadow-violet-100">
              <span className="text-2xl text-violet-500">⌬</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">InciLab</h1>
              <p className="text-xs text-slate-400">AI Laboratuvar Platformu</p>
            </div>
          </div>

          <div className="mb-5 h-px bg-slate-200/70" />

          <nav className="space-y-2">
            {[
              ["Ana Sayfa", "⌂"],
              ["Sohbet", "○"],
              ["INCI Sorgula", "⌕"],
              ["Formül Oluştur", "♙"],
              ["Analiz Sonuçları", "▧"],
              ["Kimya Risk Radar", "⚗"],
              ["Trend Bileşenler", "⌁"],
              ["Endüstriyel Sektörler", "⌘"],
              ["Kütüphane", "▫"],
              ["Favoriler", "♡"],
              ["Ayarlar", "⚙"],
            ].map(([label, icon]) => (
              <button
                key={label}
                onClick={() => scrollTo(label)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeMenu === label
                    ? "bg-gradient-to-r from-violet-500 to-violet-300 text-white shadow-lg shadow-violet-200"
                    : "text-slate-500 hover:bg-white/70 hover:text-violet-600"
                }`}
              >
                <span className="w-5 text-center text-xs">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 space-y-5">
          <div
            ref={homeRef}
            className="rounded-[32px] border border-white/70 bg-white/50 p-9 text-center shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <div className="mb-3 flex justify-end gap-3">
              {["⌕", "🔔", "☼", "IA"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "⌕") scrollTo("INCI Sorgula");
                    if (item === "IA") setChatOpen(true);
                  }}
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 text-sm text-slate-700 shadow-sm transition hover:scale-105 hover:text-violet-600"
                >
                  {item}
                </button>
              ))}
            </div>

            <h2 className="text-4xl font-light tracking-tight">
              Merhaba, bugün neyi keşfedelim?
            </h2>

            <p className="mt-5 text-base text-slate-500">
              InciLab AI Asistan; formülasyon, analiz, INCI ve kimya araştırmalarında yanında.
            </p>

            <div
              ref={chatRef}
              className="mx-auto mt-8 max-w-3xl rounded-[28px] bg-white/80 p-4 shadow-[0_18px_60px_rgba(123,97,255,0.14)]"
            >
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">
                    Karşılıklı Mesajlaşma
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">
                    InciLab ile sohbet ederek bilgi al
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Burası tek soru-cevap değil; kimya, kozmetik ve analiz konularını konuşarak ilerleteceğin alan.
                  </p>
                </div>

                <button
                  onClick={() => setChatOpen(true)}
                  className="rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-105"
                >
                  Mesajlaşmayı Aç →
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {[
                ["Formül Oluştur", "Formül Oluştur"],
                ["Analiz Yap", "Analiz Sonuçları"],
                ["INCI Sorgula", "INCI Sorgula"],
                ["Kimya Risk Radar", "Kimya Risk Radar"],
                ["Stabilite Tahmini", "Kimya Risk Radar"],
                ["Mevzuat Kontrolü", "Kütüphane"],
              ].map(([button, target]) => (
                <button
                  key={button}
                  onClick={() => scrollTo(target)}
                  className="rounded-full bg-white/70 px-5 py-3 text-xs text-slate-500 shadow-sm transition hover:bg-violet-100 hover:text-violet-700"
                >
                  {button}
                </button>
              ))}
            </div>
          </div>

          <div ref={analysisRef} className="grid gap-5 xl:grid-cols-2">
            <GlassCard>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium">Analiz Sorusu</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Bu alan kendi içinde soru alır.
                  </p>
                </div>
                <button
                  onClick={() => setShowDetail(true)}
                  className="rounded-2xl bg-white/75 px-4 py-2 text-xs text-slate-500 transition hover:text-violet-600"
                >
                  Tümünü Gör
                </button>
              </div>

              <textarea
                value={analysisQuestion}
                onChange={(event) => setAnalysisQuestion(event.target.value)}
                placeholder="Analiz etmek istediğin soruyu buraya yaz..."
                className="min-h-[190px] w-full resize-none rounded-[24px] border border-white/80 bg-white/70 p-5 text-sm leading-7 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-violet-100"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={runAnalysis}
                  disabled={analysisLoading}
                  className="rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 disabled:opacity-60"
                >
                  {analysisLoading ? "Analiz ediliyor..." : "Analiz Et →"}
                </button>

                <button
                  onClick={() =>
                    setAnalysisQuestion(
                      "KOİ çıkışta yüksek, numune berrak değil. Kit yöntemiyle ölçüm yaptım. Neden olabilir?"
                    )
                  }
                  className="rounded-2xl bg-white/80 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-violet-100"
                >
                  Örnek Soru
                </button>
              </div>
            </GlassCard>

            <GlassCard>
              <span className="rounded-full bg-violet-100 px-3 py-2 text-xs font-bold text-violet-600">
                CEVAP
              </span>

              <div className="mt-5 min-h-[230px] rounded-[24px] bg-white/65 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {analysisAnswer}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowDetail(true)}
                  className="rounded-2xl bg-white/80 px-5 py-3 font-semibold text-[#181a35] transition hover:bg-violet-100 hover:text-violet-700"
                >
                  Detayları Görüntüle →
                </button>

                <button
                  onClick={exportPDF}
                  className="rounded-2xl bg-[#181a35] px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
                >
                  PDF İndir
                </button>
              </div>
            </GlassCard>
          </div>

          <div
            ref={radarRef}
            className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">
                  Kimyaya Özel Alan
                </p>
                <h3 className="mt-1 text-2xl font-medium">Kimya Risk Radar</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Formülünü pH, aktif uyumu, koruyucu, stabilite ve irritasyon riski açısından hızlıca kontrol eder.
                </p>
              </div>

              <button
                onClick={runRadar}
                className="rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200"
              >
                Radarı Çalıştır →
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-3">
                <InputBox
                  label="Ürün tipi"
                  value={radarProduct}
                  onChange={setRadarProduct}
                />
                <InputBox label="pH" value={radarPh} onChange={setRadarPh} />
                <InputBox
                  label="Aktifler"
                  value={radarActives}
                  onChange={setRadarActives}
                />
                <InputBox
                  label="Koruyucu"
                  value={radarPreservative}
                  onChange={setRadarPreservative}
                />
              </div>

              <div className="rounded-[24px] bg-white/70 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold">Radar Sonucu</h4>
                  <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-600">
                    Ön Kontrol
                  </span>
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {radarResult}
                </p>
              </div>
            </div>
          </div>

          <div
            ref={inciRef}
            className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <h3 className="text-xl font-medium">INCI & Kimyasal Arama</h3>
            <p className="mt-2 text-sm text-slate-500">
              Kozmetik, kimyasal ve aktif madde hakkında detaylı bilgi edin.
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-[22px] bg-white/75 p-3">
              <span className="pl-3 text-violet-600">✣</span>
              <input
                value={inciQuery}
                onChange={(event) => setInciQuery(event.target.value)}
                placeholder="INCI adı yazın..."
                className="h-12 flex-1 bg-transparent text-sm outline-none"
              />
              <button
                onClick={() => {
                  setAnalysisQuestion(`${inciQuery} nedir, ne işe yarar?`);
                  setAnalysisAnswer(
                    `${inciQuery}, kozmetik formülasyonlarda kullanılan bir içeriktir. Kullanım amacı ürün tipine, pH değerine, yüzde oranına ve diğer hammaddelerle uyumuna göre değerlendirilmelidir.`
                  );
                  scrollTo("Analiz Sonuçları");
                }}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 text-white shadow-lg shadow-violet-200"
              >
                ⌕
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {inciSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => setInciQuery(item)}
                  className="rounded-full bg-white/70 px-4 py-2 text-xs text-slate-500 transition hover:bg-violet-100 hover:text-violet-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={trendRef}
            className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <h3 className="text-xl font-medium">Trend Bileşenler</h3>
            <p className="mt-2 text-sm text-slate-500">
              Kozmetik aktifleri ve kullanım mantıkları.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["Niacinamide", "Sebum dengesi, ton eşitsizliği ve bariyer desteği."],
                ["Panthenol", "Yatıştırıcı, nemlendirici ve bariyer destekleyici."],
                ["Peptides", "Yaşlanma karşıtı bakımda iletişim değeri yüksek aktif."],
              ].map(([title, desc]) => (
                <button
                  key={title}
                  onClick={() => {
                    setInciQuery(title);
                    scrollTo("INCI Sorgula");
                  }}
                  className="rounded-3xl bg-white/70 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:bg-white"
                >
                  <h4 className="font-semibold">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div
            ref={sectorRef}
            className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <h3 className="text-xl font-medium">Endüstriyel Sektörler</h3>
            <p className="mt-2 text-sm text-slate-500">
              Sektöre göre analiz ve içerik yorumlama modu.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {sectorCards.map((sector) => (
                <button
                  key={sector}
                  onClick={() => {
                    setChatInput(`${sector} alanında analiz yapmak istiyorum.`);
                    setChatOpen(true);
                  }}
                  className="rounded-3xl bg-white/70 p-5 text-left text-sm font-semibold shadow-sm transition hover:bg-violet-100 hover:text-violet-700"
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          <div
            ref={libraryRef}
            className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <h3 className="text-xl font-medium">Kütüphane & Favoriler</h3>
            <p className="mt-2 text-sm text-slate-500">
              Kaydedilmiş formüller, hammadde notları ve analiz raporları burada görünebilir.
            </p>
          </div>

          <div
            ref={settingsRef}
            className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <h3 className="text-xl font-medium">Ayarlar</h3>
            <p className="mt-2 text-sm text-slate-500">
              Tema, mod ve yardımcı seçenekler burada duracak.
            </p>
          </div>
        </section>

        <aside
          ref={formulaRef}
          className="sticky top-6 h-[calc(100vh-48px)] w-[430px] shrink-0 overflow-y-auto rounded-[32px] border border-white/70 bg-white/55 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.16)] backdrop-blur-2xl"
        >
          <h2 className="text-2xl font-medium">⚗ Formül Oluştur</h2>

          <div className="mt-6 flex items-center gap-3 rounded-[24px] bg-white/70 p-3 shadow-sm">
            <span className="pl-3 text-violet-700">✦</span>
            <input
              value={formulaPrompt}
              onChange={(event) => setFormulaPrompt(event.target.value)}
              className="h-12 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              onClick={createFormula}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 text-white shadow-lg shadow-violet-200 transition hover:scale-105"
            >
              →
            </button>
          </div>

          <h3 className="mt-6 text-sm font-bold">Hedef Miktar</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {[30, 50, 100, 250, 500, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => setTargetAmount(amount)}
                className={`rounded-full px-5 py-3 text-xs transition ${
                  targetAmount === amount
                    ? "bg-gradient-to-br from-violet-500 to-violet-300 text-white shadow-lg shadow-violet-200"
                    : "bg-white/70 text-slate-500 hover:bg-violet-100 hover:text-violet-700"
                }`}
              >
                {amount === 1000 ? "1 kg" : `${amount} ml`}
              </button>
            ))}
            <button
              onClick={() => {
                const custom = window.prompt("Hedef miktar kaç ml/g olsun?", "500");
                const value = Number(custom);
                if (!Number.isNaN(value) && value > 0) setTargetAmount(value);
              }}
              className="rounded-full bg-white/70 px-5 py-3 text-xs text-slate-500 hover:bg-violet-100 hover:text-violet-700"
            >
              Özel
            </button>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h3 className="text-lg font-medium">Formül Sonucu</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Hedef Miktar: <b>{targetAmount} ml</b> · Toplam:{" "}
                  <b>{totalGram.toFixed(2)} g</b> · Toplam %:{" "}
                  <b>{totalPercent.toFixed(2)}%</b>
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-600">
                Tamamlandı
              </span>
            </div>

            <div className="space-y-4">
              {formulaPhases.map((phase) => (
                <div
                  key={phase.title}
                  className="rounded-[24px] bg-white/75 p-5 shadow-sm"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <h4 className="font-bold">{phase.title}</h4>
                    <div className="text-right font-bold text-violet-600">
                      <p>% {phase.percent.toFixed(2)}</p>
                      <p className="text-sm">
                        {((targetAmount * phase.percent) / 100).toFixed(2)} g
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1.4fr_0.5fr_0.8fr_1.2fr] border-b border-slate-200 pb-2 text-xs font-bold text-slate-500">
                    <span>İçerik Adı</span>
                    <span>%</span>
                    <span>Miktar (g)</span>
                    <span>Fonksiyon</span>
                  </div>

                  {phase.ingredients.map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-[1.4fr_0.5fr_0.8fr_1.2fr] gap-2 py-3 text-xs text-slate-600"
                    >
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span>{item.percent.toFixed(2)}</span>
                      <span>{((targetAmount * item.percent) / 100).toFixed(2)}</span>
                      <span>{item.function}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={exportPDF}
                className="flex-1 rounded-2xl bg-[#181a35] px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                PDF İndir
              </button>
              <button
                onClick={() => setShowDetail(true)}
                className="flex-1 rounded-2xl bg-white/80 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
              >
                Detay Aç
              </button>
            </div>
          </div>
        </aside>
      </div>

      {chatOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#181a35]/45 p-5 backdrop-blur-md">
          <div className="flex h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">
                  InciLab Sohbet
                </p>
                <h2 className="mt-1 text-2xl font-semibold">Karşılıklı Mesajlaşma</h2>
              </div>

              <button
                onClick={() => setChatOpen(false)}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-violet-100 hover:text-violet-700"
              >
                Kapat
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-violet-50/50 p-5">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] rounded-3xl px-5 py-4 text-sm leading-7 ${
                      message.role === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="max-w-[220px] rounded-3xl bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
                  InciLab düşünüyor...
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-slate-100 p-5">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendChatMessage();
                }}
                placeholder="Mesajını yaz..."
                className="h-14 flex-1 rounded-2xl bg-slate-100 px-5 text-sm outline-none focus:ring-4 focus:ring-violet-100"
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading}
                className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#181a35]/45 p-5 backdrop-blur-md">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-500">
                  InciLab Detay
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Analiz Detayı</h2>
              </div>

              <button
                onClick={() => setShowDetail(false)}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-violet-100 hover:text-violet-700"
              >
                Kapat
              </button>
            </div>

            <div className="space-y-5">
              <DetailBox title="Analiz Sorusu" text={analysisQuestion} />
              <DetailBox title="Analiz Cevabı" text={analysisAnswer} />
              <DetailBox title="Kimya Risk Radar" text={radarResult} />
              <DetailBox
                title="Formülasyon Notu"
                text="Bu formül AR-GE başlangıç taslağıdır. Ticari ürün için stabilite, mikrobiyoloji, ambalaj uyumu, pH takibi ve mevzuat kontrolü yapılmalıdır."
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={exportPDF}
                className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                PDF İndir
              </button>
              <button
                onClick={() => setShowDetail(false)}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-violet-100"
              >
                Panele Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl">
      {children}
    </div>
  );
}

function DetailBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-violet-50/80 p-5">
      <h3 className="mb-2 font-semibold text-violet-700">{title}</h3>
      <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function InputBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[22px] bg-white/70 p-4">
      <span className="mb-2 block text-xs font-bold text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl bg-white/80 px-4 text-sm outline-none focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}
