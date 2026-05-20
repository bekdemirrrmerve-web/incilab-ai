"use client";

import React, { useMemo, useState } from "react";

type Device = {
  name: string;
  model: string;
  status: "Çalışıyor" | "Analizde" | "Beklemede" | "Bakımda";
  temp: string;
  detail: string;
};

type Ingredient = {
  phase: string;
  name: string;
  inci: string;
  percent: number;
  role: string;
  note: string;
};

type Formula = {
  title: string;
  description: string;
  ph: string;
  viscosity: string;
  color: string;
  appearance: string;
  scent: string;
  packaging: string;
  method: string[];
  ingredients: Ingredient[];
};

const devices: Device[] = [
  {
    name: "HPLC Sistemi",
    model: "Agilent Infinity II",
    status: "Çalışıyor",
    temp: "24.2°C",
    detail: "Kromatografik ayrım, aktif madde tayini ve safsızlık profili için kullanılır.",
  },
  {
    name: "NMR Spektrometresi",
    model: "Bruker 600 MHz",
    status: "Analizde",
    temp: "25.1°C",
    detail: "Molekül yapısı, proton/karbon ortamı ve yapı doğrulama analizlerinde kullanılır.",
  },
  {
    name: "SEM/TEM",
    model: "FEI Talos F200X",
    status: "Beklemede",
    temp: "Vakum hazır",
    detail: "Yüzey morfolojisi, partikül görüntüleme ve nano yapı incelemeleri için kullanılır.",
  },
  {
    name: "PCR Cihazı",
    model: "Bio-Rad CFX96",
    status: "Çalışıyor",
    temp: "95.3°C",
    detail: "Genomik, mikrobiyoloji ve biyoteknoloji analizlerinde amplifikasyon için kullanılır.",
  },
  {
    name: "Santrifüj",
    model: "Eppendorf 5810R",
    status: "Bakımda",
    temp: "12.000 rpm",
    detail: "Numune ayrımı, çöktürme ve faz ayırma işlemlerinde kullanılır.",
  },
];

const formulas: Record<string, Formula> = {
  cream: {
    title: "Bariyer Destekleyici Nemlendirici Krem",
    description:
      "Kuru ve hassas ciltler için bariyer hissini destekleyen, nem veren ön AR-GE krem formülü.",
    ph: "5.2 - 5.8",
    viscosity: "Orta-yüksek viskozite; tüp, airless veya kavanoz ambalaja uygun.",
    color: "Beyaz / kırık beyaz",
    appearance: "Homojen, opak, parlak krem görünümü",
    scent: "Parfümsüzse hafif hammadde kokusu; parfüm eklenirse yumuşak kozmetik koku.",
    packaging: "Airless pompa, tüp veya kavanoz",
    method: [
      "Faz A hazırlanır: Saf su ana behere alınır. EDTA çözündürülür.",
      "Gliserin içinde ksantan gam ön dispersiyon yapılır ve su fazına eklenir.",
      "Faz A 70-75°C’ye ısıtılır.",
      "Faz B ayrı beherde hazırlanır; yağlar, emülgatör ve kıvam vericiler eritilir.",
      "Faz B, Faz A üzerine yavaşça eklenir ve homojenizatörle karıştırılır.",
      "40°C altına düşünce Faz C aktifleri, koruyucu ve parfüm eklenir.",
      "pH ölçülür ve gerekirse sitrik asit / NaOH çözeltisiyle ayarlanır.",
      "Görünüm, koku, renk, pH, viskozite ve faz ayrımı kontrol edilir.",
    ],
    ingredients: [
      {
        phase: "Faz A - Su Fazı",
        name: "Saf Su",
        inci: "Aqua",
        percent: 72.5,
        role: "Ana çözücü",
        note: "Formülün taşıyıcı fazıdır.",
      },
      {
        phase: "Faz A - Su Fazı",
        name: "Gliserin",
        inci: "Glycerin",
        percent: 4,
        role: "Nem tutucu",
        note: "Ciltte nem hissini artırır.",
      },
      {
        phase: "Faz A - Su Fazı",
        name: "Ksantan Gam",
        inci: "Xanthan Gum",
        percent: 0.3,
        role: "Kıvam verici",
        note: "Formüle jelimsi yapı ve stabilite desteği verir.",
      },
      {
        phase: "Faz B - Yağ Fazı",
        name: "Kaprilik/Kaprik Trigliserit",
        inci: "Caprylic/Capric Triglyceride",
        percent: 6,
        role: "Emolyan",
        note: "Cilde yumuşak ve kaygan sürüm hissi verir.",
      },
      {
        phase: "Faz B - Yağ Fazı",
        name: "Gliseril Stearat Sitrat",
        inci: "Glyceryl Stearate Citrate",
        percent: 2.5,
        role: "Emülgatör",
        note: "Su ve yağ fazını bir arada tutar.",
      },
      {
        phase: "Faz B - Yağ Fazı",
        name: "Setearil Alkol",
        inci: "Cetearyl Alcohol",
        percent: 3,
        role: "Kıvam artırıcı",
        note: "Kreme gövde ve yoğunluk verir.",
      },
      {
        phase: "Faz C - Soğuk Faz",
        name: "Niasinamid",
        inci: "Niacinamide",
        percent: 4,
        role: "Aktif bileşen",
        note: "Bariyer, ton eşitsizliği ve sebum dengesi iddialarında kullanılır.",
      },
      {
        phase: "Faz C - Soğuk Faz",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 2,
        role: "Nem / yatıştırıcı destek",
        note: "Ciltte konfor hissini artırır.",
      },
      {
        phase: "Faz C - Soğuk Faz",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        note: "Mikrobiyal bozulmaya karşı destek sağlar.",
      },
      {
        phase: "Faz D - Son Ayar",
        name: "pH Ayarlayıcı / Suya Tamamlama",
        inci: "Citric Acid / Sodium Hydroxide / Aqua",
        percent: 4.8,
        role: "pH ayarı / q.s.",
        note: "Son pH hedef aralığa getirilir.",
      },
    ],
  },

  serum: {
    title: "Nem ve Aydınlık Destekli Serum",
    description:
      "Hafif, su bazlı, hızlı yayılan ve nem desteği sağlayan serum ön formülü.",
    ph: "5.2 - 5.8",
    viscosity: "Düşük-orta viskozite; damlalıklı veya serum pompalı ambalaja uygun.",
    color: "Renksiz / hafif sarımsı",
    appearance: "Şeffaf veya hafif opalimsi serum",
    scent: "Aktiflerden gelen hafif karakteristik koku olabilir.",
    packaging: "Damlalıklı şişe veya airless serum pompası",
    method: [
      "Saf su ana behere alınır.",
      "Propanediol ve gliserin eklenir.",
      "Sodyum hiyalüronat yavaşça serpilerek hidrate edilir.",
      "Niasinamid, pantenol ve betaine eklenir.",
      "Koruyucu sistem eklenir.",
      "pH 5.2-5.8 aralığına ayarlanır.",
      "Berraklık, renk, koku, viskozite ve pH kontrol edilir.",
    ],
    ingredients: [
      {
        phase: "Faz A - Su Fazı",
        name: "Saf Su",
        inci: "Aqua",
        percent: 82.2,
        role: "Ana çözücü",
        note: "Serumun ana taşıyıcısıdır.",
      },
      {
        phase: "Faz A - Su Fazı",
        name: "Propanediol",
        inci: "Propanediol",
        percent: 5,
        role: "Nem destekleyici / çözücü",
        note: "Nem hissini artırır.",
      },
      {
        phase: "Faz A - Su Fazı",
        name: "Sodyum Hiyalüronat",
        inci: "Sodium Hyaluronate",
        percent: 0.2,
        role: "Nem tutucu aktif",
        note: "Ciltte dolgun ve nemli his verir.",
      },
      {
        phase: "Faz B - Aktif Faz",
        name: "Niasinamid",
        inci: "Niacinamide",
        percent: 4,
        role: "Aktif bileşen",
        note: "Ton eşitsizliği, bariyer ve sebum temalarında kullanılır.",
      },
      {
        phase: "Faz B - Aktif Faz",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 2,
        role: "Yatıştırıcı destek",
        note: "Konfor hissini artırır.",
      },
      {
        phase: "Faz C - Son Faz",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        note: "Mikrobiyal korumaya destek olur.",
      },
      {
        phase: "Faz D - Son Ayar",
        name: "pH Ayarlayıcı / Suya Tamamlama",
        inci: "Citric Acid / Sodium Hydroxide / Aqua",
        percent: 5.7,
        role: "pH ayarı / q.s.",
        note: "pH ölçülerek ayarlanır.",
      },
    ],
  },

  cleanser: {
    title: "Nazik Jel Temizleyici",
    description:
      "Cildi germeden temizlemeyi hedefleyen sülfatsız jel temizleyici ön formülü.",
    ph: "5.3 - 6.0",
    viscosity: "Orta viskoz jel; pompalı veya flip-top ambalaja uygun.",
    color: "Renksiz / hafif opak",
    appearance: "Şeffaf veya hafif opalimsi jel",
    scent: "Hafif ferah kozmetik koku veya parfümsüz hammadde kokusu.",
    packaging: "Pompalı şişe veya flip-top şişe",
    method: [
      "Saf su ana behere alınır.",
      "Gliserin ve kıvam verici eklenir.",
      "Yüzey aktifler düşük devirde, köpürtmeden eklenir.",
      "Pantenol, koruyucu ve parfüm eklenir.",
      "pH 5.3-6.0 aralığına ayarlanır.",
      "Köpük, berraklık, viskozite, koku ve pH kontrol edilir.",
    ],
    ingredients: [
      {
        phase: "Faz A - Su Fazı",
        name: "Saf Su",
        inci: "Aqua",
        percent: 67.5,
        role: "Ana çözücü",
        note: "Temizleyici bazın taşıyıcı fazıdır.",
      },
      {
        phase: "Faz A - Su Fazı",
        name: "Gliserin",
        inci: "Glycerin",
        percent: 3,
        role: "Nem destekleyici",
        note: "Temizlik sonrası gerginlik hissini azaltmaya yardım eder.",
      },
      {
        phase: "Faz A - Su Fazı",
        name: "Hidroksietil Selüloz",
        inci: "Hydroxyethylcellulose",
        percent: 0.8,
        role: "Jel kıvam verici",
        note: "Ürüne jel yapı verir.",
      },
      {
        phase: "Faz B - Temizleyici Faz",
        name: "Koko Glukozit",
        inci: "Coco-Glucoside",
        percent: 8,
        role: "Nazik yüzey aktif",
        note: "Temizleme ve yumuşak köpük sağlar.",
      },
      {
        phase: "Faz B - Temizleyici Faz",
        name: "Kokamidopropil Betain",
        inci: "Cocamidopropyl Betaine",
        percent: 10,
        role: "Köpük destekleyici",
        note: "Temizleyici sistemi daha yumuşak hissettirir.",
      },
      {
        phase: "Faz C - Soğuk Faz",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        note: "Mikrobiyal dayanım desteği verir.",
      },
      {
        phase: "Faz D - Son Ayar",
        name: "pH Ayarlayıcı / Suya Tamamlama",
        inci: "Citric Acid / Sodium Hydroxide / Aqua",
        percent: 9.8,
        role: "pH ayarı / q.s.",
        note: "Son pH cilde uygun aralığa alınır.",
      },
    ],
  },
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value < 1 ? 2 : 1,
  }).format(value);
}

function detectFormula(text: string) {
  const q = text.toLocaleLowerCase("tr-TR");

  if (q.includes("serum") || q.includes("hyaluron") || q.includes("aydınlık")) {
    return "serum";
  }

  if (q.includes("temiz") || q.includes("jel") || q.includes("yıkama")) {
    return "cleanser";
  }

  return "cream";
}

export default function Page() {
  const [activeMenu, setActiveMenu] = useState("Gösterge Paneli");
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [formulaType, setFormulaType] = useState("cream");
  const [formulaQuestion, setFormulaQuestion] = useState("");
  const [analysisQuestion, setAnalysisQuestion] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [mainAnswer, setMainAnswer] = useState(
    "Merhaba kanka, İnciLab eski düzenine döndü. Alttan soru sorabilir, formül oluşturabilir veya cihaz seçebilirsin."
  );
  const [batchSize, setBatchSize] = useState(100);
  const [activeTab, setActiveTab] = useState<"formula" | "method" | "ingredients" | "properties">("formula");

  const formula = formulas[formulaType];

  const groupedIngredients = useMemo(() => {
    const phases = Array.from(new Set(formula.ingredients.map((i) => i.phase)));
    return phases.map((phase) => ({
      phase,
      items: formula.ingredients.filter((i) => i.phase === phase),
    }));
  }, [formula]);

  function generateFormula() {
    const detected = detectFormula(formulaQuestion);
    setFormulaType(detected);
    setActiveTab("formula");
    setMainAnswer(
      "Formülasyon kartı oluşturuldu. Fazlar, hammaddeler, üretim yöntemi, pH, viskozite, renk, koku ve ambalaj önerisi hazır."
    );
  }

  function runAnalysis() {
    const q = analysisQuestion.toLocaleLowerCase("tr-TR");

    if (!analysisQuestion.trim()) {
      setMainAnswer("Analiz için bir hammadde, cihaz, yöntem veya ürün tipi yazmalısın.");
      return;
    }

    if (q.includes("hplc")) {
      setMainAnswer(
        "HPLC; aktif madde tayini, safsızlık profili, koruyucu analizi ve stabilite takibi için uygundur. Metot seçerken kolon tipi, mobil faz, dalga boyu, akış hızı ve numune matriksi birlikte değerlendirilmelidir."
      );
      return;
    }

    if (q.includes("nmr")) {
      setMainAnswer(
        "NMR; molekül yapısını doğrulamak için güçlü bir tekniktir. Proton ve karbon ortamları üzerinden fonksiyonel grup ve yapı yorumu yapılabilir."
      );
      return;
    }

    if (q.includes("ph")) {
      setMainAnswer(
        "pH; aktif stabilitesi, koruyucu sistem performansı ve cilt uyumu için kritik bir kontroldür. Cilt bakım ürünlerinde genelde 5.0-6.0 bandı hedeflenir."
      );
      return;
    }

    setMainAnswer(
      "Analiz yorumu hazır: Numune matriksi, hedef parametre, cihaz uygunluğu, pH, sıcaklık ve stabilite koşulları birlikte değerlendirilmelidir."
    );
  }

  function sendChat() {
    const q = chatInput.toLocaleLowerCase("tr-TR");

    if (!chatInput.trim()) return;

    if (q.includes("formül")) {
      setMainAnswer("Formülasyon için ürün tipi, hedef iddia, aktifler, pH ve kıvam hedefiyle ilerleyebilirim.");
    } else if (q.includes("pdf")) {
      setMainAnswer("PDF çıktısı için üstteki PDF / Yazdır butonunu kullanabilirsin. Formül kartı yazdırılabilir düzene göre hazırlandı.");
    } else if (q.includes("cihaz")) {
      setMainAnswer("Cihaz kartlarından birini seçtiğinde sağ panelde cihazın görevi, modeli, sıcaklık/durum bilgisi ve kullanım alanı görünür.");
    } else {
      setMainAnswer("Not aldım. Bunu analiz, formülasyon veya cihaz bilgisi açısından yorumlayabilirim.");
    }

    setChatInput("");
  }

  function printPdf() {
    window.print();
  }

  return (
    <main className="page">
      <aside className="sidebar no-print">
        <div className="logo">
          <div className="logoIcon">⬡</div>
          <div>
            <strong>İnciLab</strong>
            <span>Akıllı Laboratuvar Platformu</span>
          </div>
        </div>

        <nav>
          {[
            "Gösterge Paneli",
            "Deneyler",
            "Formüller",
            "Analiz",
            "Veri Tabanı",
            "Sektörler",
            "Cihaz Durumu",
            "AI Asistan",
            "Raporlar",
            "Takım",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setActiveMenu(item)}
              className={activeMenu === item ? "active" : ""}
            >
              <span>{item === "Formüller" ? "ƒx" : item === "Analiz" ? "⌁" : item === "Cihaz Durumu" ? "▣" : "◌"}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="profile">
          <div className="avatar">IE</div>
          <div>
            <strong>İnci Elmas</strong>
            <p>Admin • Çevrimiçi</p>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="top no-print">
          <div>
            <h1>İnciLab Gösterge Paneli</h1>
            <p>Formülasyon, analiz, cihaz takibi ve PDF raporlama alanı.</p>
          </div>

          <div className="search">
            <input placeholder="Ara: cihaz, deney, formül, hammadde..." />
            <button>⌕</button>
          </div>
        </header>

        <section className="stats no-print">
          {[
            ["148", "Aktif Deney", "↑ 12 bu hafta"],
            ["94.2%", "Başarı Oranı", "↑ 2.1%"],
            ["3.7 TB", "Veri Boyutu", "↑ 420 GB bu ay"],
            ["18", "Çalışan Protokol", "↑ 3 yeni"],
          ].map(([value, label, sub]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{sub}</small>
            </article>
          ))}
        </section>

        <section className="layout">
          <div className="left">
            <section className="card no-print">
              <div className="cardHead">
                <h2>Aktif Sektörler</h2>
              </div>

              <div className="sectors">
                {[
                  "Kimya",
                  "Biyoloji",
                  "Fizik",
                  "Nanoteknoloji",
                  "Tıbbi Ar-Ge",
                  "Malzeme Bilimi",
                ].map((sector) => (
                  <button key={sector}>⚗ {sector}</button>
                ))}
              </div>
            </section>

            <section className="card no-print">
              <div className="cardHead">
                <h2>Analiz Sor</h2>
              </div>

              <textarea
                value={analysisQuestion}
                onChange={(e) => setAnalysisQuestion(e.target.value)}
                placeholder="Örn: HPLC ne işe yarar? NMR hangi analizlerde kullanılır? pH neden önemli?"
              />

              <button className="primary" onClick={runAnalysis}>
                Analiz Et
              </button>
            </section>

            <section className="card">
              <div className="cardHead">
                <h2>Formülasyon</h2>
                <button onClick={printPdf}>PDF / Yazdır</button>
              </div>

              <textarea
                className="no-print"
                value={formulaQuestion}
                onChange={(e) => setFormulaQuestion(e.target.value)}
                placeholder="Örn: Bariyer destekleyici krem oluştur. Faz faz anlat, aktiflerin görevini, pH, viskozite, renk, koku, görünüm yaz."
              />

              <div className="formulaControls no-print">
                <select value={formulaType} onChange={(e) => setFormulaType(e.target.value)}>
                  <option value="cream">Bariyer Krem</option>
                  <option value="serum">Nem Serumu</option>
                  <option value="cleanser">Jel Temizleyici</option>
                </select>

                <label>
                  Batch: {batchSize} g
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={50}
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                  />
                </label>

                <button className="primary" onClick={generateFormula}>
                  Formül Oluştur
                </button>
              </div>

              <div className="formulaResult print-area">
                <div className="formulaTitle">
                  <div>
                    <h2>{formula.title}</h2>
                    <p>{formula.description}</p>
                  </div>
                  <div className="phBox">
                    <span>pH</span>
                    <strong>{formula.ph}</strong>
                  </div>
                </div>

                <div className="tabs no-print">
                  <button className={activeTab === "formula" ? "on" : ""} onClick={() => setActiveTab("formula")}>Formül</button>
                  <button className={activeTab === "method" ? "on" : ""} onClick={() => setActiveTab("method")}>Nasıl Yapılır</button>
                  <button className={activeTab === "ingredients" ? "on" : ""} onClick={() => setActiveTab("ingredients")}>Hammaddeler</button>
                  <button className={activeTab === "properties" ? "on" : ""} onClick={() => setActiveTab("properties")}>Özellikler</button>
                </div>

                {activeTab === "formula" && (
                  <div className="phaseList">
                    {groupedIngredients.map((group) => (
                      <div className="phase" key={group.phase}>
                        <h3>{group.phase}</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>Hammadde</th>
                              <th>INCI</th>
                              <th>%</th>
                              <th>{batchSize} g</th>
                              <th>Görev</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.items.map((item) => (
                              <tr key={item.name}>
                                <td>{item.name}</td>
                                <td>{item.inci}</td>
                                <td>%{formatNumber(item.percent)}</td>
                                <td>{formatNumber((item.percent * batchSize) / 100)} g</td>
                                <td>{item.role}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "method" && (
                  <ol className="method">
                    {formula.method.map((step, index) => (
                      <li key={step}>
                        <span>{index + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}

                {activeTab === "ingredients" && (
                  <div className="ingredientCards">
                    {formula.ingredients.map((item) => (
                      <article key={item.name}>
                        <span>{item.phase}</span>
                        <h3>{item.name}</h3>
                        <p>{item.inci}</p>
                        <strong>{item.role}</strong>
                        <small>{item.note}</small>
                      </article>
                    ))}
                  </div>
                )}

                {activeTab === "properties" && (
                  <div className="properties">
                    <Info title="Viskozite" value={formula.viscosity} />
                    <Info title="Renk" value={formula.color} />
                    <Info title="Görünüm" value={formula.appearance} />
                    <Info title="Koku" value={formula.scent} />
                    <Info title="Ambalaj" value={formula.packaging} />
                    <Info title="AR-GE Uyarısı" value="Stabilite, mikrobiyoloji, challenge test ve ambalaj uyumluluğu yapılmadan ürün piyasaya sunulmamalıdır." />
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="right no-print">
            <section className="card">
              <div className="cardHead">
                <h2>Cihaz Durumu</h2>
              </div>

              <div className="deviceList">
                {devices.map((device) => (
                  <button
                    key={device.name}
                    className={selectedDevice.name === device.name ? "selectedDevice" : ""}
                    onClick={() => {
                      setSelectedDevice(device);
                      setMainAnswer(`${device.name}: ${device.detail}`);
                    }}
                  >
                    <div className="deviceVisual">
                      <span />
                      <b />
                    </div>
                    <div>
                      <strong>{device.name}</strong>
                      <small>{device.model}</small>
                      <em>{device.status}</em>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="card deviceInfo">
              <h2>{selectedDevice.name}</h2>
              <p>{selectedDevice.model}</p>
              <div className="bigDevice">
                <span />
                <b />
                <i />
              </div>
              <ul>
                <li>Durum: {selectedDevice.status}</li>
                <li>Değer: {selectedDevice.temp}</li>
                <li>{selectedDevice.detail}</li>
              </ul>
            </section>

            <section className="card">
              <div className="cardHead">
                <h2>Analiz Modülleri</h2>
              </div>

              <div className="modules">
                {[
                  "Spektroskopi",
                  "Kromatografi",
                  "Termal Analiz",
                  "Elektron Mikroskobu",
                  "Makine Öğrenmesi",
                ].map((m) => (
                  <button key={m} onClick={() => setMainAnswer(`${m} modülü seçildi. Bu modül için cihaz, numune ve metot bilgisi oluşturulabilir.`)}>
                    {m}
                    <span>Çalışıyor</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="chatPanel no-print">
          <div className="answer">
            <strong>İnciLab Asistan</strong>
            <p>{mainAnswer}</p>
          </div>

          <div className="chatBox">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendChat();
              }}
              placeholder="Alttan soru sor: formülasyon, cihaz, analiz, PDF..."
            />
            <button onClick={sendChat}>Gönder</button>
          </div>
        </section>
      </section>

      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #f8f5ff;
          color: #201433;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        button, input, textarea, select { font: inherit; }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 260px 1fr;
        }

        .sidebar {
          padding: 22px;
          background: linear-gradient(180deg, #ffffff, #f3edff);
          border-right: 1px solid #e8dcff;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .logo {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .logoIcon {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          font-weight: 900;
        }

        .logo strong {
          display: block;
          font-size: 23px;
        }

        .logo span {
          color: #7a6a91;
          font-size: 12px;
        }

        nav {
          display: grid;
          gap: 9px;
        }

        nav button {
          border: 0;
          background: transparent;
          color: #5f5272;
          border-radius: 16px;
          padding: 13px;
          display: flex;
          gap: 12px;
          cursor: pointer;
          text-align: left;
          font-weight: 700;
        }

        nav button.active {
          color: white;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          box-shadow: 0 14px 30px rgba(124, 58, 237, .25);
        }

        .profile {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #e8dcff;
          border-radius: 22px;
          padding: 14px;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #efe7ff;
          color: #7c3aed;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .profile p {
          margin: 3px 0 0;
          color: #7a6a91;
          font-size: 12px;
        }

        .content {
          padding: 24px;
          display: grid;
          gap: 16px;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .top h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .top p {
          margin: 5px 0 0;
          color: #7a6a91;
        }

        .search {
          display: flex;
          background: white;
          border: 1px solid #e5d8ff;
          border-radius: 18px;
          padding: 7px;
          min-width: 360px;
        }

        .search input {
          flex: 1;
          border: 0;
          outline: 0;
          padding: 0 10px;
        }

        .search button {
          border: 0;
          background: #7c3aed;
          color: white;
          border-radius: 13px;
          padding: 9px 13px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .stats article, .card, .chatPanel {
          background: rgba(255,255,255,.9);
          border: 1px solid #e6d8ff;
          border-radius: 26px;
          box-shadow: 0 18px 50px rgba(80, 45, 130, .08);
        }

        .stats article {
          padding: 18px;
        }

        .stats strong {
          display: block;
          font-size: 28px;
        }

        .stats span {
          display: block;
          color: #5f5272;
        }

        .stats small {
          color: #16a34a;
          font-weight: 800;
        }

        .layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 16px;
        }

        .left, .right {
          display: grid;
          gap: 16px;
          align-content: start;
        }

        .card {
          padding: 18px;
        }

        .cardHead {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 13px;
        }

        h2, h3, p { margin-top: 0; }

        .cardHead h2 {
          margin: 0;
          font-size: 19px;
        }

        .cardHead button {
          border: 0;
          background: #f0e7ff;
          color: #7c3aed;
          border-radius: 999px;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: 800;
        }

        textarea {
          width: 100%;
          min-height: 90px;
          border: 1px solid #e2d4ff;
          border-radius: 18px;
          padding: 13px;
          resize: vertical;
          outline: 0;
        }

        .primary {
          border: 0;
          margin-top: 10px;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          color: white;
          border-radius: 16px;
          padding: 12px 16px;
          cursor: pointer;
          font-weight: 900;
        }

        .sectors {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .sectors button {
          border: 1px solid #e2d4ff;
          background: #fbfaff;
          border-radius: 18px;
          padding: 14px;
          cursor: pointer;
          color: #5f5272;
          font-weight: 800;
        }

        .formulaControls {
          display: grid;
          grid-template-columns: 180px 1fr 170px;
          gap: 12px;
          align-items: end;
          margin: 12px 0;
        }

        .formulaControls select, .formulaControls input {
          width: 100%;
        }

        .formulaControls select {
          border: 1px solid #e2d4ff;
          border-radius: 15px;
          padding: 12px;
        }

        .formulaControls label {
          color: #5f5272;
          font-weight: 800;
          font-size: 13px;
        }

        .formulaResult {
          border-top: 1px solid #eee4ff;
          padding-top: 16px;
        }

        .formulaTitle {
          display: flex;
          justify-content: space-between;
          gap: 14px;
        }

        .formulaTitle p {
          color: #6d5b7b;
          line-height: 1.6;
        }

        .phBox {
          min-width: 120px;
          background: #f0e7ff;
          color: #7c3aed;
          border-radius: 20px;
          padding: 13px;
          text-align: center;
        }

        .phBox span {
          display: block;
          font-weight: 800;
          font-size: 12px;
        }

        .phBox strong {
          display: block;
          font-size: 20px;
        }

        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 14px 0;
        }

        .tabs button {
          border: 0;
          background: #f0e7ff;
          color: #7c3aed;
          border-radius: 999px;
          padding: 9px 13px;
          cursor: pointer;
          font-weight: 800;
        }

        .tabs button.on {
          background: #7c3aed;
          color: white;
        }

        .phase {
          border: 1px solid #eadfff;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .phase h3 {
          margin: 0;
          background: #f5efff;
          color: #7c3aed;
          padding: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          text-align: left;
          border-bottom: 1px solid #f0e8ff;
          padding: 10px;
          font-size: 13px;
        }

        th {
          color: #7c3aed;
          background: #fbfaff;
        }

        .method {
          padding-left: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .method li {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 10px;
          background: #fbfaff;
          border-radius: 17px;
          padding: 12px;
          line-height: 1.5;
        }

        .method span {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #7c3aed;
          color: white;
          font-weight: 900;
        }

        .ingredientCards, .properties {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .ingredientCards article, .info {
          border: 1px solid #eadfff;
          background: #fbfaff;
          border-radius: 18px;
          padding: 13px;
        }

        .ingredientCards span {
          display: inline-block;
          color: #7c3aed;
          font-weight: 900;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .ingredientCards p, .ingredientCards small, .info p {
          color: #6d5b7b;
          line-height: 1.5;
        }

        .deviceList {
          display: grid;
          gap: 10px;
        }

        .deviceList button {
          border: 1px solid #eadfff;
          background: #fbfaff;
          border-radius: 18px;
          padding: 10px;
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 10px;
          cursor: pointer;
          text-align: left;
        }

        .deviceList button.selectedDevice {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,.1);
        }

        .deviceVisual {
          height: 56px;
          border-radius: 15px;
          background: linear-gradient(180deg, #fff, #ede4ff);
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
        }

        .deviceVisual span {
          width: 22px;
          height: 36px;
          border: 2px solid #7c3aed;
          border-radius: 8px;
          background: linear-gradient(180deg, transparent 30%, rgba(124,58,237,.28));
        }

        .deviceVisual b {
          position: absolute;
          bottom: 8px;
          width: 38px;
          height: 5px;
          border-radius: 99px;
          background: #7c3aed;
          opacity: .35;
        }

        .deviceList strong {
          display: block;
        }

        .deviceList small {
          display: block;
          color: #6d5b7b;
        }

        .deviceList em {
          color: #16a34a;
          font-style: normal;
          font-size: 12px;
          font-weight: 900;
        }

        .deviceInfo p, .deviceInfo li {
          color: #6d5b7b;
          line-height: 1.6;
        }

        .bigDevice {
          height: 170px;
          border-radius: 22px;
          background: radial-gradient(circle, rgba(124,58,237,.16), transparent 60%), #fbfaff;
          border: 1px solid #eadfff;
          display: grid;
          place-items: center;
          position: relative;
          margin: 12px 0;
        }

        .bigDevice span {
          width: 70px;
          height: 118px;
          border: 3px solid #7c3aed;
          border-radius: 20px;
          background: linear-gradient(180deg, transparent 32%, rgba(124,58,237,.22));
        }

        .bigDevice b {
          position: absolute;
          width: 120px;
          height: 14px;
          border-radius: 999px;
          background: #7c3aed;
          bottom: 34px;
          opacity: .2;
        }

        .bigDevice i {
          position: absolute;
          width: 145px;
          height: 145px;
          border: 1px dashed rgba(124,58,237,.35);
          border-radius: 50%;
        }

        .modules {
          display: grid;
          gap: 9px;
        }

        .modules button {
          border: 1px solid #eadfff;
          background: #fbfaff;
          border-radius: 15px;
          padding: 11px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          font-weight: 800;
        }

        .modules span {
          color: #16a34a;
          font-size: 12px;
        }

        .chatPanel {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 14px;
          padding: 16px;
          align-items: center;
        }

        .answer strong {
          color: #7c3aed;
        }

        .answer p {
          margin: 7px 0 0;
          color: #5f5272;
          line-height: 1.5;
        }

        .chatBox {
          display: flex;
          gap: 10px;
        }

        .chatBox input {
          flex: 1;
          border: 1px solid #e2d4ff;
          border-radius: 16px;
          padding: 13px;
          outline: 0;
        }

        .chatBox button {
          border: 0;
          border-radius: 16px;
          padding: 0 18px;
          background: #7c3aed;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .page { grid-template-columns: 1fr; }
          .sidebar { min-height: auto; }
          .layout { grid-template-columns: 1fr; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .formulaControls { grid-template-columns: 1fr; }
          .chatPanel { grid-template-columns: 1fr; }
        }

        @media print {
          body {
            background: white;
          }

          .no-print,
          .sidebar,
          .top,
          .stats,
          .right,
          .chatPanel {
            display: none !important;
          }

          .page,
          .content,
          .layout,
          .left {
            display: block;
            padding: 0;
          }

          .card {
            box-shadow: none;
            border: 0;
            padding: 0;
          }

          textarea,
          .formulaControls,
          .tabs {
            display: none !important;
          }

          .formulaResult {
            border: 0;
            padding: 0;
          }

          table {
            font-size: 11px;
          }

          th, td {
            padding: 7px;
          }
        }
      `}</style>
    </main>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="info">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
