"use client";

import React, { useMemo, useState } from "react";

type PhaseKey = "A" | "B" | "C" | "D";

type Ingredient = {
  phase: PhaseKey;
  name: string;
  inci: string;
  percent: number;
  role: string;
  whatItDoes: string;
  processNote: string;
};

type Formula = {
  id: string;
  title: string;
  subtitle: string;
  claim: string;
  targetPh: string;
  expected: {
    appearance: string;
    color: string;
    scent: string;
    viscosity: string;
    texture: string;
    ph: string;
    packaging: string;
    stability: string;
  };
  ingredients: Ingredient[];
  process: string[];
  cautions: string[];
};

const formulas: Record<string, Formula> = {
  barrierCream: {
    id: "barrierCream",
    title: "Bariyer Destekleyici Nemlendirici Krem",
    subtitle: "Kuru / hassas / bariyer desteği isteyen ciltler için ön AR-GE formülü",
    claim:
      "Nem desteği sağlar, cilt bariyer hissini güçlendirir, yumuşak ve konforlu bir bitiş verir.",
    targetPh: "5.2 - 5.8",
    expected: {
      appearance: "Homojen, opak, parlak krem görünümü",
      color: "Beyaz / kırık beyaz",
      scent:
        "Parfümsüz bırakılırsa hafif hammadde kokusu; parfüm eklenirse yumuşak kozmetik koku",
      viscosity:
        "Orta-yüksek viskozite; kavanoz veya airless ambalaja uygun krem kıvamı",
      texture:
        "Kolay yayılan, yumuşak, hafif film bırakan ama aşırı yağlı his vermeyen yapı",
      ph: "5.2 - 5.8",
      packaging: "Airless pompa, tüp veya kavanoz ambalaj",
      stability:
        "Isı-soğuk döngü, santrifüj, mikrobiyolojik test ve challenge test önerilir.",
    },
    ingredients: [
      {
        phase: "A",
        name: "Saf Su",
        inci: "Aqua",
        percent: 72.5,
        role: "Ana çözücü",
        whatItDoes:
          "Formülün su fazını oluşturur. Suda çözünen aktiflerin ve nem tutucuların taşınmasını sağlar.",
        processNote: "Ana behere alınır.",
      },
      {
        phase: "A",
        name: "Gliserin",
        inci: "Glycerin",
        percent: 4,
        role: "Humektan / nem tutucu",
        whatItDoes:
          "Cilt yüzeyine su çekerek nem hissini artırır. Ürünün daha konforlu sürülmesine destek olur.",
        processNote: "Su fazına eklenir, homojen karıştırılır.",
      },
      {
        phase: "A",
        name: "Ksantan Gam",
        inci: "Xanthan Gum",
        percent: 0.3,
        role: "Kıvam verici / stabilizatör",
        whatItDoes:
          "Formüle jelimsi yapı verir. Emülsiyonun daha stabil ve tok görünmesine yardımcı olur.",
        processNote:
          "Topaklanmayı önlemek için gliserinle ön dispersiyon yapılabilir.",
      },
      {
        phase: "A",
        name: "Disodyum EDTA",
        inci: "Disodium EDTA",
        percent: 0.1,
        role: "Şelatlayıcı",
        whatItDoes:
          "Metal iyonlarını bağlayarak formül stabilitesine ve koruyucu sistem performansına destek olur.",
        processNote: "Su fazında çözündürülür.",
      },
      {
        phase: "B",
        name: "Kaprilik/Kaprik Trigliserit",
        inci: "Caprylic/Capric Triglyceride",
        percent: 6,
        role: "Emolyan / yumuşatıcı yağ",
        whatItDoes:
          "Cilde yumuşaklık verir, kaygan sürüm hissini artırır ve yağ fazının temel taşıyıcısıdır.",
        processNote: "Yağ fazında ısıtılır.",
      },
      {
        phase: "B",
        name: "Setearil Alkol",
        inci: "Cetearyl Alcohol",
        percent: 3,
        role: "Kıvam artırıcı / ko-emülgatör",
        whatItDoes:
          "Kreme gövde ve yoğunluk verir. Ürünün daha tok ve stabil durmasına yardım eder.",
        processNote: "Yağ fazında tamamen eritilir.",
      },
      {
        phase: "B",
        name: "Gliseril Stearat Sitrat",
        inci: "Glyceryl Stearate Citrate",
        percent: 2.5,
        role: "Emülgatör",
        whatItDoes:
          "Su ve yağ fazının birleşerek stabil krem yapısı oluşturmasını sağlar.",
        processNote: "Yağ fazında eritilir.",
      },
      {
        phase: "B",
        name: "Shea Yağı",
        inci: "Butyrospermum Parkii Butter",
        percent: 3,
        role: "Besleyici yağ / emolyan",
        whatItDoes:
          "Kuru cilt hissini azaltır, ürüne daha zengin ve koruyucu bir dokunuş verir.",
        processNote: "Yağ fazında eritilir.",
      },
      {
        phase: "C",
        name: "Niasinamid",
        inci: "Niacinamide",
        percent: 4,
        role: "Aktif bileşen",
        whatItDoes:
          "Cilt bariyeri, ton eşitsizliği görünümü ve sebum dengesi iddialarında kullanılan çok yönlü aktiftir.",
        processNote: "40°C altına düşünce eklenir.",
      },
      {
        phase: "C",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 2,
        role: "Yatıştırıcı / nem destekleyici aktif",
        whatItDoes:
          "Ciltte konfor hissini artırır, nem desteği ve bariyer hissi için kullanılır.",
        processNote: "Soğuk fazda eklenir.",
      },
      {
        phase: "C",
        name: "Seramid Kompleksi",
        inci: "Ceramide NP, Ceramide AP, Ceramide EOP",
        percent: 1,
        role: "Bariyer destek aktifi",
        whatItDoes:
          "Cilt bariyeri temasını güçlendiren premium aktif grubudur. Kuru ve hassas cilt ürünlerinde değerlidir.",
        processNote: "Tedarikçi önerisine göre soğuk fazda veya yağ fazında kullanılır.",
      },
      {
        phase: "C",
        name: "Allantoin",
        inci: "Allantoin",
        percent: 0.3,
        role: "Yatıştırıcı destek",
        whatItDoes:
          "Ciltte daha rahat ve konforlu his bırakmaya yardımcı olur.",
        processNote: "Çözünürlük sınırına dikkat edilerek eklenir.",
      },
      {
        phase: "C",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        whatItDoes:
          "Ürünü mikrobiyal bozulmaya karşı korumaya yardımcı olur.",
        processNote: "40°C altında eklenir.",
      },
      {
        phase: "C",
        name: "Parfüm",
        inci: "Parfum",
        percent: 0.2,
        role: "Koku verici",
        whatItDoes:
          "Ürünün duyusal algısını güzelleştirir. Hassas cilt ürünlerinde opsiyonel tutulabilir.",
        processNote: "Soğuk fazda eklenir.",
      },
      {
        phase: "D",
        name: "pH Ayarlayıcı",
        inci: "Citric Acid / Sodium Hydroxide",
        percent: 0.2,
        role: "pH düzenleyici",
        whatItDoes:
          "Ürünün hedef pH aralığına getirilmesini sağlar.",
        processNote: "Son aşamada damla damla eklenerek pH kontrol edilir.",
      },
    ],
    process: [
      "Faz A için saf su ana behere alınır. Disodyum EDTA çözündürülür.",
      "Gliserin ile ksantan gam önceden ıslatılır ve su fazına yavaşça eklenir. Topak kalmayana kadar karıştırılır.",
      "Faz A 70-75°C’ye kadar ısıtılır.",
      "Faz B ayrı beherde hazırlanır. Yağlar, emülgatör ve kıvam artırıcılar 70-75°C’de tamamen eritilir.",
      "Faz B, Faz A üzerine yavaşça eklenir. Homojenizatör veya yüksek devirli karıştırıcı ile 3-5 dakika karıştırılır.",
      "Karışım orta devirde soğumaya bırakılır. 40°C altına düşünce Faz C bileşenleri sırayla eklenir.",
      "pH ölçülür. Gerekirse sitrik asit veya sodyum hidroksit çözeltisiyle 5.2-5.8 aralığına ayarlanır.",
      "Viskozite, renk, koku, görünüm ve faz ayrımı kontrol edilir. Uygun ambalaja dolum yapılır.",
    ],
    cautions: [
      "Bu formül ön AR-GE deneme formülüdür.",
      "Piyasaya sunmadan önce stabilite, mikrobiyoloji, challenge test ve ambalaj uyumluluğu yapılmalıdır.",
      "Aktiflerin tedarikçi teknik dokümanındaki pH, sıcaklık ve kullanım oranı sınırları kontrol edilmelidir.",
    ],
  },

  gelCleanser: {
    id: "gelCleanser",
    title: "Nazik Jel Temizleyici",
    subtitle: "Sülfatsız, cildi germeyen jel temizleyici ön formülü",
    claim:
      "Cildi nazikçe temizler, kuruluk hissini azaltmaya yardımcı olur, günlük kullanıma uygun yumuşak temizlik sağlar.",
    targetPh: "5.3 - 6.0",
    expected: {
      appearance: "Şeffaf veya hafif opak jel",
      color: "Renksiz / çok hafif sarımsı",
      scent: "Hafif ferah kozmetik koku veya parfümsüz hammadde kokusu",
      viscosity: "Orta viskoz akışkan jel; pompa veya flip-top şişeye uygun",
      texture: "Kaygan, yumuşak köpüklü, cildi aşırı germeyen his",
      ph: "5.3 - 6.0",
      packaging: "Pompalı şişe veya flip-top şişe",
      stability:
        "Viskozite değişimi, bulanıklık, koku değişimi ve mikrobiyolojik dayanım izlenmelidir.",
    },
    ingredients: [
      {
        phase: "A",
        name: "Saf Su",
        inci: "Aqua",
        percent: 69.6,
        role: "Ana çözücü",
        whatItDoes: "Temizleyici bazın ana taşıyıcı fazını oluşturur.",
        processNote: "Ana behere alınır.",
      },
      {
        phase: "A",
        name: "Gliserin",
        inci: "Glycerin",
        percent: 3,
        role: "Nem tutucu",
        whatItDoes: "Temizlik sonrası kuruluk hissini azaltmaya yardımcı olur.",
        processNote: "Su fazına eklenir.",
      },
      {
        phase: "A",
        name: "Hidroksietil Selüloz",
        inci: "Hydroxyethylcellulose",
        percent: 0.8,
        role: "Jel kıvam verici",
        whatItDoes: "Formüle jel yapısı ve akış kontrolü verir.",
        processNote: "Yavaşça serpilerek hidrate edilir.",
      },
      {
        phase: "B",
        name: "Koko Glukozit",
        inci: "Coco-Glucoside",
        percent: 8,
        role: "Nazik noniyonik yüzey aktif",
        whatItDoes: "Temizleme ve köpük desteği sağlar. Daha yumuşak temizleyici profili verir.",
        processNote: "Düşük devirde eklenir, köpürtmeden karıştırılır.",
      },
      {
        phase: "B",
        name: "Kokamidopropil Betain",
        inci: "Cocamidopropyl Betaine",
        percent: 10,
        role: "Amfoterik yüzey aktif",
        whatItDoes:
          "Köpüğü destekler, temizleyici sistemin daha yumuşak hissedilmesine yardımcı olur.",
        processNote: "Yavaşça eklenir.",
      },
      {
        phase: "B",
        name: "Sodyum Lauroil Sarkosinat",
        inci: "Sodium Lauroyl Sarcosinate",
        percent: 5,
        role: "Anyonik yüzey aktif",
        whatItDoes: "Temizleme gücü ve köpük performansını artırır.",
        processNote: "Köpük oluşturmadan karıştırılır.",
      },
      {
        phase: "C",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 1,
        role: "Yatıştırıcı destek",
        whatItDoes: "Temizlik sonrası daha konforlu cilt hissi verir.",
        processNote: "Soğuk fazda eklenir.",
      },
      {
        phase: "C",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        whatItDoes: "Su bazlı formülün mikrobiyal dayanımını destekler.",
        processNote: "40°C altında eklenir.",
      },
      {
        phase: "C",
        name: "Parfüm",
        inci: "Parfum",
        percent: 0.2,
        role: "Koku verici",
        whatItDoes: "Ürünün duyusal algısını iyileştirir.",
        processNote: "Son aşamada eklenir.",
      },
      {
        phase: "D",
        name: "pH Ayarlayıcı",
        inci: "Citric Acid / Sodium Hydroxide",
        percent: 1.5,
        role: "pH düzenleyici",
        whatItDoes: "Temizleyiciyi cilde daha uyumlu pH aralığına getirir.",
        processNote: "pH ölçülerek q.s. ayarlanır.",
      },
    ],
    process: [
      "Saf su ana behere alınır. Gliserin eklenir.",
      "Hidroksietil selüloz yavaşça serpilerek eklenir ve tam hidratasyon beklenir.",
      "Yüzey aktifler düşük devirde, köpük oluşturmadan sırayla eklenir.",
      "Karışım berrak veya homojen jel görünümü alana kadar karıştırılır.",
      "Pantenol, koruyucu ve parfüm eklenir.",
      "pH 5.3-6.0 aralığına ayarlanır.",
      "Köpük, viskozite, berraklık, koku ve pH kontrol edilir.",
    ],
    cautions: [
      "Yüzey aktif oranları tedarikçi aktif madde yüzdesine göre yeniden hesaplanmalıdır.",
      "Göz çevresi iddiası varsa irritasyon testleri özellikle değerlendirilmelidir.",
      "Viskozite pH ve tuz toleransına göre değişebilir.",
    ],
  },

  serum: {
    id: "serum",
    title: "Nem ve Aydınlık Destekli Serum",
    subtitle: "Hafif, su bazlı, yapışkanlığı düşük serum ön formülü",
    claim:
      "Cilde nem desteği verir, daha canlı ve dengeli görünüm hedefler.",
    targetPh: "5.2 - 5.8",
    expected: {
      appearance: "Şeffaf veya hafif opalimsi serum",
      color: "Renksiz / hafif sarımsı",
      scent: "Parfümsüzse hafif aktif kokusu; parfümlü ise çok hafif kozmetik koku",
      viscosity: "Düşük-orta viskozite; damlalıklı veya pompalı şişeye uygun",
      texture: "Hafif, hızlı yayılan, düşük yağ hissi",
      ph: "5.2 - 5.8",
      packaging: "Damlalıklı şişe, airless pompa veya serum pompası",
      stability:
        "Aktif uyumluluğu, renk değişimi, pH drift ve mikrobiyolojik dayanım izlenmelidir.",
    },
    ingredients: [
      {
        phase: "A",
        name: "Saf Su",
        inci: "Aqua",
        percent: 82.1,
        role: "Ana çözücü",
        whatItDoes: "Serumun ana taşıyıcı fazıdır.",
        processNote: "Ana behere alınır.",
      },
      {
        phase: "A",
        name: "Propanediol",
        inci: "Propanediol",
        percent: 5,
        role: "Nem destekleyici / çözücü",
        whatItDoes:
          "Nem hissini artırır ve bazı aktiflerin çözünmesine destek olur.",
        processNote: "Su fazına eklenir.",
      },
      {
        phase: "A",
        name: "Sodyum Hiyalüronat",
        inci: "Sodium Hyaluronate",
        percent: 0.2,
        role: "Nem tutucu aktif",
        whatItDoes:
          "Cilt yüzeyinde su tutmaya yardımcı olur, daha dolgun ve nemli his verir.",
        processNote: "Yavaş hidrate edilir, topaklanma önlenir.",
      },
      {
        phase: "A",
        name: "Ksantan Gam",
        inci: "Xanthan Gum",
        percent: 0.2,
        role: "Hafif kıvam verici",
        whatItDoes: "Seruma hafif gövde ve kayganlık kazandırır.",
        processNote: "Gliserin/propanediol içinde ön dispersiyon yapılabilir.",
      },
      {
        phase: "B",
        name: "Niasinamid",
        inci: "Niacinamide",
        percent: 4,
        role: "Aktif bileşen",
        whatItDoes:
          "Ton eşitsizliği görünümü, bariyer desteği ve sebum dengesi temalarında kullanılır.",
        processNote: "Oda sıcaklığında çözündürülür.",
      },
      {
        phase: "B",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 2,
        role: "Nem / yatıştırıcı destek",
        whatItDoes: "Ciltte konfor ve nem hissini destekler.",
        processNote: "Su fazına eklenir.",
      },
      {
        phase: "B",
        name: "Betaine",
        inci: "Betaine",
        percent: 3,
        role: "Osmolit / nem destekleyici",
        whatItDoes: "Cildin nemli ve yumuşak hissedilmesine yardımcı olur.",
        processNote: "Suda çözündürülür.",
      },
      {
        phase: "C",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        whatItDoes: "Su bazlı serumun mikrobiyal güvenliğine destek olur.",
        processNote: "Son aşamada eklenir.",
      },
      {
        phase: "C",
        name: "Solubilizer",
        inci: "Polysorbate 20",
        percent: 1,
        role: "Çözündürmeye yardımcı",
        whatItDoes:
          "Parfüm veya yağda çözünen minik bileşenlerin serum içinde dağılmasına yardımcı olur.",
        processNote: "Parfüm varsa ön karışım yapılır.",
      },
      {
        phase: "C",
        name: "Parfüm / Esans",
        inci: "Parfum",
        percent: 0.1,
        role: "Koku verici",
        whatItDoes: "Ürüne hafif duyusal koku verir. Hassas ciltte opsiyonel tutulabilir.",
        processNote: "Solubilizer ile ön karışım yapılarak eklenir.",
      },
      {
        phase: "D",
        name: "pH Ayarlayıcı",
        inci: "Citric Acid / Sodium Hydroxide",
        percent: 1.5,
        role: "pH düzenleyici",
        whatItDoes: "Formülün hedef pH aralığında kalmasını sağlar.",
        processNote: "pH ölçülerek q.s. ayarlanır.",
      },
    ],
    process: [
      "Saf su ana behere alınır.",
      "Propanediol eklenir. Ksantan gam ve sodyum hiyalüronat yavaşça dağıtılır.",
      "Tam hidratasyon için düşük-orta devirde karıştırılır.",
      "Niasinamid, pantenol ve betaine eklenir; tamamen çözünene kadar karıştırılır.",
      "Koruyucu sistem eklenir.",
      "Parfüm kullanılacaksa solubilizer ile ön karışım yapılıp eklenir.",
      "pH 5.2-5.8 aralığına ayarlanır.",
      "Berraklık, viskozite, koku, renk ve pH kontrol edilir.",
    ],
    cautions: [
      "Hiyalüronik asit türevleri hidratasyon süresine göre viskoziteyi sonradan artırabilir.",
      "Niasinamid çok düşük pH değerlerinde tercih edilmez.",
      "Parfümsüz versiyon hassas cilt konsepti için daha uygundur.",
    ],
  },
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: value < 1 ? 2 : 1,
    maximumFractionDigits: 2,
  }).format(value);
}

function phaseName(phase: PhaseKey) {
  const names: Record<PhaseKey, string> = {
    A: "Faz A - Su Fazı",
    B: "Faz B - Yağ / Yüzey Aktif Fazı",
    C: "Faz C - Soğuk Faz / Aktif Faz",
    D: "Faz D - pH / Son Ayar",
  };
  return names[phase];
}

export default function InciLabPage() {
  const [selectedFormulaId, setSelectedFormulaId] = useState("barrierCream");
  const [batchSize, setBatchSize] = useState(100);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "formula" | "process" | "ingredients" | "properties"
  >("formula");
  const [showAll, setShowAll] = useState(false);

  const formula = formulas[selectedFormulaId];

  const totalPercent = useMemo(() => {
    return formula.ingredients.reduce((sum, item) => sum + item.percent, 0);
  }, [formula]);

  const phaseGroups = useMemo(() => {
    const phases: PhaseKey[] = ["A", "B", "C", "D"];
    return phases
      .map((phase) => ({
        phase,
        items: formula.ingredients.filter((item) => item.phase === phase),
      }))
      .filter((group) => group.items.length > 0);
  }, [formula]);

  function handleGenerateFromQuery() {
    const lower = query.toLocaleLowerCase("tr-TR");

    if (lower.includes("temiz") || lower.includes("jel") || lower.includes("yıkama")) {
      setSelectedFormulaId("gelCleanser");
    } else if (
      lower.includes("serum") ||
      lower.includes("aydınlık") ||
      lower.includes("leke") ||
      lower.includes("hyaluron")
    ) {
      setSelectedFormulaId("serum");
    } else {
      setSelectedFormulaId("barrierCream");
    }

    setActiveTab("formula");
    setShowAll(true);
  }

  function buildTextOutput() {
    const lines: string[] = [];

    lines.push(`İNCILAB AR-GE FORMÜL KARTI`);
    lines.push(`Ürün: ${formula.title}`);
    lines.push(`Açıklama: ${formula.subtitle}`);
    lines.push(`Hedef iddia: ${formula.claim}`);
    lines.push(`Hedef pH: ${formula.targetPh}`);
    lines.push(`Batch: ${batchSize} g`);
    lines.push("");
    lines.push("FORMÜL:");

    phaseGroups.forEach((group) => {
      lines.push("");
      lines.push(phaseName(group.phase));
      group.items.forEach((item) => {
        const amount = (item.percent * batchSize) / 100;
        lines.push(
          `- ${item.name} | INCI: ${item.inci} | %${formatNumber(
            item.percent
          )} | ${formatNumber(amount)} g | Görev: ${item.role}`
        );
      });
    });

    lines.push("");
    lines.push("ÜRETİM YÖNTEMİ:");
    formula.process.forEach((step, index) => {
      lines.push(`${index + 1}. ${step}`);
    });

    lines.push("");
    lines.push("BEKLENEN ÜRÜN ÖZELLİKLERİ:");
    lines.push(`Görünüm: ${formula.expected.appearance}`);
    lines.push(`Renk: ${formula.expected.color}`);
    lines.push(`Koku: ${formula.expected.scent}`);
    lines.push(`Viskozite: ${formula.expected.viscosity}`);
    lines.push(`Doku/Hissiyat: ${formula.expected.texture}`);
    lines.push(`pH: ${formula.expected.ph}`);
    lines.push(`Ambalaj: ${formula.expected.packaging}`);
    lines.push(`Stabilite: ${formula.expected.stability}`);

    lines.push("");
    lines.push("UYARILAR:");
    formula.cautions.forEach((warning) => lines.push(`- ${warning}`));

    return lines.join("\n");
  }

  async function copyFormula() {
    await navigator.clipboard.writeText(buildTextOutput());
    alert("Formül kartı kopyalandı kankam ✨");
  }

  function printAsPdf() {
    window.print();
  }

  return (
    <main className="incilab-page">
      <section className="hero">
        <div>
          <div className="eyebrow">İnciLab</div>
          <h1>Detaylı AR-GE Formülasyon Modülü</h1>
          <p>
            Faz faz üretim yöntemi, aktif/kimyasal görevleri, pH, viskozite,
            renk, koku, görünüm ve ambalaj önerisiyle tam formül kartı oluşturur.
          </p>
        </div>

        <div className="hero-card">
          <span>Toplam Formül</span>
          <strong>%{formatNumber(totalPercent)}</strong>
          <small>
            {Math.abs(totalPercent - 100) < 0.01
              ? "Formül 100’e tamamlandı."
              : "Formül yüzdesi kontrol edilmeli."}
          </small>
        </div>
      </section>

      <section className="panel ask-panel no-print">
        <label className="label">Formülasyon isteğini yaz</label>
        <div className="ask-row">
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Örn: Bariyer destekleyici nemlendirici krem istiyorum. Faz faz anlat, pH ve viskozite de yaz."
          />
          <button onClick={handleGenerateFromQuery}>Formülü Oluştur</button>
        </div>
        <p className="hint">
          Şimdilik bu alan yerel akılla çalışıyor: “serum”, “jel temizleyici”,
          “bariyer krem” gibi kelimelere göre formül kartını seçiyor.
        </p>
      </section>

      <section className="control-grid no-print">
        <div className="panel">
          <label className="label">Ürün tipi</label>
          <select
            value={selectedFormulaId}
            onChange={(event) => setSelectedFormulaId(event.target.value)}
          >
            <option value="barrierCream">Bariyer Destekleyici Krem</option>
            <option value="gelCleanser">Nazik Jel Temizleyici</option>
            <option value="serum">Nem & Aydınlık Serum</option>
          </select>
        </div>

        <div className="panel">
          <label className="label">Batch miktarı</label>
          <div className="batch-row">
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={batchSize}
              onChange={(event) => setBatchSize(Number(event.target.value))}
            />
            <strong>{batchSize} g</strong>
          </div>
        </div>

        <div className="panel action-panel">
          <button onClick={copyFormula}>Metni Kopyala</button>
          <button className="ghost" onClick={printAsPdf}>
            PDF / Print Al
          </button>
        </div>
      </section>

      <section className="formula-header">
        <div>
          <div className="eyebrow">AR-GE Formül Kartı</div>
          <h2>{formula.title}</h2>
          <p>{formula.subtitle}</p>
        </div>
        <div className="ph-badge">
          <span>Hedef pH</span>
          <strong>{formula.targetPh}</strong>
        </div>
      </section>

      <section className="claim-card">
        <strong>Hedef ürün iddiası</strong>
        <p>{formula.claim}</p>
      </section>

      <nav className="tabs no-print">
        <button
          className={activeTab === "formula" ? "active" : ""}
          onClick={() => setActiveTab("formula")}
        >
          Formül
        </button>
        <button
          className={activeTab === "process" ? "active" : ""}
          onClick={() => setActiveTab("process")}
        >
          Nasıl Yapılır?
        </button>
        <button
          className={activeTab === "ingredients" ? "active" : ""}
          onClick={() => setActiveTab("ingredients")}
        >
          Hammaddeler
        </button>
        <button
          className={activeTab === "properties" ? "active" : ""}
          onClick={() => setActiveTab("properties")}
        >
          Ürün Özellikleri
        </button>
      </nav>

      {(activeTab === "formula" || showAll) && (
        <section className="panel print-section">
          <div className="section-title">
            <div>
              <h3>100 g / Ölçekli Formül</h3>
              <p>
                Yüzdeler sabit kalır, miktarlar seçtiğin batch değerine göre
                otomatik hesaplanır.
              </p>
            </div>
            <span className="mini-badge">Batch: {batchSize} g</span>
          </div>

          <div className="phase-list">
            {phaseGroups.map((group) => (
              <div className="phase-card" key={group.phase}>
                <h4>{phaseName(group.phase)}</h4>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Hammadde</th>
                        <th>INCI</th>
                        <th>%</th>
                        <th>{batchSize} g için</th>
                        <th>Görevi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => {
                        const amount = (item.percent * batchSize) / 100;
                        return (
                          <tr key={`${item.phase}-${item.name}`}>
                            <td>{item.name}</td>
                            <td>{item.inci}</td>
                            <td>%{formatNumber(item.percent)}</td>
                            <td>{formatNumber(amount)} g</td>
                            <td>{item.role}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(activeTab === "process" || showAll) && (
        <section className="panel print-section">
          <div className="section-title">
            <div>
              <h3>Faz Faz Nasıl Yapılır?</h3>
              <p>Laboratuvar ölçekli üretim akışı.</p>
            </div>
          </div>

          <ol className="process-list">
            {formula.process.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(activeTab === "ingredients" || showAll) && (
        <section className="panel print-section">
          <div className="section-title">
            <div>
              <h3>Aktifler ve Kimyasallar Ne İşe Yarar?</h3>
              <p>Her hammaddenin formüldeki teknik ve duyusal görevi.</p>
            </div>
          </div>

          <div className="ingredient-grid">
            {formula.ingredients.map((item) => (
              <article className="ingredient-card" key={`${item.name}-${item.inci}`}>
                <div>
                  <span className="phase-dot">Faz {item.phase}</span>
                  <h4>{item.name}</h4>
                  <small>{item.inci}</small>
                </div>
                <p>
                  <strong>Görevi:</strong> {item.role}
                </p>
                <p>{item.whatItDoes}</p>
                <p className="note">
                  <strong>Üretim notu:</strong> {item.processNote}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {(activeTab === "properties" || showAll) && (
        <section className="panel print-section">
          <div className="section-title">
            <div>
              <h3>Beklenen Ürün Özellikleri</h3>
              <p>pH, viskozite, renk, koku, görüntü ve ambalaj tahmini.</p>
            </div>
          </div>

          <div className="property-grid">
            <div className="property-card">
              <span>Görünüm</span>
              <strong>{formula.expected.appearance}</strong>
            </div>
            <div className="property-card">
              <span>Renk</span>
              <strong>{formula.expected.color}</strong>
            </div>
            <div className="property-card">
              <span>Koku</span>
              <strong>{formula.expected.scent}</strong>
            </div>
            <div className="property-card">
              <span>Viskozite</span>
              <strong>{formula.expected.viscosity}</strong>
            </div>
            <div className="property-card">
              <span>Doku / Hissiyat</span>
              <strong>{formula.expected.texture}</strong>
            </div>
            <div className="property-card">
              <span>pH</span>
              <strong>{formula.expected.ph}</strong>
            </div>
            <div className="property-card">
              <span>Ambalaj</span>
              <strong>{formula.expected.packaging}</strong>
            </div>
            <div className="property-card">
              <span>Stabilite</span>
              <strong>{formula.expected.stability}</strong>
            </div>
          </div>
        </section>
      )}

      <section className="warning-card print-section">
        <h3>AR-GE Uyarısı</h3>
        <ul>
          {formula.cautions.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </section>

      <div className="show-all no-print">
        <button onClick={() => setShowAll((value) => !value)}>
          {showAll ? "Sekmeli Görünüme Dön" : "Tümünü Gör"}
        </button>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at top left, rgba(168, 85, 247, 0.18), transparent 34%),
            radial-gradient(circle at top right, rgba(236, 72, 153, 0.12), transparent 30%),
            #fbf8ff;
          color: #261536;
        }

        .incilab-page {
          min-height: 100vh;
          padding: 32px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 20px;
          align-items: stretch;
          margin-bottom: 22px;
        }

        .eyebrow {
          display: inline-flex;
          width: fit-content;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(126, 34, 206, 0.1);
          color: #7e22ce;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        h1, h2, h3, h4, p {
          margin-top: 0;
        }

        h1 {
          font-size: clamp(34px, 5vw, 62px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          margin-bottom: 16px;
          color: #2b1244;
        }

        h2 {
          font-size: clamp(26px, 3vw, 42px);
          letter-spacing: -0.04em;
          margin-bottom: 10px;
          color: #2b1244;
        }

        h3 {
          font-size: 23px;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
          color: #32164f;
        }

        h4 {
          margin-bottom: 8px;
          color: #32164f;
        }

        .hero p,
        .formula-header p,
        .section-title p,
        .hint {
          color: #6d5b7b;
          line-height: 1.6;
        }

        .hero-card,
        .panel,
        .claim-card,
        .warning-card,
        .ph-badge {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(126, 34, 206, 0.14);
          border-radius: 28px;
          box-shadow: 0 20px 60px rgba(88, 28, 135, 0.09);
          backdrop-filter: blur(14px);
        }

        .hero-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }

        .hero-card span,
        .ph-badge span,
        .property-card span,
        .label {
          color: #7c6a8a;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .hero-card strong {
          font-size: 44px;
          color: #7e22ce;
          letter-spacing: -0.05em;
        }

        .hero-card small {
          color: #6d5b7b;
        }

        .panel {
          padding: 22px;
        }

        .ask-panel {
          margin-bottom: 18px;
        }

        .ask-row {
          display: grid;
          grid-template-columns: 1fr 180px;
          gap: 12px;
          margin-top: 10px;
        }

        textarea,
        select,
        input[type="range"] {
          width: 100%;
        }

        textarea,
        select {
          border: 1px solid rgba(126, 34, 206, 0.18);
          background: #fff;
          border-radius: 18px;
          padding: 15px 16px;
          font: inherit;
          color: #2b1244;
          outline: none;
        }

        textarea {
          min-height: 86px;
          resize: vertical;
        }

        textarea:focus,
        select:focus {
          border-color: rgba(126, 34, 206, 0.55);
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.12);
        }

        button {
          border: 0;
          border-radius: 18px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #7e22ce, #c026d3, #ec4899);
          color: white;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(126, 34, 206, 0.22);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 38px rgba(126, 34, 206, 0.28);
        }

        button.ghost {
          background: white;
          color: #7e22ce;
          border: 1px solid rgba(126, 34, 206, 0.18);
          box-shadow: none;
        }

        .control-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 280px;
          gap: 16px;
          margin-bottom: 22px;
        }

        .batch-row {
          display: grid;
          grid-template-columns: 1fr 70px;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
        }

        .batch-row strong {
          color: #7e22ce;
          font-size: 18px;
        }

        .action-panel {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .formula-header {
          display: grid;
          grid-template-columns: 1fr 210px;
          gap: 18px;
          align-items: stretch;
          margin: 24px 0 16px;
        }

        .ph-badge {
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .ph-badge strong {
          font-size: 28px;
          color: #7e22ce;
        }

        .claim-card {
          padding: 22px;
          margin-bottom: 16px;
          border-left: 6px solid #a855f7;
        }

        .claim-card strong {
          color: #7e22ce;
        }

        .claim-card p {
          margin: 8px 0 0;
          color: #4b315f;
          line-height: 1.6;
        }

        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }

        .tabs button {
          background: white;
          color: #7e22ce;
          border: 1px solid rgba(126, 34, 206, 0.16);
          box-shadow: none;
        }

        .tabs button.active {
          color: white;
          background: linear-gradient(135deg, #7e22ce, #c026d3);
          box-shadow: 0 14px 30px rgba(126, 34, 206, 0.22);
        }

        .section-title {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .mini-badge,
        .phase-dot {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(126, 34, 206, 0.1);
          color: #7e22ce;
          font-size: 12px;
          font-weight: 900;
        }

        .phase-list {
          display: grid;
          gap: 18px;
        }

        .phase-card {
          border: 1px solid rgba(126, 34, 206, 0.12);
          border-radius: 22px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(250,245,255,0.78));
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        th,
        td {
          text-align: left;
          padding: 13px 12px;
          border-bottom: 1px solid rgba(126, 34, 206, 0.1);
          vertical-align: top;
          font-size: 14px;
        }

        th {
          color: #7e22ce;
          background: rgba(126, 34, 206, 0.06);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        td {
          color: #432457;
        }

        .process-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }

        .process-list li {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          align-items: start;
          padding: 15px;
          border-radius: 20px;
          background: rgba(126, 34, 206, 0.06);
        }

        .process-list span {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #7e22ce;
          color: white;
          font-weight: 900;
        }

        .process-list p {
          margin: 6px 0 0;
          color: #432457;
          line-height: 1.55;
        }

        .ingredient-grid,
        .property-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .ingredient-card,
        .property-card {
          padding: 18px;
          border-radius: 22px;
          background: rgba(250, 245, 255, 0.78);
          border: 1px solid rgba(126, 34, 206, 0.12);
        }

        .ingredient-card small {
          display: block;
          color: #7c6a8a;
          margin-bottom: 12px;
        }

        .ingredient-card p,
        .property-card strong {
          color: #432457;
          line-height: 1.55;
        }

        .ingredient-card .note {
          background: white;
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 0;
        }

        .property-card {
          display: grid;
          gap: 8px;
        }

        .property-card strong {
          font-size: 15px;
        }

        .warning-card {
          margin-top: 16px;
          padding: 22px;
          background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(253, 242, 248, 0.78));
          border-color: rgba(236, 72, 153, 0.18);
        }

        .warning-card ul {
          margin: 10px 0 0;
          padding-left: 20px;
          color: #5b3150;
          line-height: 1.7;
        }

        .show-all {
          display: flex;
          justify-content: center;
          margin: 20px 0 8px;
        }

        @media (max-width: 900px) {
          .incilab-page {
            padding: 20px;
          }

          .hero,
          .control-grid,
          .formula-header,
          .ask-row {
            grid-template-columns: 1fr;
          }

          .ingredient-grid,
          .property-grid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 42px;
          }
        }

        @media print {
          body {
            background: white;
          }

          .incilab-page {
            padding: 0;
            color: #111;
          }

          .no-print,
          .tabs,
          .show-all {
            display: none !important;
          }

          .hero,
          .formula-header {
            grid-template-columns: 1fr;
          }

          .hero-card,
          .panel,
          .claim-card,
          .warning-card,
          .ph-badge,
          .phase-card,
          .ingredient-card,
          .property-card {
            box-shadow: none;
            border: 1px solid #ddd;
            background: white;
            break-inside: avoid;
          }

          .print-section {
            margin-bottom: 16px;
            break-inside: avoid;
          }

          button {
            display: none;
          }

          table {
            min-width: 0;
            font-size: 11px;
          }

          th,
          td {
            font-size: 11px;
            padding: 7px;
          }
        }
      `}</style>
    </main>
  );
}
