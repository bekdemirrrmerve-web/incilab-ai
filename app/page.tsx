'use client';

import { useMemo, useState } from 'react';

const menuItems = [
  'Ana Sayfa',
  'Sohbet',
  'INCI Sorgula',
  'Formül Oluştur',
  'Analiz Sonuçları',
  'Trend Bileşenler',
  'Endüstriyel Sektörler',
  'Kütüphane',
  'Favoriler',
  'Ayarlar',
];

const quickActions = [
  'Formül Oluştur',
  'Bileşen Analiz',
  'INCI Sorgula',
  'Stabilite Tahmini',
  'Uyumluluk Kontrolü',
  'Mevzuat Kontrolü',
];

const amountOptions = [
  { label: '30 ml', value: 30 },
  { label: '50 ml', value: 50 },
  { label: '100 ml', value: 100 },
  { label: '250 ml', value: 250 },
  { label: '500 ml', value: 500 },
  { label: '1 kg', value: 1000 },
];

const trends = [
  { name: 'Niacinamide', desc: 'Aydınlatıcı' },
  { name: 'Ectoin', desc: 'Cilt Koruyucu' },
  { name: 'Panthenol', desc: 'Nemlendirici' },
  { name: 'Bakuchiol', desc: 'Yaşlanma Karşıtı' },
  { name: 'Prebiyotik Kompleks', desc: 'Mikrobiyom Desteği' },
];

const sectors = [
  'Saç Formülasyonları',
  'Kozmetik Endüstrisi',
  'Gıda Destekleri',
  'Profesyonel Ürünler',
  'Çevre Koruyucu Teknolojiler',
  'Ev & Kişisel Bakım',
  'İlaç ve Medikal Teknolojiler',
  'Servis Formülasyonları',
];

const basePhases = [
  {
    phase: 'Faz A',
    title: 'Sulu Faz',
    percent: 65,
    rows: [
      { ingredient: 'Deiyonize Su', percent: 55.6, function: 'Çözücü' },
      { ingredient: 'Glycerin', percent: 5, function: 'Nemlendirici' },
      {
        ingredient: 'Pentylene Glycol',
        percent: 3,
        function: 'Nemlendirici / Çözücü',
      },
      {
        ingredient: 'Panthenol',
        percent: 1.4,
        function: 'Nemlendirici / Yatıştırıcı',
      },
    ],
  },
  {
    phase: 'Faz B',
    title: 'Aktif Faz',
    percent: 20,
    rows: [
      {
        ingredient: 'Niacinamide',
        percent: 5,
        function: 'Aydınlatıcı / Sebum Dengeleyici',
      },
      {
        ingredient: 'Sodium Hyaluronate',
        percent: 0.3,
        function: 'Nemlendirici',
      },
      { ingredient: 'Allantoin', percent: 0.2, function: 'Yatıştırıcı' },
      {
        ingredient: 'Beta-Glucan',
        percent: 1,
        function: 'Cilt Bariyeri Desteği',
      },
    ],
  },
  {
    phase: 'Faz C',
    title: 'Yağ Fazı',
    percent: 5,
    rows: [
      { ingredient: 'Squalane', percent: 3, function: 'Yumuşatıcı' },
      {
        ingredient: 'Caprylic/Capric Triglyceride',
        percent: 2,
        function: 'Yumuşatıcı / Taşıyıcı',
      },
    ],
  },
];

export default function Home() {
  const [mainQuestion, setMainQuestion] = useState('');
  const [formulaPrompt, setFormulaPrompt] = useState(
    'Hassas ciltler için nemlendirici serum'
  );
  const [chemicalQuery, setChemicalQuery] = useState('Niacinamide');
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [formulaLoading, setFormulaLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(true);

  const [lastAnalysisQuestion, setLastAnalysisQuestion] = useState(
    'Hassas ciltler için nazik, nemlendirici etkili bir yüz temizleme jeli formülü önerir misin?'
  );

  const [analysisAnswer, setAnalysisAnswer] = useState(
    'Hassas ciltler için nazik ve nemlendirici etkili yüz temizleme jeli formülünü aşağıda öneriyorum.'
  );

  const [formulaAnswer, setFormulaAnswer] = useState(
    'Hassas ciltler için nazik, nemlendirici ve cilt bariyerini destekleyen örnek bir formülasyon hazırlandı. Parfüm ve alkol içermez.'
  );

  const totalAmount = selectedAmount;
  const totalPercent = 100;

  const phases = useMemo(() => {
    return basePhases.map((phase) => ({
      ...phase,
      amount: (totalAmount * phase.percent) / 100,
      rows: phase.rows.map((row) => ({
        ...row,
        amount: (totalAmount * row.percent) / 100,
      })),
    }));
  }, [totalAmount]);

  async function callGemini(message: string) {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || 'Gemini bağlantısından cevap alınamadı.');
    }

    return data.text || 'Cevap boş geldi.';
  }

  async function askAnalysis(customMessage?: string) {
    const message =
      customMessage ||
      mainQuestion ||
      'Niacinamide nedir? INCI adı, Türkçe adı, diğer adları ve kullanım alanlarını açıkla.';

    setLastAnalysisQuestion(message);
    setAnalysisLoading(true);
    setAnalysisAnswer('InciLab analiz ediyor...');

    try {
      const text = await callGemini(message);
      setAnalysisAnswer(text);
    } catch (error: any) {
      setAnalysisAnswer(error?.message || 'Bağlantı hatası oluştu.');
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function runFormula() {
    const message = `
${formulaPrompt}

InciLab formülasyon modülü için profesyonel çıktı hazırla.
Seçili hedef miktar: ${selectedAmount} g/ml.

Cevapta:
- Fazlara ayrılmış formülasyon ver.
- İçerik adı, yüzde, miktar ve fonksiyon yaz.
- Faz A / Faz B / Faz C şeklinde ayır.
- Hedef pH, viskozite, stabilite notu yaz.
- İşlem adımlarını sırala.
- Güvenlik ve mevzuat uyarısı ekle.
- Toplam oran %100 olacak şekilde düşün.
`;

    setFormulaLoading(true);
    setFormulaAnswer('Formül oluşturuluyor...');

    try {
      const text = await callGemini(message);
      setFormulaAnswer(text);
    } catch (error: any) {
      setFormulaAnswer(
        error?.message || 'Formül oluşturulurken bağlantı hatası oluştu.'
      );
    } finally {
      setFormulaLoading(false);
    }
  }

  function runInciSearch(name?: string) {
    const query = name || chemicalQuery;
    setChemicalQuery(query);
    askAnalysis(
      `${query} nedir? INCI Name, Türkçe adı, diğer adları, ne işe yaradığı, hangi sektörlerde kullanıldığı ve sade Türkçe anlamını açıkla.`
    );
  }

  function exportFormula(type: string) {
    alert(
      `${type} dışa aktarma butonu hazır. Sonraki adımda dosya indirme fonksiyonu bağlanacak.`
    );
  }

  return (
    <main className="page">
      <div className="orb orbOne" />
      <div className="orb orbTwo" />
      <div className="bubble bubbleOne" />

      <section className="appShell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brandMark">⬡</div>
            <div>
              <h1>InciLab</h1>
              <p>AI Laboratuvar Platformu</p>
            </div>
          </div>

          <nav className="menuList">
            {menuItems.map((item, index) => (
              <button key={item} className={index === 0 ? 'active' : ''}>
                <span>{menuIcon(index)}</span>
                {item}
              </button>
            ))}
          </nav>

          <div className="premium">
            <strong>Premium Plan</strong>
            <p>Tüm özelliklere erişin</p>
          </div>
        </aside>

        <section className="content">
          <div className="mainArea">
            <section className="centerArea">
              <header className="heroCard">
                <div className="topIcons">
                  <button>⌕</button>
                  <button>🔔</button>
                  <button>☼</button>
                  <button>IA</button>
                </div>

                <h2>Merhaba, bugün neyi keşfedelim?</h2>
                <p>
                  InciLab AI Asistan, formülasyon, analiz ve içerik
                  araştırmalarınızda yanınızda.
                </p>

                <div className="askBar">
                  <span>✦</span>
                  <input
                    value={mainQuestion}
                    onChange={(event) => setMainQuestion(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') askAnalysis();
                    }}
                    placeholder="Bir sorun sorun veya ihtiyacınızı yazın..."
                  />
                  <button
                    onClick={() => askAnalysis()}
                    disabled={analysisLoading}
                  >
                    {analysisLoading ? '…' : '➜'}
                  </button>
                </div>

                <div className="quickLine">
                  {quickActions.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        item === 'Formül Oluştur'
                          ? runFormula()
                          : askAnalysis(
                              `${item} hakkında InciLab kapsamında bilgi ver.`
                            )
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </header>

              <section className="analysisGrid">
                <article className="card analysisCard">
                  <div className="cardHead">
                    <h3>Analiz Sonucu</h3>
                    <button>Tümünü Gör</button>
                  </div>

                  <div className="questionCard">
                    <span>SORU</span>
                    <h4>{lastAnalysisQuestion}</h4>
                    <div>
                      <em>Kozmetik</em>
                      <em>Yüz Temizleme</em>
                      <em>Hassas Cilt</em>
                    </div>
                    <p>TCA: 1 • 23 May 2025 10:30</p>
                  </div>
                </article>

                <article className="card answerCard">
                  <span>CEVAP</span>
                  <p>{analysisAnswer}</p>
                  <button onClick={() => askAnalysis(lastAnalysisQuestion)}>
                    Detayları Görüntüle →
                  </button>
                </article>
              </section>

              <section className="card inciSearchPanel">
                <div className="cardHead">
                  <div>
                    <h3>INCI & Kimyasal Arama</h3>
                    <p>
                      Kozmetik, kimyasal ve aktif madde hakkında detaylı bilgi
                      edinin.
                    </p>
                  </div>
                </div>

                <div className="inciInput">
                  <span>✣</span>
                  <input
                    value={chemicalQuery}
                    onChange={(event) => setChemicalQuery(event.target.value)}
                    placeholder="INCI, kimyasal veya fonksiyon yazın..."
                  />
                  <button onClick={() => runInciSearch()}>⌕</button>
                </div>

                <div className="inciTags">
                  {[
                    'Niacinamide',
                    'Panthenol',
                    'Hyaluronic Acid',
                    'Bakuchiol',
                    'Peptides',
                    'Centella Asiatica',
                  ].map((item) => (
                    <button key={item} onClick={() => runInciSearch(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </section>

              <section className="card trendPanel">
                <div className="cardHead">
                  <h3>Trend Bileşenler</h3>
                  <button>Tümünü Gör</button>
                </div>

                <div className="trendGrid">
                  {trends.map((item) => (
                    <div className="trendItem" key={item.name}>
                      <div className="glassBubble">◌</div>
                      <strong>{item.name}</strong>
                      <p>{item.desc}</p>
                      <small>🔥 Popüler</small>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card sectorPanel">
                <div className="cardHead">
                  <h3>Endüstriyel Sektörler</h3>
                  <button>Tümünü Gör</button>
                </div>

                <div className="sectorGrid">
                  {sectors.map((sector, index) => (
                    <button key={sector}>
                      <span>{sectorIcon(index)}</span>
                      {sector}
                    </button>
                  ))}
                </div>
              </section>
            </section>

            <aside className="formulaPanel">
              <div className="formulaTitle">
                <h3>⚗ Formül Oluştur</h3>
              </div>

              <div className="formulaPrompt">
                <span>✦</span>
                <input
                  value={formulaPrompt}
                  onChange={(event) => setFormulaPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') runFormula();
                  }}
                  placeholder="Örneğin: Hassas ciltler için nemlendirici serum"
                />
                <button onClick={runFormula}>
                  {formulaLoading ? '…' : '➜'}
                </button>
              </div>

              <div className="targetBlock">
                <label>Hedef Miktar</label>
                <div className="targetButtons">
                  {amountOptions.map((item) => (
                    <button
                      key={item.label}
                      className={
                        selectedAmount === item.value ? 'selected' : ''
                      }
                      onClick={() => setSelectedAmount(item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button>Özel</button>
                </div>
              </div>

              <div className="formulaSummary">
                <div>
                  <h4>Formül Sonucu</h4>
                  <span>Tamamlandı</span>
                </div>
                <p>
                  Hedef Miktar: <b>{selectedAmount} ml</b> • Toplam:{' '}
                  <b>{formatAmount(totalAmount)} g</b> • Toplam %:{' '}
                  <b>{totalPercent},00%</b>
                </p>
              </div>

              <div className="phaseList">
                {phases.map((phase) => (
                  <article className="phaseCard" key={phase.phase}>
                    <div className="phaseHead">
                      <div>
                        <strong>
                          {phase.phase} <small>({phase.title})</small>
                        </strong>
                      </div>
                      <div>
                        <b>% {phase.percent.toFixed(2).replace('.', ',')}</b>
                        <span>{formatAmount(phase.amount)} g</span>
                      </div>
                    </div>

                    <div className="phaseTable">
                      <div className="tableHead">
                        <span>İçerik Adı</span>
                        <span>%</span>
                        <span>Miktar (g)</span>
                        <span>Fonksiyon</span>
                      </div>

                      {phase.rows.map((row) => (
                        <div className="tableRow" key={row.ingredient}>
                          <span>{row.ingredient}</span>
                          <span>
                            {row.percent.toFixed(2).replace('.', ',')}
                          </span>
                          <span>{formatAmount(row.amount)}</span>
                          <span>{row.function}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="detailPanel">
                <div className="detailHead">
                  <h4>Detay</h4>
                  <button onClick={() => setDetailOpen(!detailOpen)}>
                    {detailOpen ? 'Detayı Gizle⌃' : 'Detayı Göster⌄'}
                  </button>
                </div>

                {detailOpen && (
                  <div className="detailGrid">
                    <div className="steps">
                      <strong>İşlem Adımları</strong>
                      <ol>
                        <li>
                          Faz A bileşenlerini ana kaba alın ve karıştırın.
                        </li>
                        <li>
                          Faz B bileşenlerini yavaşça ekleyin, homojen olana
                          kadar karıştırın.
                        </li>
                        <li>
                          Faz C bileşenlerini ekleyin ve karıştırmaya devam
                          edin.
                        </li>
                        <li>pH kontrolü yapın ve gerekirse ayarlayın.</li>
                        <li>
                          Hava kabarcıklarını gidermek için düşük devirde
                          karıştırın.
                        </li>
                      </ol>
                    </div>

                    <div className="detailStats">
                      <div>
                        <b>Hedef pH</b>
                        <span>5,2 - 5,6</span>
                      </div>
                      <div>
                        <b>Viskozite</b>
                        <span>3.000 - 6.000 mPa·s</span>
                      </div>
                      <div>
                        <b>Stabilite Notu</b>
                        <span>3 ay / 25°C stabil</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="formulaNotes">
                  <strong>Formül Notları</strong>
                  <p>{formulaAnswer}</p>
                </div>
              </div>

              <button
                className="exportMain"
                onClick={() => exportFormula('Ana dışa aktar')}
              >
                ⬇ Formülü Dışarı Aktar
              </button>

              <div className="exportButtons">
                <button onClick={() => exportFormula('PDF')}>▣ PDF</button>
                <button onClick={() => exportFormula('Excel')}>▣ Excel</button>
                <button onClick={() => exportFormula('CSV')}>▣ CSV</button>
              </div>
            </aside>
          </div>

          <footer>
            © 2025 InciLab AI Laboratuvar Platformu. Tüm hakları saklıdır.
          </footer>
        </section>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #191d35;
          background:
            radial-gradient(circle at 8% 10%, rgba(210, 198, 255, 0.52), transparent 30%),
            radial-gradient(circle at 95% 12%, rgba(207, 226, 255, 0.68), transparent 34%),
            linear-gradient(135deg, #fff 0%, #f8f9fd 45%, #edf1f8 100%);
          overflow-x: hidden;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .page {
          min-height: 100vh;
          padding: 18px;
          position: relative;
        }

        .orb,
        .bubble {
          position: absolute;
          pointer-events: none;
        }

        .orb {
          border-radius: 999px;
          filter: blur(8px);
        }

        .orbOne {
          width: 520px;
          height: 520px;
          left: -180px;
          top: 80px;
          background: radial-gradient(circle, rgba(176, 151, 255, 0.32), transparent 70%);
        }

        .orbTwo {
          width: 560px;
          height: 560px;
          right: -180px;
          bottom: 30px;
          background: radial-gradient(circle, rgba(198, 215, 238, 0.84), transparent 72%);
        }

        .bubbleOne {
          width: 58px;
          height: 58px;
          right: 28px;
          top: 70px;
          border-radius: 999px;
          background: linear-gradient(145deg, rgba(255,255,255,.9), rgba(208,214,231,.28));
          border: 1px solid rgba(255,255,255,.9);
        }

        .appShell {
          position: relative;
          z-index: 2;
          max-width: 1760px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 270px 1fr;
          gap: 20px;
          min-height: 980px;
        }

        .sidebar,
        .card,
        .formulaPanel,
        .heroCard {
          border: 1px solid rgba(255, 255, 255, 0.96);
          background:
            radial-gradient(circle at top right, rgba(190, 176, 255, 0.14), transparent 35%),
            linear-gradient(145deg, rgba(255,255,255,.92), rgba(238,241,249,.72));
          box-shadow: inset 0 1px 0 white, 0 22px 60px rgba(111, 123, 154, 0.12);
          backdrop-filter: blur(28px);
        }

        .sidebar {
          border-radius: 30px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(190, 196, 215, .35);
        }

        .brandMark {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: #8f70ff;
          font-size: 24px;
          background: linear-gradient(135deg, #fff, #dfe4ef 55%, #b59cff);
          box-shadow: inset 0 1px 0 white, 0 14px 30px rgba(142,126,220,.18);
        }

        .brand h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.06em;
        }

        .brand p {
          margin: 2px 0 0;
          color: #7c849b;
          font-size: 11px;
        }

        .menuList {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .menuList button {
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 18px;
          color: #566078;
          text-align: left;
          transition: .2s ease;
        }

        .menuList button.active,
        .menuList button:hover {
          color: white;
          background:
            radial-gradient(circle at 22% 15%, rgba(255,255,255,.75), transparent 24%),
            linear-gradient(135deg, #8f70ff, #d3caff);
          box-shadow: 0 16px 36px rgba(130, 112, 220, .28);
        }

        .premium {
          margin-top: auto;
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,.74);
          box-shadow: inset 0 1px 0 white, 0 14px 32px rgba(121,134,164,.1);
        }

        .premium p {
          margin: 4px 0 0;
          color: #7c849b;
          font-size: 12px;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .mainArea {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 475px;
          gap: 18px;
          align-items: start;
        }

        .centerArea {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .heroCard {
          position: relative;
          border-radius: 30px;
          padding: 34px 34px 26px;
          text-align: center;
          overflow: hidden;
        }

        .heroCard::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 10% 20%, rgba(255,255,255,.8), transparent 14%),
            radial-gradient(circle at 95% 20%, rgba(159, 135, 255, .13), transparent 30%);
          pointer-events: none;
        }

        .topIcons {
          position: absolute;
          top: 18px;
          right: 20px;
          z-index: 2;
          display: flex;
          gap: 10px;
        }

        .topIcons button {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 13px;
          color: #30384f;
          background: rgba(255,255,255,.75);
        }

        .heroCard h2 {
          position: relative;
          z-index: 1;
          margin: 0;
          font-size: 32px;
          letter-spacing: -0.06em;
        }

        .heroCard p {
          position: relative;
          z-index: 1;
          color: #667086;
          margin: 12px 0 0;
        }

        .askBar {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 28px auto 0;
          height: 58px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.84);
          border: 1px solid white;
          box-shadow: inset 0 1px 0 white, 0 20px 48px rgba(114,126,160,.12);
        }

        .askBar input,
        .formulaPrompt input,
        .inciInput input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #222a3d;
        }

        .askBar button,
        .formulaPrompt button,
        .inciInput button {
          border: 0;
          color: white;
          background:
            radial-gradient(circle at 28% 14%, rgba(255,255,255,.78), transparent 24%),
            linear-gradient(135deg, #8f70ff, #83aaff);
          box-shadow: 0 14px 34px rgba(130,117,225,.26);
        }

        .askBar button {
          width: 42px;
          height: 42px;
          border-radius: 16px;
        }

        .quickLine {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 18px;
        }

        .quickLine button,
        .cardHead button,
        .inciTags button,
        .targetButtons button,
        .exportButtons button {
          border: 1px solid rgba(255,255,255,.96);
          background: rgba(255,255,255,.76);
          color: #4d566d;
          border-radius: 999px;
          padding: 10px 13px;
          font-size: 12px;
          box-shadow: inset 0 1px 0 white;
        }

        .analysisGrid {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(0, 1fr);
          gap: 18px;
        }

        .card {
          border-radius: 26px;
          padding: 22px;
        }

        .cardHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
        }

        .cardHead h3 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .cardHead p {
          margin: 4px 0 0;
          color: #737b90;
          font-size: 12px;
        }

        .questionCard,
        .answerCard {
          min-height: 210px;
        }

        .questionCard {
          border-radius: 22px;
          padding: 20px;
          background: rgba(255,255,255,.76);
          border: 1px solid white;
          box-shadow: inset 0 1px 0 white, 0 14px 32px rgba(112,125,155,.09);
        }

        .questionCard span,
        .answerCard > span {
          display: inline-flex;
          color: #8a6cff;
          background: rgba(151,122,255,.12);
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
        }

        .questionCard h4 {
          line-height: 1.35;
          margin: 12px 0;
        }

        .questionCard em {
          display: inline-flex;
          font-style: normal;
          font-size: 12px;
          color: #596176;
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(245,247,252,.9);
          margin-right: 6px;
        }

        .questionCard p,
        .answerCard p {
          color: #667086;
          line-height: 1.55;
        }

        .answerCard {
          position: relative;
          overflow: hidden;
        }

        .answerCard::after {
          content: "⬡";
          position: absolute;
          right: 38px;
          top: 70px;
          color: rgba(143,112,255,.18);
          font-size: 110px;
        }

        .answerCard button {
          border: 1px solid rgba(255,255,255,.96);
          background: rgba(255,255,255,.8);
          color: #27304a;
          border-radius: 14px;
          padding: 13px 18px;
          font-weight: 700;
        }

        .inciSearchPanel {
          padding-bottom: 18px;
        }

        .inciInput,
        .formulaPrompt {
          min-height: 52px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 18px;
          padding: 10px 12px;
          background: rgba(255,255,255,.82);
          border: 1px solid white;
          box-shadow: inset 0 1px 0 white;
        }

        .inciInput button,
        .formulaPrompt button {
          width: 40px;
          height: 40px;
          border-radius: 15px;
        }

        .inciTags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .trendGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .trendItem,
        .sectorGrid button {
          border: 1px solid white;
          background: rgba(255,255,255,.76);
          border-radius: 20px;
          padding: 14px;
          box-shadow: inset 0 1px 0 white, 0 14px 32px rgba(112,125,155,.08);
        }

        .glassBubble {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          margin-bottom: 10px;
          color: #8f70ff;
          background: linear-gradient(145deg, #fff, #dde4f2);
        }

        .trendItem strong {
          display: block;
          font-size: 13px;
        }

        .trendItem p,
        .trendItem small {
          margin: 4px 0 0;
          color: #667086;
          font-size: 12px;
        }

        .trendItem small {
          color: #8f70ff;
        }

        .sectorGrid {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 12px;
        }

        .sectorGrid button {
          min-height: 105px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          color: #30384d;
          font-size: 12px;
        }

        .sectorGrid span {
          font-size: 24px;
          color: #8f70ff;
        }

        .formulaPanel {
          border-radius: 30px;
          padding: 26px;
          position: sticky;
          top: 18px;
          max-height: calc(100vh - 36px);
          overflow: auto;
        }

        .formulaTitle h3 {
          margin: 0 0 20px;
          font-size: 22px;
          letter-spacing: -0.04em;
        }

        .targetBlock {
          margin-top: 18px;
        }

        .targetBlock label {
          display: block;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .targetButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .targetButtons button.selected {
          color: white;
          background:
            radial-gradient(circle at 28% 14%, rgba(255,255,255,.72), transparent 24%),
            linear-gradient(135deg, #8f70ff, #b6a4ff);
          box-shadow: 0 14px 30px rgba(130,112,220,.24);
        }

        .formulaSummary {
          margin-top: 22px;
        }

        .formulaSummary > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .formulaSummary h4 {
          margin: 0;
          font-size: 17px;
        }

        .formulaSummary span {
          color: #229b69;
          background: rgba(49, 199, 132, .12);
          border: 1px solid rgba(49,199,132,.28);
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .formulaSummary p {
          color: #667086;
          font-size: 12px;
        }

        .phaseList {
          display: grid;
          gap: 14px;
          margin-top: 14px;
        }

        .phaseCard {
          border-radius: 20px;
          background: rgba(255,255,255,.78);
          border: 1px solid white;
          padding: 15px;
          box-shadow: inset 0 1px 0 white, 0 12px 26px rgba(112,125,155,.08);
        }

        .phaseHead {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .phaseHead strong {
          color: #222a3d;
        }

        .phaseHead small {
          color: #667086;
        }

        .phaseHead div:last-child {
          text-align: right;
        }

        .phaseHead b {
          display: block;
          color: #8f70ff;
        }

        .phaseHead span {
          color: #8f70ff;
          font-size: 13px;
          font-weight: 700;
        }

        .phaseTable {
          display: grid;
          gap: 8px;
        }

        .tableHead,
        .tableRow {
          display: grid;
          grid-template-columns: 1.35fr .45fr .75fr 1.3fr;
          gap: 8px;
          align-items: center;
          font-size: 11px;
        }

        .tableHead {
          color: #6e7790;
          font-weight: 900;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(200,206,224,.55);
        }

        .tableRow {
          color: #30384d;
        }

        .tableRow span:first-child {
          font-weight: 700;
        }

        .detailPanel {
          margin-top: 16px;
          border-radius: 20px;
          background: rgba(255,255,255,.72);
          border: 1px solid white;
          padding: 16px;
        }

        .detailHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .detailHead h4 {
          margin: 0;
        }

        .detailHead button {
          border: 0;
          background: transparent;
          color: #8f70ff;
          font-weight: 700;
        }

        .detailGrid {
          display: grid;
          grid-template-columns: 1fr 150px;
          gap: 14px;
          margin-top: 12px;
        }

        .steps strong,
        .formulaNotes strong {
          font-size: 12px;
        }

        .steps ol {
          padding-left: 18px;
          color: #4f5971;
          font-size: 12px;
          line-height: 1.55;
        }

        .detailStats {
          display: grid;
          gap: 8px;
        }

        .detailStats div {
          border-radius: 14px;
          background: rgba(246,248,252,.92);
          padding: 10px;
        }

        .detailStats b {
          display: block;
          font-size: 11px;
        }

        .detailStats span {
          display: block;
          color: #667086;
          font-size: 11px;
          margin-top: 4px;
        }

        .formulaNotes {
          margin-top: 12px;
          border-radius: 14px;
          background: rgba(246,248,252,.9);
          padding: 12px;
        }

        .formulaNotes p {
          white-space: pre-wrap;
          color: #4f5971;
          font-size: 12px;
          line-height: 1.55;
          margin-bottom: 0;
          max-height: 190px;
          overflow: auto;
        }

        .exportMain {
          width: 100%;
          height: 54px;
          margin-top: 18px;
          border: 0;
          border-radius: 18px;
          color: white;
          font-weight: 900;
          font-size: 15px;
          background:
            radial-gradient(circle at 30% 12%, rgba(255,255,255,.78), transparent 22%),
            linear-gradient(135deg, #8f70ff, #b5a4ff);
          box-shadow: 0 18px 38px rgba(130,112,220,.3);
        }

        .exportButtons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 12px;
        }

        footer {
          text-align: center;
          color: #8a91a4;
          font-size: 12px;
          padding-bottom: 8px;
        }

        @media (max-width: 1450px) {
          .mainArea {
            grid-template-columns: 1fr;
          }

          .formulaPanel {
            position: relative;
            top: 0;
            max-height: none;
          }

          .sectorGrid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 980px) {
          .appShell {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }

          .analysisGrid,
          .detailGrid {
            grid-template-columns: 1fr;
          }

          .trendGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sectorGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tableHead,
          .tableRow {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function formatAmount(value: number) {
  return value.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function menuIcon(index: number) {
  return ['⌂', '○', '⌕', '♙', '▧', '⌁', '⌘', '□', '♡', '⚙'][index] || '•';
}

function sectorIcon(index: number) {
  return ['♙', '▣', '◍', '⚗', '✣', '⌬', '▧', '♧'][index] || '✦';
}
