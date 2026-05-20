"use client";

import React, { useMemo, useState } from "react";

type SectorKey =
  | "Kozmetik"
  | "İlaç"
  | "Gıda"
  | "Biyoteknoloji"
  | "Nanoteknoloji"
  | "Malzeme Bilimi";

type Phase = {
  key: string;
  name: string;
  percent: number;
  items: {
    name: string;
    inci: string;
    percent: number;
    function: string;
  }[];
};

type Formula = {
  title: string;
  productType: string;
  ph: string;
  viscosity: string;
  appearance: string;
  scent: string;
  skinFeel: string;
  phases: Phase[];
  method: string[];
};

const sectors: SectorKey[] = [
  "Kozmetik",
  "İlaç",
  "Gıda",
  "Biyoteknoloji",
  "Nanoteknoloji",
  "Malzeme Bilimi",
];

const sectorInfo: Record<SectorKey, string> = {
  Kozmetik:
    "Kozmetik alanında INCI, aktif bileşen, formülasyon, stabilite, pH, viskozite ve mevzuat değerlendirmesi yapılır.",
  İlaç:
    "İlaç alanında yardımcı maddeler, stabilite, çözünürlük, dozaj formu ve farmasötik kalite yaklaşımı öne çıkar.",
  Gıda:
    "Gıda alanında katkı maddesi, pH, raf ömrü, kalite kontrol ve analiz parametreleri değerlendirilebilir.",
  Biyoteknoloji:
    "Biyoteknoloji alanında kültür, enzim, protein, biyopolimer ve biyouyumluluk odaklı analizler yapılabilir.",
  Nanoteknoloji:
    "Nanoteknoloji alanında partikül boyutu, yüzey morfolojisi, dispersiyon, stabilite ve kaplama çalışmaları öne çıkar.",
  "Malzeme Bilimi":
    "Malzeme biliminde polimer, kompozit, mekanik dayanım, termal analiz ve yüzey karakterizasyonu değerlendirilebilir.",
};

const formulas: Record<string, Formula> = {
  serum: {
    title: "Hassas Ciltler İçin Nemlendirici Serum",
    productType: "Su bazlı serum",
    ph: "5.2 - 5.8",
    viscosity: "Düşük-orta / akışkan serum",
    appearance: "Şeffaf veya hafif opalimsi",
    scent: "Parfümsüz veya çok hafif kozmetik koku",
    skinFeel: "Hafif, nemli, yapışkanlığı düşük",
    phases: [
      {
        key: "A",
        name: "Sulu Faz",
        percent: 65,
        items: [
          { name: "Deiyonize Su", inci: "Aqua", percent: 55.6, function: "Çözücü" },
          { name: "Gliserin", inci: "Glycerin", percent: 5, function: "Nemlendirici" },
          {
            name: "Pentylene Glycol",
            inci: "Pentylene Glycol",
            percent: 3,
            function: "Nemlendirici / Çözücü",
          },
          { name: "Panthenol", inci: "Panthenol", percent: 1.4, function: "Yatıştırıcı" },
        ],
      },
      {
        key: "B",
        name: "Aktif Faz",
        percent: 20,
        items: [
          {
            name: "Niacinamide",
            inci: "Niacinamide",
            percent: 5,
            function: "Aydınlatıcı / Sebum Dengesi",
          },
          {
            name: "Sodium Hyaluronate",
            inci: "Sodium Hyaluronate",
            percent: 0.3,
            function: "Nemlendirici",
          },
          { name: "Allantoin", inci: "Allantoin", percent: 0.2, function: "Yatıştırıcı" },
          { name: "Beta-Glucan", inci: "Beta-Glucan", percent: 1, function: "Bariyer Desteği" },
        ],
      },
      {
        key: "C",
        name: "Destek Fazı",
        percent: 10,
        items: [
          {
            name: "Trehalose",
            inci: "Trehalose",
            percent: 2,
            function: "Nem / Osmoprotektif",
          },
          {
            name: "Ectoin",
            inci: "Ectoin",
            percent: 0.5,
            function: "Çevresel stres desteği",
          },
          {
            name: "Preservative Blend",
            inci: "Phenoxyethanol, Ethylhexylglycerin",
            percent: 0.9,
            function: "Koruyucu",
          },
        ],
      },
      {
        key: "D",
        name: "Katkı / Ayarlayıcı",
        percent: 5,
        items: [
          {
            name: "Citric Acid Solution",
            inci: "Citric Acid, Aqua",
            percent: 0.3,
            function: "pH Düzenleyici",
          },
          {
            name: "Sodium Citrate",
            inci: "Sodium Citrate",
            percent: 0.2,
            function: "Tamponlayıcı",
          },
        ],
      },
    ],
    method: [
      "Faz A için deiyonize su ana behere alınır. Gliserin ve pentylene glycol eklenir.",
      "Panthenol sulu faza eklenir ve tamamen çözünene kadar orta devirde karıştırılır.",
      "Faz B aktifleri ayrı sırayla eklenir. Niacinamide tamamen çözündürülür.",
      "Sodium Hyaluronate yavaşça serpilerek eklenir; topaklanmayı önlemek için düşük-orta devirde hidrate edilir.",
      "Allantoin ve Beta-Glucan eklenir. Karışım berrak veya homojen görünene kadar devam edilir.",
      "Faz C destek bileşenleri ve koruyucu sistem eklenir.",
      "pH ölçülür. Gerekirse sitrik asit / sodyum sitrat sistemiyle pH 5.2 - 5.8 aralığına alınır.",
      "Son kontrolde görünüm, koku, viskozite, pH ve mikrobiyal güvenlik planı değerlendirilir.",
    ],
  },
  cleanser: {
    title: "Hassas Ciltler İçin Yüz Temizleme Jeli",
    productType: "Sülfatsız jel temizleyici",
    ph: "5.0 - 5.5",
    viscosity: "Orta viskoziteli jel",
    appearance: "Şeffaf / hafif opak jel",
    scent: "Parfümsüz veya çok hafif temiz koku",
    skinFeel: "Nazik, gerginlik hissi düşük",
    phases: [
      {
        key: "A",
        name: "Sulu Faz",
        percent: 68,
        items: [
          { name: "Deiyonize Su", inci: "Aqua", percent: 58, function: "Çözücü" },
          { name: "Gliserin", inci: "Glycerin", percent: 4, function: "Nem desteği" },
          {
            name: "Hydroxyethylcellulose",
            inci: "Hydroxyethylcellulose",
            percent: 0.8,
            function: "Jel kıvam verici",
          },
        ],
      },
      {
        key: "B",
        name: "Yüzey Aktif Faz",
        percent: 24,
        items: [
          { name: "Coco-Glucoside", inci: "Coco-Glucoside", percent: 7, function: "Nazik temizleyici" },
          {
            name: "Cocamidopropyl Betaine",
            inci: "Cocamidopropyl Betaine",
            percent: 10,
            function: "Köpük destekleyici",
          },
          {
            name: "Decyl Glucoside",
            inci: "Decyl Glucoside",
            percent: 5,
            function: "Nazik yüzey aktif",
          },
        ],
      },
      {
        key: "C",
        name: "Aktif Destek",
        percent: 5,
        items: [
          { name: "Panthenol", inci: "Panthenol", percent: 1, function: "Yatıştırıcı" },
          { name: "Allantoin", inci: "Allantoin", percent: 0.2, function: "Konfor desteği" },
          { name: "Betaine", inci: "Betaine", percent: 2, function: "Nem desteği" },
        ],
      },
      {
        key: "D",
        name: "Koruma / pH",
        percent: 3,
        items: [
          {
            name: "Koruyucu Sistem",
            inci: "Phenoxyethanol, Ethylhexylglycerin",
            percent: 0.9,
            function: "Koruyucu",
          },
          { name: "Citric Acid", inci: "Citric Acid", percent: 0.2, function: "pH ayarı" },
        ],
      },
    ],
    method: [
      "Sulu faz hazırlanır. Su, gliserin ve kıvam verici kontrollü şekilde karıştırılır.",
      "Kıvam verici tam hidrate olana kadar beklenir.",
      "Yüzey aktifler köpürtmeden, düşük devirde sırayla eklenir.",
      "Aktif destek bileşenleri eklenir.",
      "Koruyucu sistem eklenir ve homojen karışım sağlanır.",
      "pH 5.0 - 5.5 aralığına ayarlanır.",
      "Köpük, berraklık, viskozite, pH ve cilt hissi kontrol edilir.",
    ],
  },
};

const trendIngredients = [
  { name: "Ectoin", rate: "+68%" },
  { name: "PDRN", rate: "+54%" },
  { name: "Bakuchiol", rate: "+47%" },
  { name: "Tremella Fuciformis", rate: "+35%" },
  { name: "Polyglutamic Acid", rate: "+31%" },
];

const inciData: Record<string, string> = {
  niacinamide:
    "Niacinamide; bariyer desteği, ton eşitsizliği görünümü ve sebum dengesi için kullanılan çok yönlü bir aktif bileşendir.",
  panthenol:
    "Panthenol; nem, yatıştırıcı etki ve cilt konforu için kullanılan provitamin B5 türevidir.",
  "sodium hyaluronate":
    "Sodium Hyaluronate; su tutma kapasitesiyle nem hissini artıran hyaluronik asit tuzudur.",
  bakuchiol:
    "Bakuchiol; retinoid alternatifi olarak konumlanan, yaşlanma karşıtı ürünlerde popüler bitkisel aktiflerden biridir.",
};

export default function Page() {
  const [activeMenu, setActiveMenu] = useState("Ana Sayfa");
  const [selectedSector, setSelectedSector] = useState<SectorKey>("Kozmetik");
  const [formulaKey, setFormulaKey] = useState<"serum" | "cleanser">("serum");
  const [targetAmount, setTargetAmount] = useState(500);
  const [mainQuestion, setMainQuestion] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [inciSearch, setInciSearch] = useState("Niacinamide");
  const [inciResult, setInciResult] = useState(inciData.niacinamide);
  const [market, setMarket] = useState("Avrupa Birliği (EU)");
  const [assistantAnswer, setAssistantAnswer] = useState(
    "Sorunu yazınca formül, INCI, mevzuat veya trend bileşen tarafında yanıt oluşturacağım."
  );
  const [showMethod, setShowMethod] = useState(true);
  const formula = formulas[formulaKey];

  const totalPercent = useMemo(() => {
    return formula.phases.reduce((sum, phase) => sum + phase.percent, 0);
  }, [formula]);

  const allItems = useMemo(() => {
    return formula.phases.flatMap((phase) =>
      phase.items.map((item) => ({
        ...item,
        phaseKey: phase.key,
        phaseName: phase.name,
      }))
    );
  }, [formula]);

  function scaledAmount(percent: number) {
    return (targetAmount * percent) / 100;
  }

  function createAnswer(text: string) {
    const q = text.toLocaleLowerCase("tr-TR");

    if (!text.trim()) {
      return "Bir soru yazarsan sana formül, bileşen, mevzuat veya stabilite tarafında cevap hazırlayabilirim.";
    }

    if (q.includes("jel") || q.includes("temizleme") || q.includes("yüz temizleme")) {
      setFormulaKey("cleanser");
      return "Hassas ciltler için sülfatsız, nazik yüz temizleme jeli formülü hazırlandı. Sağdaki formül panelinde faz dağılımını, miktarları ve üretim adımlarını görebilirsin.";
    }

    if (q.includes("serum") || q.includes("nem")) {
      setFormulaKey("serum");
      return "Nemlendirici serum formülü hazırlandı. Fazlar, aktifler, pH, viskozite ve hazırlama yöntemi sağ panelde güncellendi.";
    }

    if (q.includes("mevzuat")) {
      return `${market} pazarı için ön kontrol: İçerik listesi, yasaklı/kısıtlı bileşenler, kullanım oranı ve ürün kategorisi birlikte değerlendirilmelidir.`;
    }

    if (q.includes("inci") || q.includes("niacinamide") || q.includes("pantenol")) {
      return "INCI tarafında bileşenin adı, fonksiyonu, kullanım alanı, uyumluluk ve olası mevzuat notları birlikte incelenmelidir.";
    }

    if (q.includes("stabilite") || q.includes("ph") || q.includes("viskozite")) {
      return "Stabilite değerlendirmesinde pH drift, viskozite değişimi, renk/koku değişimi, faz ayrımı, mikrobiyal koruma ve ambalaj uyumluluğu takip edilmelidir.";
    }

    return "İsteğini aldım. Bunu formülasyon, bileşen analizi ve mevzuat kontrolü açısından değerlendirebilirim.";
  }

  function handleMainSend() {
    const answer = createAnswer(mainQuestion);
    setAssistantAnswer(answer);
    setMainQuestion("");
  }

  function handleAnalysis() {
    const answer = createAnswer(analysisText);
    setAssistantAnswer(answer);
  }

  function handleInciSearch() {
    const key = inciSearch.trim().toLocaleLowerCase("tr-TR");
    setInciResult(
      inciData[key] ||
        `${inciSearch}; ürün tipine göre fonksiyon, çözünürlük, kullanım oranı, pH uyumu ve mevzuat açısından değerlendirilmelidir.`
    );
  }

  function handleSectorClick(sector: SectorKey) {
    setSelectedSector(sector);
    setAssistantAnswer(sectorInfo[sector]);
    const area = document.getElementById("sector-area");
    area?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function downloadPdf() {
    const title = document.title;
    document.title = `InciLab - ${formula.title}`;
    setShowMethod(true);
    setTimeout(() => {
      window.print();
      document.title = title;
    }, 150);
  }

  function saveFormula() {
    const text = [
      `İnciLab Formül Raporu`,
      `Formül: ${formula.title}`,
      `Hedef miktar: ${targetAmount} ml / g`,
      `Toplam yüzde: ${totalPercent}%`,
      `pH: ${formula.ph}`,
      `Viskozite: ${formula.viscosity}`,
      "",
      "İçerik Listesi:",
      ...allItems.map(
        (i) =>
          `${i.phaseKey} - ${i.name} (${i.inci}) | %${i.percent} | ${scaledAmount(i.percent).toFixed(
            2
          )} g | ${i.function}`
      ),
      "",
      "Nasıl Yapılır:",
      ...formula.method.map((m, index) => `${index + 1}. ${m}`),
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "incilab-formul-raporu.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <aside className="sidebar no-print">
        <div className="brand">
          <div className="logoGem">⬡</div>
          <div>
            <strong>InciLab</strong>
            <span>AI Laboratuvar Platformu</span>
          </div>
        </div>

        <nav className="menu">
          {[
            "Ana Sayfa",
            "Sohbet",
            "INCI Sorgula",
            "Formül Oluştur",
            "Analiz Sonuçları",
            "Trend Bileşenler",
            "Endüstriyel Sektörler",
            "Kütüphane",
            "Favoriler",
            "Ayarlar",
          ].map((item) => (
            <button
              key={item}
              className={activeMenu === item ? "menuItem active" : "menuItem"}
              onClick={() => {
                setActiveMenu(item);
                if (item === "Formül Oluştur") {
                  document.getElementById("formula-panel")?.scrollIntoView({ behavior: "smooth" });
                }
                if (item === "INCI Sorgula") {
                  document.getElementById("inci-card")?.scrollIntoView({ behavior: "smooth" });
                }
                if (item === "Trend Bileşenler") {
                  document.getElementById("trend-card")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <span>{menuIcon(item)}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="usageCard">
          <h3>Günlük Kullanım</h3>
          <p>24 / 100 sorgu</p>
          <div className="usageTrack">
            <span />
          </div>
          <div className="usageLinks">
            <button>Pro Plan</button>
            <button>Planı Yükselt →</button>
          </div>
        </div>

        <div className="profileCard">
          <div className="avatar">AD</div>
          <div>
            <strong>Arzu Demir</strong>
            <span>AR-LAB Cosmetics</span>
          </div>
          <button>⌄</button>
        </div>

        <div className="glassPattern">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </aside>

      <section className="main">
        <header className="topBar no-print">
          <div>
            <h1>Merhaba, Arzu 👋</h1>
            <p>InciLab AI Asistan, formülasyon, analiz ve içerik araştırmalarınızda yanınızda.</p>
          </div>

          <div className="topActions">
            <button>🔔</button>
            <button>✦</button>
            <button>?</button>
            <button className="assistantMode">Asistan Modu <span /></button>
          </div>
        </header>

        <section className="layout">
          <div className="center">
            <section className="heroPanel">
              <div className="orb" />
              <div className="heroContent">
                <h2>Bugün nasıl yardımcı olabilirim?</h2>
                <p>Hassas, güvenilir ve mevzuata uygun çözümler için sorunuzu yazın.</p>

                <div className="mainInput">
                  <input
                    value={mainQuestion}
                    onChange={(e) => setMainQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleMainSend();
                    }}
                    placeholder="Bir soru sorun veya ihtiyacınızı yazın..."
                  />
                  <button onClick={handleMainSend}>→</button>
                </div>

                <div className="quickPills">
                  {[
                    "Bileşen Analizi",
                    "Stabilite Tahmini",
                    "Uyumluluk Kontrolü",
                    "Mevzuat Kontrolü",
                    "Formül Optimizasyonu",
                  ].map((pill) => (
                    <button
                      key={pill}
                      onClick={() => {
                        setAnalysisText(pill);
                        setAssistantAnswer(`${pill} için analiz alanı hazırlandı. Detay yazarsan sonucu özelleştiririm.`);
                      }}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section id="sector-area" className="sectorArea no-print">
              <p>Sektör Seçin</p>
              <div className="sectorButtons">
                {sectors.map((sector) => (
                  <button
                    key={sector}
                    className={selectedSector === sector ? "selected" : ""}
                    onClick={() => handleSectorClick(sector)}
                  >
                    <span>{sectorIcon(sector)}</span>
                    {sector}
                  </button>
                ))}
              </div>
              <small>✦ Sektöre tıklayarak o alana özel içerik ve analizlere ulaşabilirsiniz.</small>
            </section>

            <section className="assistantResponse">
              <strong>InciLab Asistan</strong>
              <p>{assistantAnswer}</p>
            </section>

            <section className="infoGrid">
              <article id="inci-card" className="softCard">
                <div className="cardTitle">
                  <div>
                    <span>🧬</span>
                    <h3>INCI Name / INCI Sorgula</h3>
                  </div>
                </div>
                <p>INCI ismi veya kimyasal adı ile hızlı sorgulama yapın.</p>
                <div className="miniSearch">
                  <input
                    value={inciSearch}
                    onChange={(e) => setInciSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInciSearch();
                    }}
                    placeholder="INCI veya kimyasal adı yazın..."
                  />
                  <button onClick={handleInciSearch}>⌕</button>
                </div>
                <div className="resultText">{inciResult}</div>
                <ul className="lastSearches">
                  <li>Niacinamide <span>Cilt Bakımı</span></li>
                  <li>Sodium Hyaluronate <span>Nemlendirici</span></li>
                  <li>Bakuchiol <span>Bitkisel Aktif</span></li>
                </ul>
              </article>

              <article className="softCard">
                <div className="cardTitle">
                  <div>
                    <span>🛡</span>
                    <h3>Mevzuat Kontrolü</h3>
                  </div>
                </div>
                <p>Formülünüzü global düzenlemelere göre kontrol edin.</p>
                <label>Pazar seçin</label>
                <select value={market} onChange={(e) => setMarket(e.target.value)}>
                  <option>Avrupa Birliği (EU)</option>
                  <option>Türkiye</option>
                  <option>ABD</option>
                  <option>Birleşik Krallık</option>
                  <option>Japonya</option>
                </select>
                <div className="checkList">
                  <p>✓ EC No: 231-545-4</p>
                  <p>✕ Yasaklı: Yok</p>
                  <p>✓ Kısıtlı: Konsantrasyon sınırı var</p>
                  <p>✓ Kullanım: Cilt bakım ürünleri</p>
                </div>
                <button className="linkBtn" onClick={() => setAssistantAnswer(`${market} için mevzuat ön kontrolü hazırlandı.`)}>
                  Mevzuat kontrolüne git →
                </button>
              </article>

              <article id="trend-card" className="softCard">
                <div className="cardTitle">
                  <div>
                    <span>⭐</span>
                    <h3>Trend Bileşenler</h3>
                  </div>
                </div>
                <p>Piyasanın yükselen içerik trendlerini keşfedin.</p>
                <div className="trendList">
                  {trendIngredients.map((trend, index) => (
                    <button
                      key={trend.name}
                      onClick={() => {
                        setInciSearch(trend.name);
                        setAssistantAnswer(`${trend.name} trend bileşeni seçildi. İçerik kartında fonksiyon ve formül uyumu sorgulanabilir.`);
                      }}
                    >
                      <span>{index + 1}</span>
                      <b>{trend.name}</b>
                      <i>{trend.rate}</i>
                    </button>
                  ))}
                </div>
                <button className="linkBtn" onClick={() => setAssistantAnswer("Trend bileşen listesi güncel formülasyon fikirleri için hazırlandı.")}>
                  Tüm trendleri gör →
                </button>
              </article>
            </section>

            <section className="methodWide">
              <div className="methodHead">
                <div>
                  <h3>Nasıl Yapılır? Hazırlama Aşamaları</h3>
                  <p>Formülün laboratuvar ölçekli üretim adımlarını faz faz gösterir.</p>
                </div>
                <button onClick={() => setShowMethod((v) => !v)}>{showMethod ? "Gizle" : "Göster"}</button>
              </div>

              {showMethod && (
                <ol>
                  {formula.method.map((step, index) => (
                    <li key={step}>
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="analysisPanel no-print">
              <h3>Analiz Sorusu</h3>
              <p>Spesifik bir analiz talebinizi yazın, en uygun cevabı birlikte oluşturalım.</p>
              <div className="analysisInput">
                <input
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAnalysis();
                  }}
                  placeholder="Örn. Hassas ciltler için nazik, nemlendirici bir yüz temizleme jeli formülü oluşturur musun?"
                />
                <button onClick={handleAnalysis}>✧ Analiz Başlat</button>
              </div>
              <div className="analysisLinks">
                <button onClick={() => setAnalysisText("Hassas ciltler için serum formülü oluştur")}>📎 Örnek Soru</button>
                <button onClick={() => setAnalysisText("Niacinamide pH uyumu nedir?")}>⚙ İçerik Uyumu</button>
                <button onClick={() => setAnalysisText("Mevzuat kontrolü yap")}>🛡 Mevzuat</button>
              </div>
              <div className="labGlassDecor">
                <span />
                <span />
                <span />
              </div>
            </section>
          </div>

          <aside id="formula-panel" className="rightPanel">
            <section className="formulaCreate no-print">
              <h2>⚗ Formül Oluştur</h2>
              <label>Formül Adı</label>
              <div className="formulaName">
                <input
                  value={formula.title}
                  onChange={() => {}}
                  readOnly
                />
                <button onClick={() => setFormulaKey(formulaKey === "serum" ? "cleanser" : "serum")}>✎</button>
              </div>

              <label>Fazlar</label>
              <div className="phaseButtons">
                {formula.phases.map((phase) => (
                  <button key={phase.key}>
                    <b>Faz {phase.key}</b>
                    <span>% {phase.percent.toFixed(2).replace(".", ",")}</span>
                  </button>
                ))}
              </div>

              <label>Hedef Miktar</label>
              <div className="amountButtons">
                {[30, 50, 100, 250, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    className={targetAmount === amount ? "active" : ""}
                    onClick={() => setTargetAmount(amount)}
                  >
                    {amount === 1000 ? "1 L" : `${amount} ml`}
                  </button>
                ))}
              </div>
            </section>

            <section className="formulaResult">
              <div className="resultHead">
                <div>
                  <h2>🧪 Formül Sonucu</h2>
                  <p>
                    Hedef Miktar: <b>{targetAmount} ml</b> · Toplam:{" "}
                    <b>{targetAmount.toFixed(2).replace(".", ",")} g</b> · Toplam %:{" "}
                    <b>{totalPercent.toFixed(2).replace(".", ",")}%</b>
                  </p>
                </div>
                <span>Uyumlu</span>
              </div>

              <div className="phaseResultList">
                {formula.phases.map((phase) => (
                  <article key={phase.key}>
                    <div className="phaseResultHead">
                      <h3>Faz {phase.key} <small>({phase.name})</small></h3>
                      <strong>
                        % {phase.percent.toFixed(2).replace(".", ",")}
                        <br />
                        <small>{scaledAmount(phase.percent).toFixed(2).replace(".", ",")} g</small>
                      </strong>
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th>İçerik Adı</th>
                          <th>%</th>
                          <th>Miktar (g)</th>
                          <th>Fonksiyon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phase.items.map((item) => (
                          <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.percent.toFixed(2).replace(".", ",")}</td>
                            <td>{scaledAmount(item.percent).toFixed(2).replace(".", ",")}</td>
                            <td>{item.function}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </article>
                ))}
              </div>

              <div className="summaryBox">
                <h3>Formül Özeti</h3>
                <div>
                  <p><b>pH:</b> {formula.ph}</p>
                  <p><b>Viskozite:</b> {formula.viscosity}</p>
                  <p><b>Görünüm:</b> {formula.appearance}</p>
                  <p><b>Koku:</b> {formula.scent}</p>
                  <p><b>Hissiyat:</b> {formula.skinFeel}</p>
                </div>
              </div>

              <div className="pdfButtons no-print">
                <button onClick={saveFormula}>Formülü Kaydet</button>
                <button onClick={downloadPdf}>▣ PDF İndir</button>
              </div>
              <p className="pdfNote">Rapor, içerik listesi, hazırlama yöntemi ve mevzuat özeti dahildir.</p>
            </section>
          </aside>
        </section>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        :root {
          --ink: #16213f;
          --muted: #73809d;
          --line: rgba(255, 255, 255, 0.72);
          --card: rgba(255, 255, 255, 0.58);
          --card-strong: rgba(255, 255, 255, 0.78);
          --pink: #ff9bd6;
          --lila: #b79cff;
          --blue: #a7dfff;
          --mint: #a9f7de;
          --yellow: #fff1a8;
          --violet: #7b61ff;
          --cyan: #48d7e8;
        }

        body {
          margin: 0;
          min-height: 100vh;
          color: var(--ink);
          background:
            radial-gradient(circle at 8% 12%, rgba(255, 155, 214, 0.36), transparent 24%),
            radial-gradient(circle at 38% 8%, rgba(183, 156, 255, 0.35), transparent 28%),
            radial-gradient(circle at 68% 14%, rgba(169, 247, 222, 0.30), transparent 26%),
            radial-gradient(circle at 88% 10%, rgba(255, 241, 168, 0.34), transparent 28%),
            radial-gradient(circle at 48% 96%, rgba(167, 223, 255, 0.38), transparent 32%),
            linear-gradient(135deg, #fbf7ff 0%, #f6fbff 46%, #fff8fb 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }

        button, input, select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          padding: 16px;
        }

        .sidebar,
        .heroPanel,
        .softCard,
        .analysisPanel,
        .formulaCreate,
        .formulaResult,
        .assistantResponse,
        .methodWide {
          border: 1px solid var(--line);
          background:
            linear-gradient(145deg, rgba(255,255,255,.72), rgba(255,255,255,.38)),
            radial-gradient(circle at top left, rgba(255,155,214,.16), transparent 30%),
            radial-gradient(circle at bottom right, rgba(169,247,222,.16), transparent 34%);
          box-shadow:
            0 18px 60px rgba(115, 103, 180, 0.11),
            inset 0 1px 0 rgba(255,255,255,.92);
          backdrop-filter: blur(20px);
        }

        .sidebar {
          position: sticky;
          top: 16px;
          height: calc(100vh - 32px);
          border-radius: 30px;
          padding: 26px;
          overflow: hidden;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(115,128,157,.14);
        }

        .logoGem {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          font-size: 28px;
          color: #8d7cff;
          background:
            linear-gradient(135deg, rgba(255,155,214,.55), rgba(167,223,255,.72), rgba(169,247,222,.52)),
            rgba(255,255,255,.72);
          box-shadow: 0 14px 32px rgba(123,97,255,.16);
        }

        .brand strong {
          display: block;
          font-size: 28px;
          letter-spacing: -0.05em;
        }

        .brand span {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 12px;
        }

        .menu {
          display: grid;
          gap: 9px;
          margin-top: 22px;
        }

        .menuItem {
          width: 100%;
          height: 46px;
          border: 0;
          border-radius: 16px;
          background: transparent;
          color: #405070;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 13px;
          text-align: left;
          font-weight: 650;
        }

        .menuItem span {
          width: 24px;
          opacity: .78;
        }

        .menuItem.active {
          color: white;
          background:
            linear-gradient(100deg, #8d7cff, #d997ff 44%, #ff9bd6 100%);
          box-shadow:
            0 12px 30px rgba(183,156,255,.38),
            inset 0 1px 0 rgba(255,255,255,.36);
        }

        .usageCard,
        .profileCard {
          border: 1px solid rgba(255,255,255,.72);
          background: rgba(255,255,255,.48);
          border-radius: 22px;
          padding: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.8);
        }

        .usageCard {
          margin-top: 22px;
        }

        .usageCard h3 {
          margin: 0 0 8px;
          font-size: 15px;
        }

        .usageCard p {
          margin: 0 0 10px;
          color: #405070;
          font-size: 13px;
        }

        .usageTrack {
          height: 10px;
          border-radius: 99px;
          background: rgba(115,128,157,.18);
          overflow: hidden;
        }

        .usageTrack span {
          display: block;
          height: 100%;
          width: 32%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--pink), var(--blue), var(--mint));
        }

        .usageLinks {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
        }

        .usageLinks button,
        .profileCard button {
          border: 0;
          background: transparent;
          color: #6f61e8;
          font-weight: 700;
        }

        .profileCard {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 46px 1fr 30px;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 900;
          color: white;
          background: linear-gradient(135deg, var(--pink), var(--blue), var(--lila));
          box-shadow: 0 14px 30px rgba(123,97,255,.2);
        }

        .profileCard strong {
          display: block;
          font-size: 14px;
        }

        .profileCard span {
          color: var(--muted);
          font-size: 12px;
        }

        .glassPattern {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: -4px;
          height: 94px;
          pointer-events: none;
          opacity: .72;
        }

        .glassPattern:before,
        .labGlassDecor:before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, transparent 0 8%, rgba(112, 211, 241, .26) 8% 9%, transparent 9%),
            linear-gradient(90deg, transparent 0 28%, rgba(255, 155, 214, .28) 28% 29%, transparent 29%),
            linear-gradient(90deg, transparent 0 46%, rgba(183, 156, 255, .24) 46% 47%, transparent 47%);
        }

        .glassPattern i,
        .labGlassDecor span {
          position: absolute;
          bottom: 0;
          width: 28px;
          height: 52px;
          border: 2px solid rgba(157, 206, 230, .45);
          border-top: 0;
          border-radius: 0 0 12px 12px;
          background: linear-gradient(180deg, transparent 42%, rgba(255,155,214,.36));
        }

        .glassPattern i:nth-child(1) { left: 6px; height: 44px; }
        .glassPattern i:nth-child(2) { left: 42px; height: 66px; background: linear-gradient(180deg, transparent 40%, rgba(169,247,222,.42)); }
        .glassPattern i:nth-child(3) { left: 82px; height: 52px; background: linear-gradient(180deg, transparent 44%, rgba(167,223,255,.42)); }
        .glassPattern i:nth-child(4) { left: 126px; height: 74px; background: linear-gradient(180deg, transparent 42%, rgba(255,241,168,.42)); }
        .glassPattern i:nth-child(5) { left: 178px; height: 48px; background: linear-gradient(180deg, transparent 42%, rgba(183,156,255,.35)); }

        .main {
          min-width: 0;
        }

        .topBar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 10px 16px;
        }

        .topBar h1 {
          margin: 0;
          font-size: 34px;
          letter-spacing: -0.055em;
        }

        .topBar p {
          margin: 8px 0 0;
          color: var(--muted);
        }

        .topActions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .topActions button {
          border: 1px solid rgba(255,255,255,.72);
          background: rgba(255,255,255,.64);
          color: #495978;
          border-radius: 16px;
          min-width: 44px;
          height: 44px;
          padding: 0 14px;
          box-shadow: 0 12px 28px rgba(115,103,180,.10);
        }

        .assistantMode {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          color: #9b6af9 !important;
        }

        .assistantMode span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #42d9b5;
          box-shadow: 0 0 0 4px rgba(66,217,181,.16);
        }

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 500px;
          gap: 20px;
        }

        .center {
          display: grid;
          gap: 18px;
        }

        .heroPanel {
          border-radius: 32px;
          padding: 28px;
          display: grid;
          grid-template-columns: 88px 1fr;
          gap: 22px;
          position: relative;
          overflow: hidden;
        }

        .heroPanel:before,
        .formulaCreate:before,
        .formulaResult:before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 10%, rgba(255,155,214,.18), transparent 26%),
            radial-gradient(circle at 72% 12%, rgba(169,247,222,.22), transparent 26%),
            radial-gradient(circle at 88% 78%, rgba(255,241,168,.18), transparent 30%);
          pointer-events: none;
        }

        .orb {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 28%, white, rgba(255,255,255,.2) 22%, transparent 28%),
            conic-gradient(from 35deg, var(--pink), var(--blue), var(--mint), var(--yellow), var(--lila), var(--pink));
          box-shadow:
            0 18px 40px rgba(123,97,255,.20),
            inset 0 0 24px rgba(255,255,255,.55);
          position: relative;
          z-index: 1;
        }

        .heroContent {
          position: relative;
          z-index: 1;
        }

        .heroContent h2 {
          margin: 8px 0 6px;
          font-size: 22px;
        }

        .heroContent p {
          margin: 0 0 18px;
          color: #405070;
        }

        .mainInput,
        .analysisInput,
        .miniSearch {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,.68);
          border: 1px solid rgba(255,255,255,.85);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.9),
            0 14px 34px rgba(115,103,180,.08);
        }

        .mainInput {
          height: 70px;
          border-radius: 999px;
          padding: 9px;
        }

        .mainInput input,
        .analysisInput input,
        .miniSearch input,
        .formulaName input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--ink);
          padding: 0 18px;
        }

        .mainInput button,
        .analysisInput button {
          border: 0;
          color: white;
          font-weight: 900;
          background:
            linear-gradient(135deg, var(--pink), var(--lila) 48%, var(--blue));
          box-shadow: 0 18px 34px rgba(183,156,255,.28);
        }

        .mainInput button {
          width: 58px;
          height: 58px;
          border-radius: 22px;
          font-size: 30px;
        }

        .quickPills {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .quickPills button,
        .amountButtons button,
        .sectorButtons button,
        .analysisLinks button {
          border: 1px solid rgba(255,255,255,.8);
          background: rgba(255,255,255,.56);
          color: #405070;
          border-radius: 999px;
          padding: 12px 20px;
          font-weight: 700;
          box-shadow: 0 10px 24px rgba(115,103,180,.06);
        }

        .sectorArea {
          padding: 0 10px;
        }

        .sectorArea p {
          margin: 0 0 10px;
          color: #51617f;
        }

        .sectorButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .sectorButtons button {
          border-radius: 17px;
          min-width: 142px;
        }

        .sectorButtons button.selected {
          color: #6f54e9;
          background: linear-gradient(135deg, rgba(255,255,255,.72), rgba(255,155,214,.20), rgba(167,223,255,.20));
          box-shadow: 0 14px 30px rgba(123,97,255,.13);
        }

        .sectorButtons span {
          margin-right: 9px;
        }

        .sectorArea small {
          display: block;
          margin-top: 13px;
          color: #73809d;
        }

        .assistantResponse {
          border-radius: 24px;
          padding: 16px 18px;
        }

        .assistantResponse strong {
          color: #7b61ff;
        }

        .assistantResponse p {
          margin: 7px 0 0;
          color: #405070;
          line-height: 1.6;
        }

        .infoGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .softCard {
          border-radius: 26px;
          padding: 22px;
        }

        .cardTitle > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cardTitle span {
          font-size: 20px;
        }

        .softCard h3,
        .methodWide h3,
        .analysisPanel h3,
        .formulaResult h2,
        .formulaCreate h2 {
          margin: 0;
        }

        .softCard p,
        .methodWide p,
        .analysisPanel p,
        .formulaResult p {
          color: #66718e;
          line-height: 1.55;
        }

        .miniSearch {
          height: 48px;
          border-radius: 18px;
          margin: 14px 0;
        }

        .miniSearch button,
        .formulaName button {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 15px;
          background: rgba(255,255,255,.58);
          color: #7b61ff;
        }

        .resultText {
          min-height: 56px;
          color: #405070;
          font-size: 13px;
          line-height: 1.5;
        }

        .lastSearches {
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
          display: grid;
          gap: 8px;
        }

        .lastSearches li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 12px;
          background: rgba(255,255,255,.48);
          padding: 8px 10px;
          color: #405070;
          font-size: 13px;
        }

        .lastSearches span {
          color: #7b61ff;
          background: rgba(183,156,255,.16);
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 11px;
        }

        .softCard label,
        .formulaCreate label {
          display: block;
          margin: 14px 0 8px;
          color: #405070;
          font-weight: 800;
          font-size: 13px;
        }

        select {
          width: 100%;
          height: 48px;
          border: 1px solid rgba(255,255,255,.8);
          background: rgba(255,255,255,.6);
          border-radius: 16px;
          padding: 0 14px;
          outline: 0;
          color: #16213f;
        }

        .checkList {
          margin-top: 12px;
          border-radius: 18px;
          background: rgba(255,255,255,.46);
          padding: 12px;
        }

        .checkList p {
          margin: 5px 0;
          font-size: 13px;
        }

        .linkBtn {
          margin-top: 12px;
          border: 0;
          background: transparent;
          color: #7b61ff;
          font-weight: 800;
        }

        .trendList {
          display: grid;
          gap: 9px;
        }

        .trendList button {
          border: 0;
          background: rgba(255,255,255,.46);
          border-radius: 14px;
          padding: 9px;
          display: grid;
          grid-template-columns: 28px 1fr 48px;
          align-items: center;
          gap: 8px;
          color: #405070;
          text-align: left;
        }

        .trendList span {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,155,214,.42), rgba(167,223,255,.45));
          font-size: 12px;
        }

        .trendList i {
          font-style: normal;
          color: #66718e;
          font-size: 12px;
          text-align: right;
        }

        .methodWide {
          border-radius: 28px;
          padding: 22px;
        }

        .methodHead {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: start;
        }

        .methodHead button {
          border: 0;
          border-radius: 999px;
          padding: 10px 14px;
          color: #7b61ff;
          background: rgba(255,255,255,.58);
          font-weight: 800;
        }

        .methodWide ol {
          list-style: none;
          margin: 16px 0 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .methodWide li {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255,255,255,.44);
        }

        .methodWide li span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          font-weight: 900;
          background: linear-gradient(135deg, var(--pink), var(--lila), var(--blue));
        }

        .methodWide li p {
          margin: 5px 0 0;
        }

        .analysisPanel {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          padding: 24px;
        }

        .analysisInput {
          height: 62px;
          border-radius: 20px;
          padding: 8px;
          margin-top: 14px;
        }

        .analysisInput button {
          height: 48px;
          border-radius: 18px;
          padding: 0 24px;
          white-space: nowrap;
        }

        .analysisLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 13px;
        }

        .labGlassDecor {
          position: absolute;
          right: 26px;
          bottom: 4px;
          width: 170px;
          height: 92px;
          pointer-events: none;
          opacity: .7;
        }

        .labGlassDecor span:nth-child(1) { right: 18px; height: 60px; background: linear-gradient(180deg, transparent 42%, rgba(255,155,214,.38)); }
        .labGlassDecor span:nth-child(2) { right: 56px; height: 82px; background: linear-gradient(180deg, transparent 42%, rgba(167,223,255,.42)); }
        .labGlassDecor span:nth-child(3) { right: 96px; height: 48px; background: linear-gradient(180deg, transparent 42%, rgba(169,247,222,.42)); }

        .rightPanel {
          position: sticky;
          top: 16px;
          height: calc(100vh - 32px);
          overflow: auto;
          padding-right: 2px;
          display: grid;
          gap: 16px;
          align-content: start;
        }

        .rightPanel::-webkit-scrollbar {
          width: 8px;
        }

        .rightPanel::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(183,156,255,.35);
        }

        .formulaCreate,
        .formulaResult {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          padding: 24px;
        }

        .formulaCreate > *,
        .formulaResult > * {
          position: relative;
          z-index: 1;
        }

        .formulaName {
          height: 52px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255,255,255,.82);
          background: rgba(255,255,255,.58);
          border-radius: 18px;
        }

        .phaseButtons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .phaseButtons button {
          min-height: 72px;
          border: 1px solid rgba(255,255,255,.82);
          background: rgba(255,255,255,.48);
          border-radius: 18px 18px 22px 22px;
          color: #405070;
          clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%, 0 10px);
        }

        .phaseButtons button:first-child {
          border-color: rgba(183,156,255,.82);
          color: #7b61ff;
          box-shadow: inset 0 0 0 1px rgba(183,156,255,.18);
        }

        .phaseButtons b,
        .phaseButtons span {
          display: block;
        }

        .phaseButtons span {
          margin-top: 6px;
          font-size: 12px;
        }

        .amountButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .amountButtons button.active {
          color: white;
          background: linear-gradient(135deg, var(--pink), var(--lila), var(--blue));
          box-shadow: 0 12px 28px rgba(183,156,255,.22);
        }

        .resultHead {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: start;
          margin-bottom: 16px;
        }

        .resultHead h2 {
          font-size: 20px;
        }

        .resultHead p {
          margin: 8px 0 0;
          font-size: 13px;
        }

        .resultHead > span {
          border-radius: 999px;
          padding: 7px 12px;
          color: #0b8f60;
          background: rgba(169,247,222,.34);
          font-size: 12px;
          font-weight: 900;
        }

        .phaseResultList {
          display: grid;
          gap: 14px;
        }

        .phaseResultList article {
          border-radius: 20px;
          background: rgba(255,255,255,.58);
          padding: 16px;
          border: 1px solid rgba(255,255,255,.78);
        }

        .phaseResultHead {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: start;
          margin-bottom: 12px;
        }

        .phaseResultHead h3 {
          margin: 0;
          font-size: 16px;
        }

        .phaseResultHead small {
          color: #66718e;
        }

        .phaseResultHead strong {
          color: #7b61ff;
          text-align: right;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border-bottom: 1px solid rgba(115,128,157,.13);
          padding: 9px 6px;
          text-align: left;
          font-size: 12px;
          color: #405070;
          vertical-align: top;
        }

        th {
          color: #66718e;
          font-size: 11px;
          font-weight: 900;
        }

        td:first-child {
          font-weight: 800;
          color: #23304f;
        }

        .summaryBox {
          margin-top: 16px;
          border-radius: 20px;
          background: rgba(255,255,255,.50);
          border: 1px solid rgba(255,255,255,.78);
          padding: 16px;
        }

        .summaryBox h3 {
          margin: 0 0 10px;
        }

        .summaryBox div {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 14px;
        }

        .summaryBox p {
          margin: 0;
          font-size: 13px;
        }

        .pdfButtons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .pdfButtons button {
          border: 0;
          height: 54px;
          border-radius: 18px;
          color: white;
          font-weight: 900;
          background: linear-gradient(100deg, var(--pink), var(--lila), var(--blue), var(--mint));
          box-shadow: 0 16px 36px rgba(183,156,255,.24);
        }

        .pdfButtons button:first-child {
          background: rgba(255,255,255,.55);
          color: #7b61ff;
          border: 1px solid rgba(255,255,255,.85);
        }

        .pdfNote {
          text-align: center;
          font-size: 12px;
          margin: 14px 0 0;
        }

        @media (max-width: 1260px) {
          .page {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: relative;
            height: auto;
          }

          .layout {
            grid-template-columns: 1fr;
          }

          .rightPanel {
            position: relative;
            height: auto;
          }

          .infoGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .page {
            padding: 10px;
          }

          .heroPanel {
            grid-template-columns: 1fr;
          }

          .topBar {
            flex-direction: column;
          }

          .phaseButtons,
          .summaryBox div,
          .pdfButtons {
            grid-template-columns: 1fr;
          }

          .mainInput {
            height: auto;
            border-radius: 24px;
          }

          .analysisInput {
            height: auto;
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media print {
          body {
            background: white;
          }

          .no-print,
          .sidebar,
          .topBar,
          .heroPanel,
          .sectorArea,
          .assistantResponse,
          .infoGrid,
          .analysisPanel,
          .formulaCreate {
            display: none !important;
          }

          .page,
          .main,
          .layout,
          .rightPanel {
            display: block;
            padding: 0;
            height: auto;
            overflow: visible;
          }

          .formulaResult,
          .methodWide {
            box-shadow: none;
            border: 0;
            background: white;
            padding: 0;
          }

          .methodWide {
            margin-top: 20px;
          }

          .phaseResultList article,
          .summaryBox {
            break-inside: avoid;
            border: 1px solid #ddd;
            background: white;
          }

          th, td {
            font-size: 10px;
            padding: 6px;
          }

          .pdfButtons,
          .pdfNote {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

function menuIcon(item: string) {
  const icons: Record<string, string> = {
    "Ana Sayfa": "⌂",
    Sohbet: "☏",
    "INCI Sorgula": "⌕",
    "Formül Oluştur": "⚗",
    "Analiz Sonuçları": "▧",
    "Trend Bileşenler": "⌁",
    "Endüstriyel Sektörler": "⌘",
    Kütüphane: "▣",
    Favoriler: "♡",
    Ayarlar: "⚙",
  };

  return icons[item] || "◌";
}

function sectorIcon(sector: SectorKey) {
  const icons: Record<SectorKey, string> = {
    Kozmetik: "🧴",
    İlaç: "💊",
    Gıda: "🥗",
    Biyoteknoloji: "🧬",
    Nanoteknoloji: "✤",
    "Malzeme Bilimi": "▥",
  };

  return icons[sector];
}
