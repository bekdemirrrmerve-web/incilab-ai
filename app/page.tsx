"use client";

import React, { useMemo, useState } from "react";

type ProductType = "cream" | "serum" | "cleanser";

type Ingredient = {
  phase: "A" | "B" | "C" | "D";
  phaseTitle: string;
  name: string;
  inci: string;
  percent: number;
  role: string;
  detail: string;
  processNote: string;
};

type FormulaTemplate = {
  title: string;
  productType: string;
  shortDescription: string;
  claim: string;
  targetPh: string;
  expectedViscosity: string;
  expectedColor: string;
  expectedAppearance: string;
  expectedScent: string;
  expectedTexture: string;
  packaging: string;
  method: string[];
  ingredients: Ingredient[];
  warning: string;
};

const formulaTemplates: Record<ProductType, FormulaTemplate> = {
  cream: {
    title: "Bariyer Destekleyici Nemlendirici Krem",
    productType: "Krem / Emülsiyon",
    shortDescription:
      "Kuru, hassas veya bariyer desteği isteyen ciltler için ön AR-GE krem formülü.",
    claim:
      "Nem desteği sağlar, cilt bariyer hissini güçlendirir, yumuşak ve konforlu bir bitiş verir.",
    targetPh: "5.2 - 5.8",
    expectedViscosity:
      "Orta-yüksek viskozite. Akışkan olmayan, kavanoz / tüp / airless ambalaja uygun krem kıvamı.",
    expectedColor: "Beyaz / kırık beyaz",
    expectedAppearance: "Homojen, opak, parlak krem görünümü",
    expectedScent:
      "Parfümsüzse hafif hammadde kokusu; parfüm eklenirse yumuşak kozmetik koku.",
    expectedTexture:
      "Kolay yayılan, hafif film bırakan, çok yağlı olmayan yumuşak krem hissi.",
    packaging: "Airless pompa, tüp veya kavanoz",
    warning:
      "Bu formül ön AR-GE denemesidir. Stabilite, mikrobiyoloji, challenge test ve ambalaj uyumluluğu yapılmadan piyasaya sunulmamalıdır.",
    method: [
      "Faz A için saf su ana behere alınır. EDTA çözündürülür.",
      "Gliserin ayrı kapta ksantan gam ile ön dispersiyon yapılır ve su fazına yavaşça eklenir.",
      "Faz A 70-75°C’ye kadar ısıtılır ve homojen karışım sağlanır.",
      "Faz B ayrı beherde hazırlanır. Yağlar, emülgatör ve kıvam vericiler 70-75°C’de tamamen eritilir.",
      "Faz B, Faz A üzerine yavaşça eklenir. Homojenizatör veya yüksek devirli karıştırıcı ile 3-5 dakika karıştırılır.",
      "Karışım orta devirde soğutulur. 40°C altına düşünce Faz C aktifleri ve koruyucu eklenir.",
      "pH ölçülür. Gerekirse sitrik asit veya sodyum hidroksit çözeltisiyle hedef pH’a ayarlanır.",
      "Son kontrolde görünüm, koku, renk, viskozite, pH ve faz ayrımı değerlendirilir.",
    ],
    ingredients: [
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Saf Su",
        inci: "Aqua",
        percent: 72.5,
        role: "Ana çözücü",
        detail:
          "Formülün ana taşıyıcı fazıdır. Suda çözünen aktifleri, nem tutucuları ve yardımcı bileşenleri taşır.",
        processNote: "Ana behere alınır.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Gliserin",
        inci: "Glycerin",
        percent: 4,
        role: "Nem tutucu / humektan",
        detail:
          "Cilt yüzeyine su çekerek nem hissini artırır. Ürünün daha konforlu sürülmesine destek olur.",
        processNote: "Ksantan gamı ön ıslatmak için de kullanılabilir.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Ksantan Gam",
        inci: "Xanthan Gum",
        percent: 0.3,
        role: "Kıvam verici / stabilizatör",
        detail:
          "Formüle jelimsi yapı verir. Faz ayrımı riskini azaltmaya ve ürünün daha tok görünmesine yardımcı olur.",
        processNote: "Topaklanmaması için gliserinle ön dispersiyon yapılmalıdır.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Disodyum EDTA",
        inci: "Disodium EDTA",
        percent: 0.1,
        role: "Şelatlayıcı",
        detail:
          "Metal iyonlarını bağlayarak formül stabilitesine ve koruyucu sistem performansına destek olur.",
        processNote: "Su fazında çözündürülür.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Yağ Fazı",
        name: "Kaprilik/Kaprik Trigliserit",
        inci: "Caprylic/Capric Triglyceride",
        percent: 6,
        role: "Emolyan",
        detail:
          "Cilde kayganlık ve yumuşaklık verir. Ağır olmayan, daha ipeksi bir sürüm hissi sağlar.",
        processNote: "Yağ fazına alınır.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Yağ Fazı",
        name: "Gliseril Stearat Sitrat",
        inci: "Glyceryl Stearate Citrate",
        percent: 2.5,
        role: "Emülgatör",
        detail:
          "Su ve yağ fazının birleşerek stabil krem yapısı oluşturmasını sağlar.",
        processNote: "Yağ fazında tamamen eritilir.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Yağ Fazı",
        name: "Setearil Alkol",
        inci: "Cetearyl Alcohol",
        percent: 3,
        role: "Kıvam artırıcı / ko-emülgatör",
        detail:
          "Kreme gövde verir. Daha yoğun, stabil ve dolgun bir yapı oluşturur.",
        processNote: "Yağ fazında eritilir.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Yağ Fazı",
        name: "Shea Yağı",
        inci: "Butyrospermum Parkii Butter",
        percent: 3,
        role: "Besleyici emolyan",
        detail:
          "Kuru cilt hissini azaltır. Formüle daha zengin ve koruyucu bir dokunuş verir.",
        processNote: "Yağ fazında eritilir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Soğuk Faz / Aktif Faz",
        name: "Niasinamid",
        inci: "Niacinamide",
        percent: 4,
        role: "Aktif bileşen",
        detail:
          "Bariyer desteği, ton eşitsizliği görünümü ve sebum dengesi gibi iddialarda kullanılan çok yönlü aktiftir.",
        processNote: "40°C altına düşünce eklenir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Soğuk Faz / Aktif Faz",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 2,
        role: "Nem / yatıştırıcı destek",
        detail:
          "Ciltte konfor hissini artırır. Bariyer destekli ve hassas cilt ürünlerinde güzel durur.",
        processNote: "Soğuk fazda eklenir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Soğuk Faz / Aktif Faz",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        detail:
          "Su içeren formülün mikrobiyal bozulmaya karşı korunmasına yardımcı olur.",
        processNote: "Genelde 40°C altında eklenir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Soğuk Faz / Aktif Faz",
        name: "Parfüm",
        inci: "Parfum",
        percent: 0.2,
        role: "Koku verici",
        detail:
          "Ürünün duyusal algısını güzelleştirir. Hassas cilt ürünlerinde opsiyonel tutulabilir.",
        processNote: "Soğuk fazda eklenir.",
      },
      {
        phase: "D",
        phaseTitle: "Faz D - Son Ayar",
        name: "pH Ayarlayıcı / Suya Tamamlama",
        inci: "Citric Acid / Sodium Hydroxide / Aqua",
        percent: 1.5,
        role: "pH düzenleyici / q.s.",
        detail:
          "Formülün hedef pH aralığına getirilmesini sağlar. Pratikte pH ölçülerek q.s. ayarlanır.",
        processNote: "Son aşamada damla damla eklenir ve pH tekrar ölçülür.",
      },
    ],
  },

  serum: {
    title: "Nem ve Aydınlık Destekli Serum",
    productType: "Su bazlı serum",
    shortDescription:
      "Hafif, hızlı yayılan, nem ve canlı görünüm hedefleyen serum ön formülü.",
    claim:
      "Cilde nem desteği verir, daha canlı ve dengeli görünüm hedefler.",
    targetPh: "5.2 - 5.8",
    expectedViscosity:
      "Düşük-orta viskozite. Damlalıklı veya serum pompalı ambalaja uygun.",
    expectedColor: "Renksiz / hafif sarımsı",
    expectedAppearance: "Şeffaf veya hafif opalimsi serum görünümü",
    expectedScent:
      "Parfümsüzse aktiflerden gelen hafif karakteristik koku olabilir.",
    expectedTexture:
      "Hafif, hızlı yayılan, düşük yağ hissi veren serum dokusu.",
    packaging: "Damlalıklı şişe, airless serum pompası veya serum pompası",
    warning:
      "Serumlarda pH drift, renk değişimi, aktif uyumluluğu ve mikrobiyolojik dayanım mutlaka izlenmelidir.",
    method: [
      "Faz A için saf su ana behere alınır.",
      "Propanediol ve gliserin eklenir.",
      "Sodyum hiyalüronat ve ksantan gam yavaşça serpilerek hidrate edilir.",
      "Niasinamid, pantenol ve betaine eklenir; tamamen çözünene kadar karıştırılır.",
      "Koruyucu sistem eklenir.",
      "Parfüm kullanılacaksa solubilizer ile ön karışım yapılıp eklenir.",
      "pH 5.2-5.8 aralığına ayarlanır.",
      "Berraklık, viskozite, renk, koku ve pH kontrol edilir.",
    ],
    ingredients: [
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Saf Su",
        inci: "Aqua",
        percent: 82.2,
        role: "Ana çözücü",
        detail: "Serumun ana taşıyıcı fazını oluşturur.",
        processNote: "Ana behere alınır.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Propanediol",
        inci: "Propanediol",
        percent: 5,
        role: "Nem destekleyici / çözücü",
        detail:
          "Nem hissini artırır ve bazı aktiflerin çözünmesine destek olur.",
        processNote: "Su fazına eklenir.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Gliserin",
        inci: "Glycerin",
        percent: 3,
        role: "Humektan",
        detail:
          "Cilt yüzeyinde nem hissini artırır ve serumun daha kaygan yayılmasına destek olur.",
        processNote: "Su fazına eklenir.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Sodyum Hiyalüronat",
        inci: "Sodium Hyaluronate",
        percent: 0.2,
        role: "Nem tutucu aktif",
        detail:
          "Cilt yüzeyinde su tutmaya yardımcı olur. Daha dolgun ve nemli his verir.",
        processNote: "Yavaş hidrate edilmeli, topaklanma önlenmelidir.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Ksantan Gam",
        inci: "Xanthan Gum",
        percent: 0.15,
        role: "Hafif kıvam verici",
        detail:
          "Seruma hafif gövde kazandırır ve çok sulu akmasını azaltır.",
        processNote: "Propanediol veya gliserinle ön dispersiyon yapılabilir.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Aktif Faz",
        name: "Niasinamid",
        inci: "Niacinamide",
        percent: 4,
        role: "Aktif bileşen",
        detail:
          "Ton eşitsizliği görünümü, bariyer desteği ve sebum dengesi temalarında kullanılır.",
        processNote: "Oda sıcaklığında çözündürülür.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Aktif Faz",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 2,
        role: "Nem / yatıştırıcı destek",
        detail:
          "Cildin daha konforlu ve nemli hissedilmesine yardımcı olur.",
        processNote: "Su fazında çözündürülür.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Aktif Faz",
        name: "Betaine",
        inci: "Betaine",
        percent: 2,
        role: "Osmolit / nem destekleyici",
        detail:
          "Cildin nemli, yumuşak ve daha konforlu hissedilmesine destek olur.",
        processNote: "Suda çözündürülür.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Son Faz",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        detail:
          "Su bazlı serumun mikrobiyal bozulmaya karşı korunmasına destek olur.",
        processNote: "Son aşamada eklenir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Son Faz",
        name: "Solubilizer",
        inci: "Polysorbate 20",
        percent: 0.5,
        role: "Çözündürmeye yardımcı",
        detail:
          "Parfüm veya yağda çözünen küçük bileşenlerin serum içinde dağılmasına yardımcı olur.",
        processNote: "Parfümle ön karışım yapılabilir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Son Faz",
        name: "Parfüm",
        inci: "Parfum",
        percent: 0.05,
        role: "Koku verici",
        detail:
          "Ürüne hafif duyusal koku verir. Hassas cilt konseptinde çıkarılabilir.",
        processNote: "Solubilizer ile ön karışım yapılarak eklenir.",
      },
    ],
  },

  cleanser: {
    title: "Nazik Jel Temizleyici",
    productType: "Sülfatsız jel temizleyici",
    shortDescription:
      "Cildi germeden temizlemeyi hedefleyen, jel yapıda nazik temizleyici ön formülü.",
    claim:
      "Cildi nazikçe temizler, kuruluk ve gerginlik hissini azaltmaya yardımcı olur.",
    targetPh: "5.3 - 6.0",
    expectedViscosity:
      "Orta viskoz jel. Pompalı veya flip-top ambalaja uygun.",
    expectedColor: "Renksiz / hafif opak",
    expectedAppearance: "Şeffaf veya hafif opalimsi jel",
    expectedScent:
      "Hafif ferah kozmetik koku veya parfümsüz hammadde kokusu.",
    expectedTexture:
      "Kaygan, yumuşak köpüklü, cildi aşırı germeyen temizlik hissi.",
    packaging: "Pompalı şişe veya flip-top şişe",
    warning:
      "Temizleyicilerde yüzey aktif aktif madde oranı, göz/cilt iritasyon potansiyeli ve viskozite stabilitesi ayrıca değerlendirilmelidir.",
    method: [
      "Saf su ana behere alınır.",
      "Gliserin ve EDTA eklenir.",
      "Hidroksietil selüloz yavaşça serpilerek hidrate edilir.",
      "Yüzey aktifler düşük devirde ve köpürtmeden sırayla eklenir.",
      "Pantenol, koruyucu ve parfüm eklenir.",
      "pH 5.3-6.0 aralığına ayarlanır.",
      "Köpük, berraklık, viskozite, koku ve pH kontrol edilir.",
    ],
    ingredients: [
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Saf Su",
        inci: "Aqua",
        percent: 67.5,
        role: "Ana çözücü",
        detail: "Temizleyici bazın ana taşıyıcı fazını oluşturur.",
        processNote: "Ana behere alınır.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Gliserin",
        inci: "Glycerin",
        percent: 3,
        role: "Nem destekleyici",
        detail:
          "Temizlik sonrası kuruluk ve gerginlik hissini azaltmaya yardımcı olur.",
        processNote: "Su fazına eklenir.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Hidroksietil Selüloz",
        inci: "Hydroxyethylcellulose",
        percent: 0.8,
        role: "Jel kıvam verici",
        detail:
          "Ürüne jel yapı verir, akışkanlığı kontrol eder.",
        processNote: "Yavaşça serpilerek hidrate edilir.",
      },
      {
        phase: "A",
        phaseTitle: "Faz A - Su Fazı",
        name: "Disodyum EDTA",
        inci: "Disodium EDTA",
        percent: 0.1,
        role: "Şelatlayıcı",
        detail:
          "Metal iyonlarını bağlayarak formül stabilitesine ve koruyucu sisteme destek olur.",
        processNote: "Su fazında çözündürülür.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Temizleyici Faz",
        name: "Koko Glukozit",
        inci: "Coco-Glucoside",
        percent: 8,
        role: "Nazik noniyonik yüzey aktif",
        detail:
          "Temizleme performansı ve yumuşak köpük desteği sağlar.",
        processNote: "Düşük devirde, köpürtmeden eklenir.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Temizleyici Faz",
        name: "Kokamidopropil Betain",
        inci: "Cocamidopropyl Betaine",
        percent: 10,
        role: "Amfoterik yüzey aktif",
        detail:
          "Köpüğü destekler, temizleyici sistemin daha yumuşak hissedilmesine yardımcı olur.",
        processNote: "Yavaşça eklenir.",
      },
      {
        phase: "B",
        phaseTitle: "Faz B - Temizleyici Faz",
        name: "Sodyum Lauroil Sarkosinat",
        inci: "Sodium Lauroyl Sarcosinate",
        percent: 7,
        role: "Anyonik yüzey aktif",
        detail:
          "Temizleme gücünü ve köpük performansını artırır.",
        processNote: "Köpük oluşturmadan düşük devirde eklenir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Soğuk Faz",
        name: "Pantenol",
        inci: "Panthenol",
        percent: 1,
        role: "Konfor destekleyici aktif",
        detail:
          "Temizlik sonrası ciltte daha yumuşak ve rahat his bırakmaya destek olur.",
        processNote: "Son aşamada eklenir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Soğuk Faz",
        name: "Koruyucu Sistem",
        inci: "Phenoxyethanol, Ethylhexylglycerin",
        percent: 0.9,
        role: "Koruyucu",
        detail:
          "Su bazlı temizleyicinin mikrobiyal dayanımına destek olur.",
        processNote: "40°C altında eklenir.",
      },
      {
        phase: "C",
        phaseTitle: "Faz C - Soğuk Faz",
        name: "Parfüm",
        inci: "Parfum",
        percent: 0.2,
        role: "Koku verici",
        detail:
          "Ürünün daha hoş kokmasını sağlar. Hassas cilt konseptinde opsiyonel tutulabilir.",
        processNote: "Son aşamada eklenir.",
      },
      {
        phase: "D",
        phaseTitle: "Faz D - pH Ayarı",
        name: "pH Ayarlayıcı / Suya Tamamlama",
        inci: "Citric Acid / Sodium Hydroxide / Aqua",
        percent: 1.5,
        role: "pH düzenleyici / q.s.",
        detail:
          "Temizleyiciyi ciltle daha uyumlu pH aralığına getirir.",
        processNote: "pH ölçülerek q.s. ayarlanır.",
      },
    ],
  },
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: value < 1 ? 2 : 1,
    maximumFractionDigits: 2,
  }).format(value);
}

function detectProductType(text: string): ProductType {
  const lower = text.toLocaleLowerCase("tr-TR");

  if (
    lower.includes("serum") ||
    lower.includes("hyaluron") ||
    lower.includes("aydınlık") ||
    lower.includes("leke") ||
    lower.includes("ton eşit")
  ) {
    return "serum";
  }

  if (
    lower.includes("temiz") ||
    lower.includes("yıkama") ||
    lower.includes("jel") ||
    lower.includes("cleanser") ||
    lower.includes("köpük")
  ) {
    return "cleanser";
  }

  return "cream";
}

function createAnalysisAnswer(question: string) {
  const q = question.toLocaleLowerCase("tr-TR");

  if (!question.trim()) {
    return "Analiz etmek istediğin hammaddeyi, ürünü veya formül problemini yazınca burada sade ve teknik bir açıklama oluşacak.";
  }

  if (q.includes("niasinamid") || q.includes("niacinamide")) {
    return "Niasinamid; bariyer desteği, ton eşitsizliği görünümü ve sebum dengesi için sık kullanılan çok yönlü bir aktiftir. Genelde cilt bakım formüllerinde pH 5-7 aralığında daha konforlu değerlendirilir. Çok asidik sistemlerle birlikte düşünülüyorsa stabilite ve cilt toleransı ayrıca kontrol edilmelidir.";
  }

  if (q.includes("gliserin") || q.includes("glycerin")) {
    return "Gliserin güçlü bir humektandır. Su tutarak ciltte nem hissini artırır. Formülde sürüm konforunu artırır ama yüksek oranlarda yapışkanlık hissi verebilir. Krem, serum, temizleyici ve saç bakım ürünlerinde çok kullanışlıdır.";
  }

  if (q.includes("ksantan") || q.includes("xanthan")) {
    return "Ksantan gam doğal kökenli bir kıvam ve stabilite destekleyicisidir. Su fazına yapı verir, süspansiyon ve emülsiyon stabilitesine yardım eder. Topaklanmaması için genelde gliserin/propanediol içinde ön dispersiyon yapılıp suya eklenmesi daha temiz sonuç verir.";
  }

  if (q.includes("ph") || q.includes("pH")) {
    return "pH, hem cilt uyumu hem de aktif/koruyucu sistem performansı için kritik bir kontroldür. Cilt bakım ürünlerinde çoğunlukla 5.0-6.0 aralığı hedeflenir; temizleyicilerde 5.3-6.5 bandı tercih edilebilir. Nihai karar aktiflere, koruyucuya ve ürün iddiasına göre verilir.";
  }

  return "Bu alan İnciLab analiz modülü gibi çalışır: hammadde görevi, formüldeki davranışı, pH/çözünürlük/stabilite etkisi ve pratik üretim notlarını sade şekilde yorumlar. Daha özel sonuç için hammadde adı, ürün tipi ve hedef iddiayı birlikte yazmak en iyi sonucu verir.";
}

export default function Page() {
  const [analysisQuestion, setAnalysisQuestion] = useState("");
  const [analysisAnswer, setAnalysisAnswer] = useState(
    "Burada analiz sonucu görünecek. Hammadde, INCI, ürün tipi veya formül problemi yazabilirsin."
  );

  const [formulaQuestion, setFormulaQuestion] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("cream");
  const [batchSize, setBatchSize] = useState(100);
  const [activeFormulaTab, setActiveFormulaTab] = useState<
    "formula" | "method" | "ingredients" | "properties"
  >("formula");

  const formula = formulaTemplates[selectedProduct];

  const totalPercent = useMemo(() => {
    return formula.ingredients.reduce((sum, item) => sum + item.percent, 0);
  }, [formula]);

  const groupedIngredients = useMemo(() => {
    const phases: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

    return phases
      .map((phase) => {
        const items = formula.ingredients.filter((item) => item.phase === phase);
        return {
          phase,
          title: items[0]?.phaseTitle || `Faz ${phase}`,
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [formula]);

  function handleAnalysis() {
    setAnalysisAnswer(createAnalysisAnswer(analysisQuestion));
  }

  function handleFormulaGenerate() {
    const detected = detectProductType(formulaQuestion);
    setSelectedProduct(detected);
    setActiveFormulaTab("formula");
  }

  function copyFormulaText() {
    const lines: string[] = [];

    lines.push("İNCİLAB AR-GE FORMÜL KARTI");
    lines.push("");
    lines.push(`Ürün: ${formula.title}`);
    lines.push(`Ürün tipi: ${formula.productType}`);
    lines.push(`Açıklama: ${formula.shortDescription}`);
    lines.push(`Hedef iddia: ${formula.claim}`);
    lines.push(`Hedef pH: ${formula.targetPh}`);
    lines.push(`Batch: ${batchSize} g`);
    lines.push("");

    lines.push("FORMÜL:");
    groupedIngredients.forEach((group) => {
      lines.push("");
      lines.push(group.title);
      group.items.forEach((item) => {
        const amount = (item.percent * batchSize) / 100;
        lines.push(
          `- ${item.name} | INCI: ${item.inci} | %${formatNumber(
            item.percent
          )} | ${formatNumber(amount)} g | ${item.role}`
        );
      });
    });

    lines.push("");
    lines.push("FAZ FAZ ÜRETİM:");
    formula.method.forEach((step, index) => {
      lines.push(`${index + 1}. ${step}`);
    });

    lines.push("");
    lines.push("BEKLENEN ÜRÜN ÖZELLİKLERİ:");
    lines.push(`Görünüm: ${formula.expectedAppearance}`);
    lines.push(`Renk: ${formula.expectedColor}`);
    lines.push(`Koku: ${formula.expectedScent}`);
    lines.push(`Viskozite: ${formula.expectedViscosity}`);
    lines.push(`Doku/Hissiyat: ${formula.expectedTexture}`);
    lines.push(`pH: ${formula.targetPh}`);
    lines.push(`Ambalaj: ${formula.packaging}`);
    lines.push("");
    lines.push(`AR-GE Uyarısı: ${formula.warning}`);

    navigator.clipboard.writeText(lines.join("\n"));
    alert("Formül kartı kopyalandı kankam ✨");
  }

  function printPage() {
    window.print();
  }

  return (
    <main className="incilab-page">
      <section className="topbar no-print">
        <div className="brand">
          <div className="brand-mark">İ</div>
          <div>
            <strong>İnciLab</strong>
            <span>Kimya & Kozmetik AR-GE Asistanı</span>
          </div>
        </div>

        <div className="status-pill">Mor-beyaz eski düzen • Formül alanı zengin</div>
      </section>

      <section className="hero">
        <div>
          <p className="eyebrow">İnciLab Workspace</p>
          <h1>Analiz et, formül oluştur, faz faz geliştir.</h1>
          <p className="hero-text">
            Eski sade İnciLab düzeni korunarak formülasyon alanı güçlendirildi:
            artık hammaddelerin görevini, üretim fazlarını, pH, viskozite, renk,
            koku ve beklenen görünümü birlikte verir.
          </p>
        </div>

        <div className="hero-card">
          <span>Aktif Modül</span>
          <strong>Formülasyon</strong>
          <small>100 g / ölçekli AR-GE kartı</small>
        </div>
      </section>

      <section className="workspace">
        <div className="left-column">
          <section className="card no-print">
            <div className="section-head">
              <div>
                <p className="mini-title">Analiz Sor</p>
                <h2>Hammadde / INCI analizi</h2>
              </div>
            </div>

            <textarea
              value={analysisQuestion}
              onChange={(event) => setAnalysisQuestion(event.target.value)}
              placeholder="Örn: Niasinamid ne işe yarar? pH aralığı nasıl olmalı? Ksantan gam neden topaklanır?"
              className="input-area"
            />

            <button type="button" className="primary-button" onClick={handleAnalysis}>
              Analiz Et
            </button>
          </section>

          <section className="card">
            <div className="section-head">
              <div>
                <p className="mini-title">Formül Sor</p>
                <h2>Zenginleştirilmiş formülasyon alanı</h2>
              </div>

              <div className="percent-pill">
                Toplam: %{formatNumber(totalPercent)}
              </div>
            </div>

            <textarea
              value={formulaQuestion}
              onChange={(event) => setFormulaQuestion(event.target.value)}
              placeholder="Örn: Bariyer destekleyici krem istiyorum. Faz faz anlat, aktiflerin ne işe yaradığını, pH, viskozite, renk, koku ve görünümü yaz."
              className="input-area"
            />

            <div className="form-row no-print">
              <div>
                <label>Ürün tipi</label>
                <select
                  value={selectedProduct}
                  onChange={(event) =>
                    setSelectedProduct(event.target.value as ProductType)
                  }
                >
                  <option value="cream">Bariyer Destekleyici Krem</option>
                  <option value="serum">Nem & Aydınlık Serum</option>
                  <option value="cleanser">Nazik Jel Temizleyici</option>
                </select>
              </div>

              <div>
                <label>Batch: {batchSize} g</label>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={batchSize}
                  onChange={(event) => setBatchSize(Number(event.target.value))}
                />
              </div>
            </div>

            <div className="button-row no-print">
              <button
                type="button"
                className="primary-button"
                onClick={handleFormulaGenerate}
              >
                Formülü Oluştur
              </button>
              <button type="button" className="soft-button" onClick={copyFormulaText}>
                Kopyala
              </button>
              <button type="button" className="soft-button" onClick={printPage}>
                PDF / Yazdır
              </button>
            </div>
          </section>

          <section className="trend-card no-print">
            <p className="mini-title">Trend Bileşenler</p>
            <div className="chips">
              <span>Niasinamid</span>
              <span>Pantenol</span>
              <span>Seramid</span>
              <span>Betaine</span>
              <span>Hyaluronik Asit</span>
              <span>Azelaik Asit</span>
            </div>
          </section>
        </div>

        <aside className="right-column">
          <section className="result-card no-print">
            <p className="mini-title">Analiz Sonucu</p>
            <p>{analysisAnswer}</p>
          </section>

          <section className="formula-card print-section">
            <div className="formula-header">
              <div>
                <p className="mini-title">Detaylı AR-GE Formül Kartı</p>
                <h2>{formula.title}</h2>
                <p>{formula.shortDescription}</p>
              </div>

              <div className="ph-box">
                <span>Hedef pH</span>
                <strong>{formula.targetPh}</strong>
              </div>
            </div>

            <div className="claim-box">
              <strong>Hedef ürün iddiası</strong>
              <p>{formula.claim}</p>
            </div>

            <nav className="tabs no-print">
              <button
                type="button"
                className={activeFormulaTab === "formula" ? "active" : ""}
                onClick={() => setActiveFormulaTab("formula")}
              >
                Formül
              </button>
              <button
                type="button"
                className={activeFormulaTab === "method" ? "active" : ""}
                onClick={() => setActiveFormulaTab("method")}
              >
                Faz Faz Yapılış
              </button>
              <button
                type="button"
                className={activeFormulaTab === "ingredients" ? "active" : ""}
                onClick={() => setActiveFormulaTab("ingredients")}
              >
                Hammaddeler
              </button>
              <button
                type="button"
                className={activeFormulaTab === "properties" ? "active" : ""}
                onClick={() => setActiveFormulaTab("properties")}
              >
                Özellikler
              </button>
            </nav>

            {activeFormulaTab === "formula" && (
              <div className="phase-stack">
                {groupedIngredients.map((group) => (
                  <div className="phase-box" key={group.phase}>
                    <h3>{group.title}</h3>

                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Hammadde</th>
                            <th>INCI</th>
                            <th>%</th>
                            <th>{batchSize} g için</th>
                            <th>Görev</th>
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
            )}

            {activeFormulaTab === "method" && (
              <ol className="method-list">
                {formula.method.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            )}

            {activeFormulaTab === "ingredients" && (
              <div className="ingredient-grid">
                {formula.ingredients.map((item) => (
                  <article className="ingredient-card" key={`${item.phase}-${item.name}`}>
                    <span>Faz {item.phase}</span>
                    <h3>{item.name}</h3>
                    <small>{item.inci}</small>
                    <p>
                      <b>Görevi:</b> {item.role}
                    </p>
                    <p>{item.detail}</p>
                    <div className="note">
                      <b>Üretim notu:</b> {item.processNote}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeFormulaTab === "properties" && (
              <div className="property-grid">
                <InfoCard title="Ürün tipi" value={formula.productType} />
                <InfoCard title="Beklenen pH" value={formula.targetPh} />
                <InfoCard title="Viskozite" value={formula.expectedViscosity} />
                <InfoCard title="Renk" value={formula.expectedColor} />
                <InfoCard title="Görünüm" value={formula.expectedAppearance} />
                <InfoCard title="Koku" value={formula.expectedScent} />
                <InfoCard title="Doku / Hissiyat" value={formula.expectedTexture} />
                <InfoCard title="Ambalaj" value={formula.packaging} />
              </div>
            )}

            <div className="warning-box">
              <strong>AR-GE Uyarısı</strong>
              <p>{formula.warning}</p>
            </div>
          </section>
        </aside>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at top left, rgba(168, 85, 247, 0.18), transparent 34%),
            radial-gradient(circle at top right, rgba(236, 72, 153, 0.12), transparent 28%),
            linear-gradient(180deg, #fdfbff 0%, #faf5ff 48%, #ffffff 100%);
          color: #241233;
        }

        .incilab-page {
          min-height: 100vh;
          padding: 24px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: white;
          font-weight: 900;
          background: linear-gradient(135deg, #7e22ce, #c026d3, #ec4899);
          box-shadow: 0 16px 34px rgba(126, 34, 206, 0.22);
        }

        .brand strong {
          display: block;
          font-size: 18px;
          color: #2b1244;
        }

        .brand span {
          display: block;
          font-size: 13px;
          color: #7c6a8a;
        }

        .status-pill,
        .percent-pill {
          width: fit-content;
          border-radius: 999px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(126, 34, 206, 0.13);
          color: #7e22ce;
          font-size: 13px;
          font-weight: 800;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          gap: 18px;
          margin-bottom: 20px;
        }

        .eyebrow,
        .mini-title {
          margin: 0 0 8px;
          color: #8b5cf6;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 860px;
          margin-bottom: 14px;
          color: #2b1244;
          font-size: clamp(38px, 5vw, 68px);
          line-height: 0.95;
          letter-spacing: -0.065em;
        }

        h2 {
          margin-bottom: 8px;
          color: #2b1244;
          font-size: 24px;
          letter-spacing: -0.035em;
        }

        h3 {
          margin-bottom: 8px;
          color: #32164f;
          font-size: 17px;
        }

        .hero-text {
          max-width: 850px;
          color: #6d5b7b;
          line-height: 1.7;
        }

        .hero-card,
        .card,
        .result-card,
        .formula-card,
        .trend-card {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(126, 34, 206, 0.13);
          border-radius: 30px;
          box-shadow: 0 20px 60px rgba(88, 28, 135, 0.08);
          backdrop-filter: blur(16px);
        }

        .hero-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 180px;
        }

        .hero-card span {
          color: #7c6a8a;
          font-size: 13px;
          font-weight: 800;
        }

        .hero-card strong {
          margin: 6px 0;
          color: #7e22ce;
          font-size: 34px;
          letter-spacing: -0.04em;
        }

        .hero-card small {
          color: #7c6a8a;
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(340px, 0.82fr) minmax(0, 1.18fr);
          gap: 18px;
          align-items: start;
        }

        .left-column,
        .right-column {
          display: grid;
          gap: 18px;
        }

        .card,
        .result-card,
        .formula-card,
        .trend-card {
          padding: 22px;
        }

        .section-head,
        .formula-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
        }

        .input-area {
          width: 100%;
          min-height: 104px;
          resize: vertical;
          border: 1px solid rgba(126, 34, 206, 0.16);
          outline: none;
          border-radius: 22px;
          background: white;
          padding: 14px 15px;
          color: #2b1244;
          font: inherit;
          line-height: 1.55;
        }

        .input-area:focus,
        select:focus {
          border-color: rgba(126, 34, 206, 0.48);
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.12);
        }

        .primary-button,
        .soft-button,
        .tabs button {
          border: 0;
          cursor: pointer;
          font: inherit;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .primary-button {
          margin-top: 12px;
          width: 100%;
          border-radius: 18px;
          padding: 14px 16px;
          color: white;
          font-weight: 900;
          background: linear-gradient(135deg, #7e22ce, #c026d3, #ec4899);
          box-shadow: 0 16px 34px rgba(126, 34, 206, 0.2);
        }

        .primary-button:hover,
        .soft-button:hover,
        .tabs button:hover {
          transform: translateY(-1px);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 14px;
        }

        label {
          display: block;
          margin-bottom: 7px;
          color: #7c6a8a;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        select {
          width: 100%;
          border: 1px solid rgba(126, 34, 206, 0.16);
          outline: none;
          border-radius: 18px;
          background: white;
          padding: 13px 14px;
          color: #2b1244;
          font: inherit;
        }

        input[type="range"] {
          width: 100%;
          accent-color: #8b5cf6;
        }

        .button-row {
          display: grid;
          grid-template-columns: 1fr 110px 110px;
          gap: 10px;
          margin-top: 12px;
        }

        .button-row .primary-button {
          margin-top: 0;
        }

        .soft-button {
          border-radius: 18px;
          padding: 14px 12px;
          background: #f5edff;
          color: #7e22ce;
          font-weight: 900;
        }

        .trend-card {
          background: rgba(255, 255, 255, 0.68);
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chips span {
          border-radius: 999px;
          background: #f3e8ff;
          color: #7e22ce;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 800;
        }

        .result-card p:last-child {
          margin-bottom: 0;
          color: #4b315f;
          line-height: 1.7;
        }

        .formula-card {
          overflow: hidden;
        }

        .formula-header p {
          margin-bottom: 0;
          color: #6d5b7b;
          line-height: 1.6;
        }

        .ph-box {
          min-width: 132px;
          border-radius: 22px;
          background: #f3e8ff;
          padding: 14px;
          color: #7e22ce;
          text-align: center;
        }

        .ph-box span {
          display: block;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .ph-box strong {
          display: block;
          margin-top: 4px;
          font-size: 20px;
        }

        .claim-box {
          margin: 14px 0;
          border-left: 5px solid #a855f7;
          border-radius: 22px;
          background: linear-gradient(135deg, #faf5ff, #fff);
          padding: 16px;
        }

        .claim-box strong {
          color: #7e22ce;
        }

        .claim-box p {
          margin: 8px 0 0;
          color: #4b315f;
          line-height: 1.6;
        }

        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0;
        }

        .tabs button {
          border-radius: 999px;
          padding: 10px 13px;
          background: #f3e8ff;
          color: #7e22ce;
          font-size: 13px;
          font-weight: 900;
        }

        .tabs button.active {
          color: white;
          background: linear-gradient(135deg, #7e22ce, #c026d3);
          box-shadow: 0 12px 25px rgba(126, 34, 206, 0.18);
        }

        .phase-stack {
          display: grid;
          gap: 14px;
        }

        .phase-box {
          overflow: hidden;
          border: 1px solid rgba(126, 34, 206, 0.12);
          border-radius: 24px;
          background: #fff;
        }

        .phase-box h3 {
          margin: 0;
          background: #f3e8ff;
          color: #6b21a8;
          padding: 13px 15px;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
        }

        th,
        td {
          border-bottom: 1px solid rgba(126, 34, 206, 0.09);
          padding: 12px;
          text-align: left;
          vertical-align: top;
          font-size: 13px;
        }

        th {
          background: rgba(250, 245, 255, 0.65);
          color: #7e22ce;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        td {
          color: #432457;
          line-height: 1.45;
        }

        .method-list {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .method-list li {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 12px;
          border-radius: 20px;
          background: #faf5ff;
          padding: 13px;
        }

        .method-list span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: #8b5cf6;
          font-weight: 900;
        }

        .method-list p {
          margin: 5px 0 0;
          color: #432457;
          line-height: 1.6;
        }

        .ingredient-grid,
        .property-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .ingredient-card,
        .info-card {
          border: 1px solid rgba(126, 34, 206, 0.12);
          border-radius: 24px;
          background: #fff;
          padding: 16px;
        }

        .ingredient-card span {
          display: inline-flex;
          border-radius: 999px;
          background: #f3e8ff;
          color: #7e22ce;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 900;
        }

        .ingredient-card h3 {
          margin: 12px 0 2px;
        }

        .ingredient-card small {
          display: block;
          color: #7c6a8a;
          margin-bottom: 10px;
        }

        .ingredient-card p {
          color: #4b315f;
          line-height: 1.6;
        }

        .note {
          border-radius: 18px;
          background: #faf5ff;
          padding: 12px;
          color: #4b315f;
          line-height: 1.55;
        }

        .info-card span {
          display: block;
          margin-bottom: 8px;
          color: #8b5cf6;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .info-card p {
          margin: 0;
          color: #432457;
          line-height: 1.6;
        }

        .warning-box {
          margin-top: 16px;
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 24px;
          background: #fffbeb;
          padding: 16px;
          color: #7c4a03;
        }

        .warning-box p {
          margin: 8px 0 0;
          line-height: 1.6;
        }

        @media (max-width: 1050px) {
          .workspace,
          .hero {
            grid-template-columns: 1fr;
          }

          .hero-card {
            min-height: auto;
          }
        }

        @media (max-width: 720px) {
          .incilab-page {
            padding: 16px;
          }

          .topbar,
          .section-head,
          .formula-header {
            flex-direction: column;
          }

          .form-row,
          .button-row,
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
          }

          .no-print,
          .topbar,
          .hero,
          .left-column,
          .result-card,
          .tabs {
            display: none !important;
          }

          .workspace {
            display: block;
          }

          .formula-card {
            box-shadow: none;
            border: 0;
            padding: 0;
          }

          .phase-box,
          .ingredient-card,
          .info-card,
          .claim-box,
          .warning-box,
          .ph-box {
            break-inside: avoid;
            box-shadow: none;
          }

          table {
            min-width: 0;
          }

          th,
          td {
            font-size: 10px;
            padding: 7px;
          }
        }
      `}</style>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="info-card">
      <span>{title}</span>
      <p>{value}</p>
    </div>
  );
}
