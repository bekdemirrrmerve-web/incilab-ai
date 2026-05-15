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

type AnalysisItem = {
  question: string;
  answer: string;
  tags: string[];
  date: string;
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

const quickPrompts = [
  "Formül Oluştur",
  "Bileşen Analize",
  "INCI Sorgula",
  "Stabilite Tahmini",
  "Uyumluluk Kontrolü",
  "Mevzuat Kontrolü",
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
  const [mainQuestion, setMainQuestion] = useState("");
  const [inciQuery, setInciQuery] = useState("Niacinamide");
  const [targetAmount, setTargetAmount] = useState(500);
  const [formulaPrompt, setFormulaPrompt] = useState(
    "Hassas ciltler için nemlendirici serum"
  );
  const [showDetail, setShowDetail] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisItem>({
    question: "Hassas ciltler için nazik, nemlendirici etkili bir yüz temizleme jeli formülü önerir misin?",
    answer:
      "Hassas ciltler için nazik ve nemlendirici etkili yüz temizleme jeli formülünü aşağıda öneriyorum.",
    tags: ["Kozmetik", "Yüz Temizleme", "Hassas Cilt"],
    date: "23 May 2025 10:30",
  });

  const homeRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const inciRef = useRef<HTMLDivElement | null>(null);
  const formulaRef = useRef<HTMLDivElement | null>(null);
  const analysisRef = useRef<HTMLDivElement | null>(null);
  const trendRef = useRef<HTMLDivElement | null>(null);
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

  const handleMainSubmit = () => {
    const text = mainQuestion.trim();

    if (!text) {
      setAnalysisResult({
        question:
          "Hassas ciltler için nazik, nemlendirici etkili bir yüz temizleme jeli formülü önerir misin?",
        answer:
          "Hassas ciltler için nazik ve nemlendirici etkili yüz temizleme jeli formülünü aşağıda öneriyorum.",
        tags: ["Kozmetik", "Yüz Temizleme", "Hassas Cilt"],
        date: new Date().toLocaleString("tr-TR"),
      });
      scrollTo("Analiz Sonuçları");
      return;
    }

    setAnalysisResult({
      question: text,
      answer:
        "Bu isteğe göre InciLab ön değerlendirme hazırladı. Formülasyon, hammadde uyumu, pH, stabilite ve mevzuat açısından kontrol edilmesi gereken noktalar aşağıda toparlanabilir.",
      tags: ["InciLab", "Analiz", "Ön Değerlendirme"],
      date: new Date().toLocaleString("tr-TR"),
    });

    scrollTo("Analiz Sonuçları");
  };

  const createFormula = () => {
    setAnalysisResult({
      question: `${formulaPrompt} - ${targetAmount} ml/g hedef miktar`,
      answer:
        "Formül oluşturuldu. Sağ panelde fazlara ayrılmış başlangıç reçetesi, yüzde oranları ve gram karşılıkları gösteriliyor.",
      tags: ["Formülasyon", "Kozmetik", `${targetAmount} ml`],
      date: new Date().toLocaleString("tr-TR"),
    });

    scrollTo("Formül Oluştur");
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
      doc.text("InciLab Formulasyon Raporu", margin, y);
      y += 10;

      addText("Soru", analysisResult.question);
      addText("Cevap", analysisResult.answer);
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

      doc.save("incilab-formulasyon-raporu.pdf");
    } catch {
      alert("PDF için jspdf paketi eksik olabilir. Terminale npm i jspdf yaz.");
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
                  onClick={() => item === "⌕" && scrollTo("Sohbet")}
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
              InciLab AI Asistan, formülasyon, analiz ve içerik araştırmalarınızda yanınızda.
            </p>

            <div
              ref={chatRef}
              className="mx-auto mt-8 flex max-w-3xl items-center gap-3 rounded-[26px] bg-white/80 p-3 shadow-[0_18px_60px_rgba(123,97,255,0.14)]"
            >
              <span className="pl-3 text-violet-700">✦</span>
              <input
                value={mainQuestion}
                onChange={(event) => setMainQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleMainSubmit();
                }}
                placeholder="Bir sorun sorun veya ihtiyacınızı yazın..."
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleMainSubmit}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 text-xl text-white shadow-lg shadow-violet-200 transition hover:scale-105"
              >
                →
              </button>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {quickPrompts.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "Formül Oluştur") scrollTo("Formül Oluştur");
                    else if (item === "INCI Sorgula") scrollTo("INCI Sorgula");
                    else if (item === "Bileşen Analize") scrollTo("INCI Sorgula");
                    else if (item === "Mevzuat Kontrolü") scrollTo("Kütüphane");
                    else scrollTo("Analiz Sonuçları");
                  }}
                  className="rounded-full bg-white/70 px-5 py-3 text-xs text-slate-500 shadow-sm transition hover:bg-violet-100 hover:text-violet-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div ref={analysisRef} className="grid gap-5 xl:grid-cols-2">
            <GlassCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-medium">Analiz Sonucu</h3>
                <button
                  onClick={() => setShowDetail(true)}
                  className="rounded-2xl bg-white/75 px-4 py-2 text-xs text-slate-500 transition hover:text-violet-600"
                >
                  Tümünü Gör
                </button>
              </div>

              <div className="rounded-[24px] bg-white/70 p-6 shadow-sm">
                <span className="rounded-full bg-violet-100 px-3 py-2 text-xs font-bold text-violet-600">
                  SORU
                </span>
                <p className="mt-5 text-base leading-7">{analysisResult.question}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysisResult.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  TCA: 1 • {analysisResult.date}
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <span className="rounded-full bg-violet-100 px-3 py-2 text-xs font-bold text-violet-600">
                CEVAP
              </span>

              <p className="mt-5 text-base leading-7 text-slate-600">
                {analysisResult.answer}
              </p>

              <button
                onClick={() => setShowDetail(true)}
                className="mt-6 rounded-2xl bg-white/80 px-5 py-3 font-semibold text-[#181a35] transition hover:bg-violet-100 hover:text-violet-700"
              >
                Detayları Görüntüle →
              </button>

              <div className="mt-8 flex justify-end text-8xl text-violet-100">
                ⬡
              </div>
            </GlassCard>
          </div>

          <div
            ref={inciRef}
            className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_25px_80px_rgba(108,92,231,0.13)] backdrop-blur-2xl"
          >
            <h3 className="text-xl font-medium">INCI & Kimyasal Arama</h3>
            <p className="mt-2 text-sm text-slate-500">
              Kozmetik, kimyasal ve aktif madde hakkında detaylı bilgi edinin.
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
                  setAnalysisResult({
                    question: `${inciQuery} nedir, ne işe yarar?`,
                    answer: `${inciQuery}, kozmetik formülasyonlarda kullanılan bir içeriktir. Kullanım amacı ürün tipine, pH değerine, yüzde oranına ve diğer hammaddelerle uyumuna göre değerlendirilmelidir.`,
                    tags: ["INCI", "Hammadde", "Kozmetik"],
                    date: new Date().toLocaleString("tr-TR"),
                  });
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
              Güncel kozmetik aktifleri ve kullanım mantıkları.
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
                    setMainQuestion(`${sector} alanında analiz yapmak istiyorum.`);
                    scrollTo("Sohbet");
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

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/70 p-5">
                <h4 className="font-semibold">Favori Formül</h4>
                <p className="mt-2 text-sm text-slate-500">
                  Hassas ciltler için nemlendirici serum taslağı.
                </p>
              </div>
              <div className="rounded-3xl bg-white/70 p-5">
                <h4 className="font-semibold">Son Rapor</h4>
                <p className="mt-2 text-sm text-slate-500">
                  PDF indir butonuyla rapor alınabilir.
                </p>
              </div>
            </div>
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
              <DetailBox title="Soru" text={analysisResult.question} />
              <DetailBox title="Cevap" text={analysisResult.answer} />
              <DetailBox
                title="Formülasyon Notu"
                text="Bu formül AR-GE başlangıç taslağıdır. Ticari ürün için stabilite, mikrobiyoloji, ambalaj uyumu, pH takibi ve mevzuat kontrolü yapılmalıdır."
              />
              <DetailBox
                title="Üretim Sırası"
                text="Sulu faz hazırlanır, humektanlar çözündürülür, aktifler uygun sıcaklıkta eklenir. Yağ fazı ayrı hazırlanır. Koruyucu ve pH ayarı son aşamada kontrollü şekilde yapılır."
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
