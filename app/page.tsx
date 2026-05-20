"use client";

import React, { useMemo, useState } from "react";

type NavItem = {
  label: string;
  icon: string;
};

type StatCard = {
  label: string;
  value: string;
  sub: string;
  icon: string;
};

type Sector = {
  name: string;
  percent: string;
  icon: string;
};

type Device = {
  name: string;
  model: string;
  status: string;
  icon: string;
};

type AlertItem = {
  title: string;
  desc: string;
  time: string;
  type: "warning" | "info" | "success" | "danger";
};

type Sample = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  progress: number;
  date: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "Analizler", icon: "◴" },
  { label: "Örnekler", icon: "♙" },
  { label: "Cihazlar", icon: "▣" },
  { label: "Formüller", icon: "▤" },
  { label: "Raporlar", icon: "▥" },
  { label: "Kalite Kontrol", icon: "◇" },
  { label: "Envanter", icon: "⬡" },
  { label: "Metotlar", icon: "▧" },
  { label: "Validasyon", icon: "◎" },
  { label: "Ayarlar", icon: "⚙" },
];

const stats: StatCard[] = [
  { label: "Aktif Örnek", value: "148", sub: "↑ 11% bu hafta", icon: "⚗" },
  { label: "Başarı Oranı", value: "94.2%", sub: "↑ 2.1% bu hafta", icon: "⌁" },
  { label: "Veri Depolama", value: "3.7 TB", sub: "↑ 680 GB bu ay", icon: "▤" },
  { label: "Çalışan Personel", value: "18", sub: "↑ 2 yeni", icon: "♚" },
];

const sectors: Sector[] = [
  { name: "İlaç", percent: "%28", icon: "✧" },
  { name: "Gıda", percent: "%22", icon: "◈" },
  { name: "Kozmetik", percent: "%18", icon: "◌" },
  { name: "Biyoteknoloji", percent: "%16", icon: "⬢" },
  { name: "Malzeme", percent: "%16", icon: "✺" },
];

const formulas = [
  {
    formula: "ΔG = ΔH - TΔS",
    desc: "Gibbs Serbest Enerjisi",
  },
  {
    formula: "k = A·e^(-Ea/RT)",
    desc: "Arrhenius Denklemi",
  },
  {
    formula: "E = mc²",
    desc: "Einstein Denkliği",
  },
  {
    formula: "pH = -log[H⁺]",
    desc: "pH Hesaplama",
  },
];

const samples: Sample[] = [
  {
    id: "SMP-2024-1568",
    name: "Ibuprofen Formülasyonu",
    sector: "İlaç",
    stage: "Analiz",
    progress: 76,
    date: "12 Haz 2024",
  },
  {
    id: "COS-2024-0942",
    name: "C Vitamini Serumu",
    sector: "Kozmetik",
    stage: "Test",
    progress: 45,
    date: "14 Haz 2024",
  },
  {
    id: "BIO-2024-1833",
    name: "Probiyotik Kültür",
    sector: "Biyoteknoloji",
    stage: "Validasyon",
    progress: 92,
    date: "10 Haz 2024",
  },
  {
    id: "FOOD-2024-2210",
    name: "Zeytinyağı Kalite Analizi",
    sector: "Gıda",
    stage: "Analiz",
    progress: 63,
    date: "13 Haz 2024",
  },
  {
    id: "MAT-2024-1107",
    name: "Kompozit Malzeme",
    sector: "Malzeme",
    stage: "Test",
    progress: 28,
    date: "18 Haz 2024",
  },
];

const devices: Device[] = [
  { name: "HPLC Sistem", model: "Agilent Infinity II", status: "Çalışıyor", icon: "▥" },
  { name: "GC-MS", model: "Shimadzu QP2020", status: "Çalışıyor", icon: "▧" },
  { name: "Spektrofotometre", model: "UV-2600", status: "Beklemede", icon: "▣" },
  { name: "Santrifüj", model: "Eppendorf 5810R", status: "Çalışıyor", icon: "◉" },
  { name: "pH Metre", model: "Mettler Toledo", status: "Çalışıyor", icon: "◌" },
  { name: "Biyoreaktör", model: "R-3000", status: "Çalışıyor", icon: "⚗" },
];

const modules = [
  { title: "Spektroskopi", desc: "UV, IR, NMR, MS", icon: "⌁" },
  { title: "Mikrobiyoloji", desc: "Kültür, PCR, ELISA", icon: "✺" },
  { title: "Kromatografi", desc: "HPLC, GC, IC", icon: "▥" },
  { title: "Malzeme Testleri", desc: "Mekanik, Fiziksel", icon: "⬡" },
  { title: "Termal Analiz", desc: "DSC, TGA, DMA", icon: "◒" },
  { title: "Kimyasal Analiz", desc: "Titrasyon, ICP, AAS", icon: "⚗" },
];

const alerts: AlertItem[] = [
  {
    title: "Reaktör R-3000 sıcaklık uyarısı: 37.5°C",
    desc: "Sınır değerin üzerinde",
    time: "5 dk önce",
    type: "warning",
  },
  {
    title: "SMP-2024-1568 örneği için son teslim yaklaşıyor",
    desc: "Son teslim: 12 Haz 2024",
    time: "15 dk önce",
    type: "info",
  },
  {
    title: "GC-MS kolon bakım zamanı geldi",
    desc: "Önerilen bakım: HP-5MS",
    time: "1 saat önce",
    type: "warning",
  },
  {
    title: "Stok uyarısı: Asetonitril seviyesi düşük",
    desc: "Kalan miktar: 2.1 L",
    time: "2 saat önce",
    type: "danger",
  },
];

export default function Page() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [message, setMessage] = useState("");
  const [aiAnswer, setAiAnswer] = useState(
    "Merhaba Dr. Selin, nasıl yardımcı olabilirim?"
  );

  const activeSamples = useMemo(() => samples.filter((s) => s.progress > 40), []);

  function askAI(type?: string) {
    const prompt = type || message;

    if (!prompt.trim()) {
      setAiAnswer("Bir analiz, formül, cihaz ya da rapor isteği yazabilirsin.");
      return;
    }

    if (prompt.toLowerCase().includes("analiz")) {
      setAiAnswer(
        "Analiz önerisi: Önce numune matriksi, hedef parametre ve cihaz uygunluğu kontrol edilmeli. HPLC için mobil faz, kolon sıcaklığı ve pik ayrımı özellikle izlenmeli."
      );
      return;
    }

    if (prompt.toLowerCase().includes("formül")) {
      setAiAnswer(
        "Formül optimizasyonu için aktif oranı, pH aralığı, viskozite hedefi, koruyucu sistem ve stabilite koşulları birlikte değerlendirilmelidir."
      );
      return;
    }

    if (prompt.toLowerCase().includes("rapor")) {
      setAiAnswer(
        "Rapor taslağı: Numune bilgisi, metot, cihaz koşulları, gözlem, sonuç, yorum ve kalite kontrol notları ayrı başlıklarla hazırlanabilir."
      );
      return;
    }

    setAiAnswer(
      "Not aldım. Bu isteği laboratuvar yönetimi, analiz planı ve cihaz durumu açısından değerlendirebilirim."
    );
  }

  return (
    <main className="page">
      <aside className="sidebar">
        <div className="logoBlock">
          <div className="logoMark">
            <span>⬡</span>
          </div>
          <div>
            <div className="logoText">
              inci<span>Lab</span>
            </div>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={activeNav === item.label ? "navItem active" : "navItem"}
              onClick={() => setActiveNav(item.label)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="profileCard">
          <div className="avatar">SA</div>
          <div>
            <strong>Dr. Selin Acar</strong>
            <p>Kalite Yöneticisi</p>
          </div>
          <span className="chevron">⌄</span>
        </div>

        <div className="premiumCard">
          <div className="premiumIcon">∞</div>
          <p>Bilimin zarafetle buluştuğu yer.</p>
          <small>İnciLab Premium Lab Suite</small>
          <small>v2.4.1</small>
        </div>
      </aside>

      <section className="main">
        <header className="header">
          <div>
            <h1>Hoş geldiniz, Dr. Selin ✨</h1>
            <p>İnciLab Premium Laboratuvar Yönetim Paneli</p>
          </div>

          <div className="headerActions">
            <div className="search">
              <span>⌕</span>
              <input placeholder="Ara: örnek, analiz, cihaz, formül..." />
            </div>
            <button className="iconBtn">🔔</button>
            <button className="iconBtn">?</button>
            <button className="iconBtn">☼</button>
          </div>
        </header>

        <section className="stats">
          {stats.map((stat) => (
            <article className="statCard" key={stat.label}>
              <div className="statIcon">{stat.icon}</div>
              <div>
                <strong>{stat.value}</strong>
                <p>{stat.label}</p>
                <small>{stat.sub}</small>
              </div>
            </article>
          ))}
        </section>

        <section className="dashboardGrid">
          <div className="leftArea">
            <div className="topGrid">
              <section className="card sectorsCard">
                <div className="cardTitle">
                  <h2>Aktif Sektörler</h2>
                </div>

                <div className="sectorList">
                  {sectors.map((sector) => (
                    <div className="sectorMini" key={sector.name}>
                      <div className="sectorIcon">{sector.icon}</div>
                      <span>{sector.name}</span>
                      <strong>{sector.percent}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card flowCard">
                <div className="cardTitle">
                  <h2>Deney Akışı</h2>
                </div>

                <div className="waveChart">
                  <svg viewBox="0 0 520 190" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="goldLine" x1="0" x2="1">
                        <stop offset="0%" stopColor="#d7b46a" />
                        <stop offset="55%" stopColor="#a77a35" />
                        <stop offset="100%" stopColor="#e6cf9d" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,122 C45,88 72,150 120,112 C168,76 180,126 230,92 C285,50 310,166 360,108 C400,64 430,72 520,88"
                      fill="none"
                      stroke="url(#goldLine)"
                      strokeWidth="3"
                    />
                    <path
                      d="M0,138 C45,104 72,166 120,128 C168,92 180,142 230,108 C285,66 310,182 360,124 C400,80 430,88 520,104"
                      fill="none"
                      stroke="#e9ddc9"
                      strokeWidth="2"
                      strokeDasharray="5 6"
                    />
                    {[60, 145, 230, 310, 410].map((x, i) => (
                      <circle
                        key={x}
                        cx={x}
                        cy={[108, 118, 88, 122, 78][i]}
                        r="5"
                        fill="#b98b47"
                      />
                    ))}
                  </svg>

                  <div className="days">
                    <span>Pazartesi</span>
                    <span>Salı</span>
                    <span>Çarşamba</span>
                    <span>Perşembe</span>
                    <span>Cuma</span>
                    <span>Bugün</span>
                    <span>Yarın</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="middleGrid">
              <section className="card formulasCard">
                <div className="cardTitle">
                  <h2>Temel Formüller</h2>
                </div>

                <div className="formulaList">
                  {formulas.map((item) => (
                    <div className="formulaItem" key={item.formula}>
                      <div>
                        <strong>{item.formula}</strong>
                        <p>{item.desc}</p>
                      </div>
                      <button>Kopyala</button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card samplesCard">
                <div className="cardTitle">
                  <h2>Aktif Örnekler</h2>
                </div>

                <div className="sampleTable">
                  <div className="sampleHeader">
                    <span>Örnek ID</span>
                    <span>Örnek Adı</span>
                    <span>Sektör</span>
                    <span>Aşama</span>
                    <span>İlerleme</span>
                    <span>Bitiş Tarihi</span>
                  </div>

                  {samples.map((sample) => (
                    <div className="sampleRow" key={sample.id}>
                      <span>{sample.id}</span>
                      <span>{sample.name}</span>
                      <span>
                        <i /> {sample.sector}
                      </span>
                      <span>{sample.stage}</span>
                      <span>
                        <b className="progressTrack">
                          <b style={{ width: `${sample.progress}%` }} />
                        </b>
                        %{sample.progress}
                      </span>
                      <span>{sample.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="bottomGrid">
              <section className="card overviewCard">
                <div className="cardTitle">
                  <h2>Deney Genel Bakış</h2>
                </div>

                <div className="overviewContent">
                  <div className="moleculeArt">
                    <div className="mNode n1" />
                    <div className="mNode n2" />
                    <div className="mNode n3" />
                    <div className="mNode n4" />
                    <div className="mNode n5" />
                    <span className="bond b1" />
                    <span className="bond b2" />
                    <span className="bond b3" />
                    <span className="bond b4" />
                  </div>

                  <div className="donut">
                    <div className="donutInner">
                      <span>Toplam Deney</span>
                      <strong>236</strong>
                    </div>
                  </div>

                  <div className="legend">
                    <p>
                      <i className="green" /> Tamamlanan <b>96</b>
                    </p>
                    <p>
                      <i className="gold" /> Devam Ediyor <b>102</b>
                    </p>
                    <p>
                      <i className="soft" /> Beklemede <b>24</b>
                    </p>
                    <p>
                      <i className="red" /> İptal Edildi <b>14</b>
                    </p>
                  </div>
                </div>
              </section>

              <section className="card performanceCard">
                <div className="cardTitle">
                  <h2>Deney Performansı</h2>
                  <button>Bu Hafta⌄</button>
                </div>

                <div className="perfGrid">
                  <InfoBox title="Ortalama Süre" value="4.7 gün" sub="↓ 0.8 gün" />
                  <InfoBox title="Başarı Oranı" value="94.2%" sub="↑ 2.1%" />
                  <InfoBox title="Tekrar Analiz" value="%6.3" sub="↓ 1.2%" />
                  <InfoBox title="Maliyet Verimliliği" value="₺1.24M" sub="↑ 8.4%" />
                </div>
              </section>
            </div>
          </div>

          <div className="rightArea">
            <section className="reactorHero">
              <div className="reactorInfo">
                <h3>Reaktör R-3000</h3>
                <p>
                  Durum: <span>Çalışıyor</span>
                </p>
                <p>Sıcaklık: 37.2 °C</p>
                <p>pH: 7.02</p>
                <p>Karıştırma: 420 rpm</p>
                <button>Detayları Gör →</button>
              </div>

              <div className="reactorVisual">
                <div className="ring ring1" />
                <div className="ring ring2" />
                <div className="tank">
                  <div className="tankCap" />
                  <div className="tankBody">
                    <div className="liquid" />
                  </div>
                  <div className="tankBase" />
                </div>
              </div>
            </section>

            <section className="card devicesCard">
              <div className="cardTitle">
                <h2>Cihaz Durumu</h2>
                <button>Tümü⌄</button>
              </div>

              <div className="deviceGrid">
                {devices.map((device) => (
                  <article key={device.name} className="deviceCard">
                    <div className="deviceImage">{device.icon}</div>
                    <strong>{device.name}</strong>
                    <small>{device.model}</small>
                    <p className={device.status === "Çalışıyor" ? "ok" : "wait"}>
                      ● {device.status}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="card modulesCard">
              <div className="cardTitle">
                <h2>Analiz Modülleri</h2>
                <button>Tümü⌄</button>
              </div>

              <div className="moduleGrid">
                {modules.map((module) => (
                  <div className="moduleItem" key={module.title}>
                    <div>{module.icon}</div>
                    <strong>{module.title}</strong>
                    <span>{module.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="rightBottomGrid">
              <section className="card alertsCard">
                <div className="cardTitle">
                  <h2>Son Uyarılar</h2>
                  <button>Tümü⌄</button>
                </div>

                <div className="alertList">
                  {alerts.map((alert) => (
                    <article key={alert.title} className={`alertItem ${alert.type}`}>
                      <div className="alertIcon">
                        {alert.type === "info"
                          ? "i"
                          : alert.type === "danger"
                          ? "!"
                          : alert.type === "success"
                          ? "✓"
                          : "⚠"}
                      </div>
                      <div>
                        <strong>{alert.title}</strong>
                        <p>{alert.desc}</p>
                      </div>
                      <span>{alert.time}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="card aiCard">
                <div className="cardTitle">
                  <h2>AI Asistan</h2>
                  <span className="beta">Beta</span>
                </div>

                <p className="aiText">{aiAnswer}</p>

                <div className="quickActions">
                  <button onClick={() => askAI("analiz önerisi al")}>
                    Analiz önerisi al
                  </button>
                  <button onClick={() => askAI("veri analizi yap")}>
                    Veri analizi yap
                  </button>
                  <button onClick={() => askAI("rapor oluştur")}>
                    Rapor oluştur
                  </button>
                  <button onClick={() => askAI("metot karşılaştır")}>
                    Metot karşılaştır
                  </button>
                  <button onClick={() => askAI("literatür tara")}>
                    Literatür tara
                  </button>
                  <button onClick={() => askAI("soru sor")}>Soru sor</button>
                </div>

                <div className="chatInput">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") askAI();
                    }}
                    placeholder="Bir soru sorun veya komut yazın..."
                  />
                  <button onClick={() => askAI()}>➜</button>
                </div>
              </section>
            </div>
          </div>
        </section>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at top right, rgba(222, 204, 168, 0.25), transparent 34%),
            linear-gradient(135deg, #f8f4ed 0%, #fffdf9 38%, #f5efe4 100%);
          color: #312b25;
        }

        button,
        input {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 290px 1fr;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .sidebar {
          min-height: 100vh;
          padding: 28px 22px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(251, 246, 238, 0.78)),
            radial-gradient(circle at top, rgba(202, 169, 105, 0.18), transparent 42%);
          border-right: 1px solid rgba(166, 137, 90, 0.16);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .logoBlock {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 8px 18px;
        }

        .logoMark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #a67b37;
          border: 1px solid rgba(166, 123, 55, 0.36);
          background: linear-gradient(145deg, #fffefb, #f2eadb);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.6), 0 12px 30px rgba(166,123,55,0.12);
        }

        .logoText {
          font-size: 34px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -0.06em;
          color: #665842;
        }

        .logoText span {
          color: #c49a58;
        }

        .nav {
          display: grid;
          gap: 8px;
        }

        .navItem {
          width: 100%;
          height: 46px;
          border: 0;
          border-radius: 15px;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 0 14px;
          color: #635a50;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
        }

        .navItem span {
          width: 23px;
          color: #746a5f;
          font-size: 17px;
        }

        .navItem.active {
          color: white;
          background: linear-gradient(135deg, #c7a263, #dcb977);
          box-shadow: 0 14px 28px rgba(174, 126, 48, 0.24);
        }

        .navItem.active span {
          color: white;
        }

        .profileCard,
        .premiumCard {
          border: 1px solid rgba(166, 137, 90, 0.18);
          background: rgba(255,255,255,0.68);
          border-radius: 20px;
          padding: 14px;
          box-shadow: 0 14px 35px rgba(78, 58, 28, 0.06);
        }

        .profileCard {
          margin-top: auto;
          display: grid;
          grid-template-columns: 42px 1fr 18px;
          align-items: center;
          gap: 11px;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #f7efe0, #c9a56a);
          color: #5a4323;
          font-weight: 800;
        }

        .profileCard strong {
          display: block;
          font-size: 14px;
        }

        .profileCard p,
        .premiumCard small {
          margin: 3px 0 0;
          color: #8a8175;
          font-size: 12px;
        }

        .chevron {
          color: #9b927f;
        }

        .premiumCard {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          background:
            radial-gradient(circle at bottom right, rgba(210, 174, 106, 0.22), transparent 46%),
            rgba(255,255,255,0.62);
        }

        .premiumIcon {
          font-size: 34px;
          color: #c49a58;
        }

        .premiumCard p {
          margin: 0;
          color: #6c5b40;
          font-size: 15px;
          line-height: 1.5;
        }

        .main {
          padding: 30px 30px 34px;
          overflow: hidden;
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: 24px;
        }

        .header h1 {
          margin: 0 0 6px;
          color: #2d2923;
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .header p {
          margin: 0;
          color: #8a8175;
          font-size: 14px;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search {
          width: 370px;
          height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border: 1px solid rgba(166, 137, 90, 0.18);
          border-radius: 17px;
          background: rgba(255,255,255,0.76);
          box-shadow: 0 14px 34px rgba(78, 58, 28, 0.05);
        }

        .search span {
          color: #a48655;
        }

        .search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #3b352e;
        }

        .iconBtn {
          width: 43px;
          height: 43px;
          border: 1px solid rgba(166, 137, 90, 0.18);
          background: rgba(255,255,255,0.76);
          border-radius: 14px;
          cursor: pointer;
          color: #6d604f;
          box-shadow: 0 12px 26px rgba(78, 58, 28, 0.05);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .statCard,
        .card,
        .reactorHero {
          border: 1px solid rgba(166, 137, 90, 0.16);
          background: rgba(255, 255, 255, 0.72);
          border-radius: 22px;
          box-shadow:
            0 18px 45px rgba(87, 64, 32, 0.07),
            inset 0 1px 0 rgba(255,255,255,0.72);
          backdrop-filter: blur(18px);
        }

        .statCard {
          min-height: 104px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .statIcon {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          color: #b1843f;
          font-size: 24px;
          border: 1px solid rgba(166, 137, 90, 0.18);
          background: linear-gradient(145deg, #fffdf8, #f5ecdc);
        }

        .statCard strong {
          display: block;
          color: #27231d;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .statCard p {
          margin: 3px 0 0;
          color: #6a6259;
          font-size: 14px;
        }

        .statCard small {
          display: block;
          margin-top: 6px;
          color: #32a165;
          font-size: 12px;
          font-weight: 700;
        }

        .dashboardGrid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 18px;
        }

        .leftArea,
        .rightArea {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .topGrid {
          display: grid;
          grid-template-columns: 0.86fr 1.14fr;
          gap: 18px;
        }

        .middleGrid {
          display: grid;
          grid-template-columns: 0.46fr 1fr;
          gap: 18px;
        }

        .bottomGrid {
          display: grid;
          grid-template-columns: 1fr 0.46fr;
          gap: 18px;
        }

        .rightBottomGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .card {
          padding: 18px;
        }

        .cardTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }

        .cardTitle h2 {
          margin: 0;
          color: #332d24;
          font-size: 16px;
          letter-spacing: -0.02em;
        }

        .cardTitle button {
          border: 0;
          background: #f4ecdd;
          color: #9b7134;
          border-radius: 10px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .sectorList {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .sectorMini {
          min-height: 105px;
          border: 1px solid rgba(166, 137, 90, 0.13);
          background: rgba(255,255,255,0.56);
          border-radius: 18px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 12px 8px;
        }

        .sectorIcon {
          width: 42px;
          height: 42px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          background: #f6eedf;
          color: #af8548;
          font-size: 18px;
        }

        .sectorMini span {
          color: #544d44;
          font-size: 12px;
          font-weight: 700;
        }

        .sectorMini strong {
          color: #9a8464;
          font-size: 12px;
        }

        .waveChart {
          height: 180px;
          position: relative;
        }

        .waveChart svg {
          width: 100%;
          height: 140px;
        }

        .days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          color: #8f8679;
          font-size: 11px;
          text-align: center;
        }

        .formulaList {
          display: grid;
          gap: 9px;
        }

        .formulaItem {
          border: 1px solid rgba(166, 137, 90, 0.12);
          border-radius: 14px;
          padding: 10px 11px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.54);
        }

        .formulaItem strong {
          display: block;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 16px;
          color: #382f22;
        }

        .formulaItem p {
          margin: 3px 0 0;
          color: #928778;
          font-size: 11px;
        }

        .formulaItem button {
          border: 1px solid rgba(166, 137, 90, 0.14);
          background: #fbf6ed;
          color: #9c753e;
          border-radius: 9px;
          padding: 7px 9px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .sampleTable {
          display: grid;
          gap: 2px;
        }

        .sampleHeader,
        .sampleRow {
          display: grid;
          grid-template-columns: 1.05fr 1.2fr 0.7fr 0.6fr 0.8fr 0.8fr;
          gap: 8px;
          align-items: center;
          padding: 9px 10px;
        }

        .sampleHeader {
          color: #8f8679;
          font-size: 11px;
          font-weight: 800;
          border-bottom: 1px solid rgba(166, 137, 90, 0.12);
        }

        .sampleRow {
          color: #554c42;
          font-size: 12px;
          border-bottom: 1px solid rgba(166, 137, 90, 0.08);
        }

        .sampleRow span:nth-child(1) {
          color: #8d6a39;
          font-weight: 800;
        }

        .sampleRow i {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #c9a66e;
          margin-right: 5px;
        }

        .progressTrack {
          display: inline-block;
          width: 58px;
          height: 7px;
          margin-right: 7px;
          border-radius: 999px;
          background: #efe6d7;
          vertical-align: middle;
          overflow: hidden;
        }

        .progressTrack b {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #d7b46a, #ad7b34);
          border-radius: 999px;
        }

        .overviewContent {
          display: grid;
          grid-template-columns: 1fr 180px 150px;
          gap: 20px;
          align-items: center;
        }

        .moleculeArt {
          height: 180px;
          position: relative;
          border-radius: 20px;
          background:
            radial-gradient(circle at center, rgba(198, 164, 102, 0.2), transparent 48%),
            linear-gradient(135deg, #fffdf8, #f6efe4);
          overflow: hidden;
        }

        .mNode {
          position: absolute;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 28%, #fff, #d8c19b 48%, #a77a35);
          box-shadow: 0 12px 24px rgba(98, 73, 39, 0.18);
        }

        .n1 { left: 58px; top: 48px; }
        .n2 { left: 122px; top: 76px; width: 42px; height: 42px; }
        .n3 { left: 202px; top: 42px; }
        .n4 { left: 248px; top: 112px; width: 26px; height: 26px; }
        .n5 { left: 88px; top: 130px; width: 25px; height: 25px; }

        .bond {
          position: absolute;
          height: 3px;
          background: rgba(152, 119, 68, 0.36);
          transform-origin: left center;
          border-radius: 99px;
        }

        .b1 { width: 70px; left: 88px; top: 69px; transform: rotate(24deg); }
        .b2 { width: 72px; left: 158px; top: 90px; transform: rotate(-24deg); }
        .b3 { width: 60px; left: 145px; top: 113px; transform: rotate(36deg); }
        .b4 { width: 58px; left: 100px; top: 140px; transform: rotate(-50deg); }

        .donut {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background:
            conic-gradient(#caa568 0deg 154deg, #f2eadb 154deg 228deg, #d9c3a0 228deg 315deg, #f6efe4 315deg 360deg);
          display: grid;
          place-items: center;
          box-shadow: inset 0 0 0 14px rgba(255,255,255,0.58);
        }

        .donutInner {
          width: 104px;
          height: 104px;
          background: rgba(255,255,255,0.86);
          border-radius: 50%;
          display: grid;
          place-items: center;
          text-align: center;
          box-shadow: 0 12px 26px rgba(99, 72, 32, 0.09);
        }

        .donutInner span {
          font-size: 10px;
          color: #8f8679;
        }

        .donutInner strong {
          font-size: 24px;
          color: #4b4032;
        }

        .legend {
          display: grid;
          gap: 8px;
        }

        .legend p {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: #6d6257;
          font-size: 12px;
        }

        .legend i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          margin-right: 6px;
        }

        .legend .green { background: #58b783; }
        .legend .gold { background: #c9a66e; }
        .legend .soft { background: #e8d8bd; }
        .legend .red { background: #e36c6c; }

        .perfGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .infoBox {
          min-height: 94px;
          border: 1px solid rgba(166, 137, 90, 0.12);
          border-radius: 17px;
          background: rgba(255,255,255,0.56);
          padding: 13px;
        }

        .infoBox span {
          color: #8f8679;
          font-size: 12px;
        }

        .infoBox strong {
          display: block;
          margin-top: 8px;
          color: #44382a;
          font-size: 22px;
          letter-spacing: -0.03em;
        }

        .infoBox small {
          color: #37a168;
          font-size: 12px;
          font-weight: 700;
        }

        .reactorHero {
          min-height: 252px;
          display: grid;
          grid-template-columns: 220px 1fr;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(circle at 80% 18%, rgba(255,255,255,0.42), transparent 26%),
            linear-gradient(135deg, rgba(255,255,255,0.7), rgba(242, 231, 211, 0.78));
        }

        .reactorHero:before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(130deg, transparent 0 45%, rgba(255,255,255,0.48) 45% 46%, transparent 46%),
            repeating-radial-gradient(circle at 82% 24%, rgba(178,145,87,0.18) 0 2px, transparent 2px 30px);
          opacity: 0.72;
        }

        .reactorInfo {
          position: relative;
          z-index: 1;
          margin: 28px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(255,255,255,0.62);
          border: 1px solid rgba(166, 137, 90, 0.14);
          align-self: start;
        }

        .reactorInfo h3 {
          margin: 0 0 12px;
          color: #3b3024;
        }

        .reactorInfo p {
          margin: 8px 0;
          color: #6c6257;
          font-size: 13px;
        }

        .reactorInfo span {
          color: #2ea061;
          font-weight: 800;
        }

        .reactorInfo button {
          margin-top: 12px;
          border: 1px solid rgba(174, 126, 48, 0.22);
          background: #fbf5ea;
          color: #a87634;
          border-radius: 13px;
          padding: 10px 13px;
          cursor: pointer;
          font-weight: 800;
        }

        .reactorVisual {
          position: relative;
          z-index: 1;
          min-height: 250px;
          display: grid;
          place-items: center;
        }

        .ring {
          position: absolute;
          width: 470px;
          height: 260px;
          border-radius: 50%;
          border: 22px solid rgba(199, 162, 99, 0.13);
          transform: rotate(-14deg);
        }

        .ring2 {
          width: 360px;
          height: 190px;
          border-width: 14px;
          opacity: 0.55;
        }

        .tank {
          position: relative;
          width: 150px;
          height: 205px;
          display: grid;
          place-items: center;
        }

        .tankCap {
          position: absolute;
          top: 6px;
          width: 72px;
          height: 32px;
          border-radius: 18px 18px 6px 6px;
          background: linear-gradient(90deg, #e7ded0, #fff, #b9965e);
          border: 1px solid rgba(117, 91, 52, 0.24);
          z-index: 3;
        }

        .tankBody {
          position: absolute;
          top: 30px;
          width: 115px;
          height: 150px;
          border-radius: 20px 20px 26px 26px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.12), rgba(107,84,51,0.12)),
            linear-gradient(180deg, rgba(255,255,255,0.45), rgba(214, 187, 139, 0.32));
          border: 2px solid rgba(140, 105, 54, 0.26);
          box-shadow:
            inset 0 0 22px rgba(255,255,255,0.7),
            0 20px 45px rgba(98,73,39,0.16);
          overflow: hidden;
        }

        .tankBody:before,
        .tankBody:after {
          content: "";
          position: absolute;
          top: -12px;
          width: 13px;
          height: 172px;
          border-radius: 99px;
          background: linear-gradient(180deg, #d5c3a6, #ffffff, #a17a42);
          opacity: 0.8;
        }

        .tankBody:before { left: 16px; }
        .tankBody:after { right: 16px; }

        .liquid {
          position: absolute;
          left: 7px;
          right: 7px;
          bottom: 0;
          height: 58%;
          border-radius: 50% 50% 20px 20px;
          background:
            radial-gradient(circle at 50% 10%, rgba(255,255,255,0.85), transparent 30%),
            linear-gradient(180deg, rgba(88, 188, 148, 0.3), rgba(76, 160, 126, 0.55));
        }

        .tankBase {
          position: absolute;
          bottom: 9px;
          width: 150px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(90deg, #c2a06d, #fff, #b48a4d);
          opacity: 0.85;
        }

        .deviceGrid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 11px;
        }

        .deviceCard {
          min-height: 136px;
          border: 1px solid rgba(166, 137, 90, 0.12);
          background: rgba(255,255,255,0.56);
          border-radius: 18px;
          padding: 12px;
          text-align: center;
        }

        .deviceImage {
          height: 56px;
          display: grid;
          place-items: center;
          margin-bottom: 10px;
          font-size: 28px;
          color: #a67b37;
          border-radius: 14px;
          background: linear-gradient(145deg, #fffdf7, #f3ebde);
        }

        .deviceCard strong {
          display: block;
          font-size: 12px;
          color: #44382d;
        }

        .deviceCard small {
          display: block;
          margin-top: 4px;
          color: #8a8175;
          font-size: 10px;
        }

        .deviceCard p {
          margin: 8px 0 0;
          font-size: 11px;
          font-weight: 800;
        }

        .ok { color: #32a165; }
        .wait { color: #df9a25; }

        .moduleGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .moduleItem {
          min-height: 68px;
          border: 1px solid rgba(166, 137, 90, 0.12);
          background: rgba(255,255,255,0.54);
          border-radius: 15px;
          padding: 12px;
          display: grid;
          grid-template-columns: 36px 1fr;
          column-gap: 10px;
          align-items: center;
        }

        .moduleItem div {
          grid-row: span 2;
          width: 36px;
          height: 36px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: #a67b37;
          background: #f6eedf;
        }

        .moduleItem strong {
          font-size: 13px;
          color: #40372e;
        }

        .moduleItem span {
          font-size: 11px;
          color: #8b8277;
        }

        .alertList {
          display: grid;
          gap: 10px;
        }

        .alertItem {
          display: grid;
          grid-template-columns: 34px 1fr 70px;
          gap: 10px;
          align-items: center;
          padding: 10px;
          border-radius: 15px;
          border: 1px solid rgba(166, 137, 90, 0.1);
          background: rgba(255,255,255,0.5);
        }

        .alertIcon {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 900;
        }

        .alertItem.warning .alertIcon {
          background: #fff0d5;
          color: #c98013;
        }

        .alertItem.info .alertIcon {
          background: #e7edff;
          color: #4b65b2;
        }

        .alertItem.danger .alertIcon {
          background: #fff0ef;
          color: #d54d46;
        }

        .alertItem.success .alertIcon {
          background: #e8f8ee;
          color: #2c9d5d;
        }

        .alertItem strong {
          display: block;
          color: #51463b;
          font-size: 12px;
        }

        .alertItem p {
          margin: 3px 0 0;
          color: #8b8277;
          font-size: 10px;
        }

        .alertItem > span {
          color: #8f8679;
          font-size: 11px;
          text-align: right;
        }

        .aiCard {
          background:
            radial-gradient(circle at top right, rgba(210, 174, 106, 0.16), transparent 36%),
            rgba(255, 255, 255, 0.72);
        }

        .beta {
          border-radius: 999px;
          background: #f3e7d1;
          color: #9a7137;
          padding: 5px 8px;
          font-size: 10px;
          font-weight: 900;
        }

        .aiText {
          margin: 0 0 14px;
          color: #6c6257;
          line-height: 1.6;
          font-style: italic;
        }

        .quickActions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }

        .quickActions button {
          border: 1px solid rgba(166, 137, 90, 0.13);
          background: rgba(255,255,255,0.56);
          color: #816440;
          border-radius: 12px;
          padding: 9px 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .chatInput {
          height: 44px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(166, 137, 90, 0.18);
          background: rgba(255,255,255,0.68);
          border-radius: 14px;
          padding: 0 6px 0 12px;
        }

        .chatInput input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #4d443b;
        }

        .chatInput button {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, #c7a263, #dcb977);
          color: white;
          cursor: pointer;
        }

        @media (max-width: 1280px) {
          .page {
            grid-template-columns: 250px 1fr;
          }

          .dashboardGrid,
          .rightBottomGrid,
          .bottomGrid {
            grid-template-columns: 1fr;
          }

          .deviceGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .page {
            grid-template-columns: 1fr;
          }

          .sidebar {
            min-height: auto;
          }

          .stats,
          .topGrid,
          .middleGrid,
          .overviewContent {
            grid-template-columns: 1fr;
          }

          .sectorList,
          .deviceGrid,
          .moduleGrid,
          .quickActions {
            grid-template-columns: 1fr 1fr;
          }

          .header {
            flex-direction: column;
          }

          .search {
            width: 100%;
          }

          .headerActions {
            width: 100%;
          }

          .main {
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
}

function InfoBox({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="infoBox">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}
