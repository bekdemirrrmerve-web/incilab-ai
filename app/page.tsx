"use client";

import React, { useMemo, useState } from "react";

type SectorKey =
  | "Kozmetik"
  | "İlaç"
  | "Gıda"
  | "Biyoteknoloji"
  | "Nanoteknoloji"
  | "Malzeme Bilimi"
  | "Parfüm & Koku";

type FormulaKey = "serum" | "cleanser" | "cream" | "perfume";

type ChatMessage = {
  id: number;
  sender: "user" | "assistant";
  text: string;
};

type Phase = {
  key: string;
  name: string;
  percent: number;
  items: {
    name: string;
    inci: string;
    percent: number;
    functionName: string;
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
  claim: string;
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
  "Parfüm & Koku",
];

const sectorInfo: Record<SectorKey, string> = {
  Kozmetik:
    "Kozmetik sektörü açıldı. INCI, aktif bileşen, formülasyon, pH, viskozite, stabilite, koku, renk, doku ve mevzuat kontrolü yapabiliriz.",
  İlaç:
    "İlaç sektörü açıldı. Yardımcı maddeler, çözünürlük, stabilite, farmasötik kalite ve dozaj formu üzerinden değerlendirme yapılabilir.",
  Gıda:
    "Gıda sektörü açıldı. Katkı maddeleri, pH, raf ömrü, kalite kontrol, mikrobiyolojik risk ve analiz parametreleri değerlendirilebilir.",
  Biyoteknoloji:
    "Biyoteknoloji sektörü açıldı. Enzim, kültür, protein, biyopolimer, fermentasyon ve biyouyumluluk tarafında çalışabiliriz.",
  Nanoteknoloji:
    "Nanoteknoloji sektörü açıldı. Partikül boyutu, dispersiyon, kaplama, yüzey morfolojisi ve stabilite tarafında analiz yapılabilir.",
  "Malzeme Bilimi":
    "Malzeme Bilimi sektörü açıldı. Polimer, kompozit, termal analiz, mekanik dayanım ve yüzey karakterizasyonu değerlendirilebilir.",
  "Parfüm & Koku":
    "Parfüm & Koku sektörü açıldı. Esans akordu, üst/orta/dip nota, EDP/EDT oranı, dinlendirme, filtreleme ve IFRA güvenliği üzerinden ilerleyebiliriz.",
};

const formulas: Record<FormulaKey, Formula> = {
  serum: {
    title: "Hassas Ciltler İçin Nemlendirici Serum",
    productType: "Su bazlı serum",
    ph: "5.2 - 5.8",
    viscosity: "Düşük-orta / akışkan serum",
    appearance: "Şeffaf veya hafif opalimsi serum",
    scent: "Parfümsüz veya çok hafif kozmetik koku",
    skinFeel: "Hafif, nemli, yapışkanlığı düşük",
    claim:
      "Hassas ciltlerde nem desteği, bariyer hissi ve yatıştırıcı konfor hedefleyen serum.",
    phases: [
      {
        key: "A",
        name: "Sulu Faz",
        percent: 65,
        items: [
          { name: "Deiyonize Su", inci: "Aqua", percent: 55.6, functionName: "Çözücü" },
          { name: "Gliserin", inci: "Glycerin", percent: 5, functionName: "Nemlendirici" },
          { name: "Pentylene Glycol", inci: "Pentylene Glycol", percent: 3, functionName: "Nemlendirici / Çözücü" },
          { name: "Panthenol", inci: "Panthenol", percent: 1.4, functionName: "Nemlendirici / Yatıştırıcı" },
        ],
      },
      {
        key: "B",
        name: "Aktif Faz",
        percent: 20,
        items: [
          { name: "Niacinamide", inci: "Niacinamide", percent: 5, functionName: "Aydınlatıcı / Sebum Dengesi" },
          { name: "Sodium Hyaluronate", inci: "Sodium Hyaluronate", percent: 0.3, functionName: "Nemlendirici" },
          { name: "Allantoin", inci: "Allantoin", percent: 0.2, functionName: "Yatıştırıcı" },
          { name: "Beta-Glucan", inci: "Beta-Glucan", percent: 1, functionName: "Cilt Bariyeri Desteği" },
        ],
      },
      {
        key: "C",
        name: "Destek Fazı",
        percent: 10,
        items: [
          { name: "Ectoin", inci: "Ectoin", percent: 0.5, functionName: "Çevresel Stres Desteği" },
          { name: "Trehalose", inci: "Trehalose", percent: 2, functionName: "Nem / Osmoprotektif" },
          { name: "Koruyucu Sistem", inci: "Phenoxyethanol, Ethylhexylglycerin", percent: 0.9, functionName: "Koruyucu" },
        ],
      },
      {
        key: "D",
        name: "pH / Son Ayar",
        percent: 5,
        items: [
          { name: "Citric Acid Solution", inci: "Citric Acid, Aqua", percent: 0.3, functionName: "pH Düzenleyici" },
          { name: "Sodium Citrate", inci: "Sodium Citrate", percent: 0.2, functionName: "Tamponlayıcı" },
        ],
      },
    ],
    method: [
      "Faz A için deiyonize su ana behere alınır. Gliserin ve Pentylene Glycol eklenir.",
      "Panthenol sulu faza eklenir ve tamamen çözünene kadar orta devirde karıştırılır.",
      "Faz B aktifleri sırayla eklenir. Niacinamide tamamen çözündürülür.",
      "Sodium Hyaluronate yavaşça serpilerek eklenir. Topaklanmayı önlemek için düşük-orta devirde hidrate edilir.",
      "Allantoin ve Beta-Glucan eklenir. Karışım berrak veya homojen görünene kadar karıştırılır.",
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
    claim:
      "Hassas ciltleri kurutmadan temizlemeyi hedefleyen, pH dengeli ve sülfatsız jel temizleyici.",
    phases: [
      {
        key: "A",
        name: "Sulu Faz",
        percent: 68,
        items: [
          { name: "Deiyonize Su", inci: "Aqua", percent: 58, functionName: "Çözücü" },
          { name: "Gliserin", inci: "Glycerin", percent: 4, functionName: "Nem desteği" },
          { name: "Hydroxyethylcellulose", inci: "Hydroxyethylcellulose", percent: 0.8, functionName: "Jel kıvam verici" },
        ],
      },
      {
        key: "B",
        name: "Yüzey Aktif Faz",
        percent: 24,
        items: [
          { name: "Coco-Glucoside", inci: "Coco-Glucoside", percent: 7, functionName: "Nazik temizleyici" },
          { name: "Cocamidopropyl Betaine", inci: "Cocamidopropyl Betaine", percent: 10, functionName: "Köpük destekleyici" },
          { name: "Decyl Glucoside", inci: "Decyl Glucoside", percent: 5, functionName: "Nazik yüzey aktif" },
        ],
      },
      {
        key: "C",
        name: "Aktif Destek",
        percent: 5,
        items: [
          { name: "Panthenol", inci: "Panthenol", percent: 1, functionName: "Yatıştırıcı" },
          { name: "Allantoin", inci: "Allantoin", percent: 0.2, functionName: "Konfor desteği" },
          { name: "Betaine", inci: "Betaine", percent: 2, functionName: "Nem desteği" },
        ],
      },
      {
        key: "D",
        name: "Koruma / pH",
        percent: 3,
        items: [
          { name: "Koruyucu Sistem", inci: "Phenoxyethanol, Ethylhexylglycerin", percent: 0.9, functionName: "Koruyucu" },
          { name: "Citric Acid", inci: "Citric Acid", percent: 0.2, functionName: "pH Ayarı" },
        ],
      },
    ],
    method: [
      "Faz A hazırlanır. Su ana behere alınır, gliserin eklenir.",
      "Hydroxyethylcellulose yavaşça serpilerek eklenir ve tam hidrate olana kadar beklenir.",
      "Faz B yüzey aktifleri köpürtmeden, düşük devirde sırayla eklenir.",
      "Faz C aktif destek bileşenleri eklenir.",
      "Koruyucu sistem ilave edilir ve homojen karışım sağlanır.",
      "pH 5.0 - 5.5 aralığına ayarlanır.",
      "Köpük, berraklık, viskozite, pH ve cilt hissi kontrol edilir.",
    ],
  },

  cream: {
    title: "Bariyer Destekleyici Nemlendirici Krem",
    productType: "O/W emülsiyon krem",
    ph: "5.2 - 5.8",
    viscosity: "Orta-yüksek viskozite",
    appearance: "Beyaz / kırık beyaz homojen krem",
    scent: "Hafif kozmetik koku veya parfümsüz",
    skinFeel: "Yumuşak, konforlu, hafif film bırakan",
    claim:
      "Kuru ve hassas ciltlerde bariyer hissini destekleyen, nem veren ve konfor sağlayan krem.",
    phases: [
      {
        key: "A",
        name: "Su Fazı",
        percent: 70,
        items: [
          { name: "Deiyonize Su", inci: "Aqua", percent: 62, functionName: "Çözücü" },
          { name: "Gliserin", inci: "Glycerin", percent: 4, functionName: "Nemlendirici" },
          { name: "Xanthan Gum", inci: "Xanthan Gum", percent: 0.3, functionName: "Kıvam / Stabilite" },
        ],
      },
      {
        key: "B",
        name: "Yağ Fazı",
        percent: 20,
        items: [
          { name: "Caprylic/Capric Triglyceride", inci: "Caprylic/Capric Triglyceride", percent: 6, functionName: "Yumuşatıcı" },
          { name: "Cetearyl Alcohol", inci: "Cetearyl Alcohol", percent: 3, functionName: "Kıvam Verici" },
          { name: "Glyceryl Stearate Citrate", inci: "Glyceryl Stearate Citrate", percent: 2.5, functionName: "Emülgatör" },
        ],
      },
      {
        key: "C",
        name: "Aktif Faz",
        percent: 7,
        items: [
          { name: "Niacinamide", inci: "Niacinamide", percent: 4, functionName: "Bariyer / Ton Desteği" },
          { name: "Panthenol", inci: "Panthenol", percent: 2, functionName: "Yatıştırıcı" },
          { name: "Ceramide Complex", inci: "Ceramide NP, AP, EOP", percent: 0.5, functionName: "Bariyer Desteği" },
        ],
      },
      {
        key: "D",
        name: "Soğuk Faz",
        percent: 3,
        items: [
          { name: "Koruyucu Sistem", inci: "Phenoxyethanol, Ethylhexylglycerin", percent: 0.9, functionName: "Koruyucu" },
          { name: "pH Ayarlayıcı", inci: "Citric Acid / Sodium Hydroxide", percent: 0.2, functionName: "pH Ayarı" },
        ],
      },
    ],
    method: [
      "Faz A hazırlanır. Su, gliserin ve kıvam verici ana behere alınır.",
      "Faz A 70-75°C’ye kadar ısıtılır.",
      "Faz B ayrı kapta hazırlanır ve yağ fazı tamamen eriyene kadar ısıtılır.",
      "Faz B, Faz A üzerine yavaşça eklenir ve homojenizatör ile karıştırılır.",
      "Karışım soğumaya bırakılır.",
      "40°C altına düşünce Faz C aktifleri ve Faz D koruyucu sistemi eklenir.",
      "pH 5.2 - 5.8 aralığına ayarlanır.",
      "Son üründe görünüm, koku, pH, viskozite ve faz ayrımı kontrol edilir.",
    ],
  },

  perfume: {
    title: "Fresh Temiz Koku Parfüm Akordu",
    productType: "EDP / Esans akordu",
    ph: "Uygulanmaz",
    viscosity: "Düşük viskozite / alkol bazlı sıvı",
    appearance: "Berrak veya çok hafif sarımsı sıvı",
    scent: "Fresh, temiz, narenciye-çiçeksi, hafif odunsu",
    skinFeel: "Uçucu, ferah, tende temiz his",
    claim:
      "Fresh, temiz ve hafif kalıcı bir koku profili için üst, orta ve dip notaları dengelenmiş parfüm denemesi.",
    phases: [
      {
        key: "A",
        name: "Üst Nota",
        percent: 45,
        items: [
          { name: "Bergamot", inci: "Fragrance / Citrus Bergamia Oil", percent: 20, functionName: "Fresh açılış" },
          { name: "Limon", inci: "Fragrance / Citrus Limon", percent: 10, functionName: "Ferah narenciye" },
          { name: "Greyfurt", inci: "Fragrance / Citrus Paradisi", percent: 8, functionName: "Canlı ferahlık" },
          { name: "Yeşil Nota", inci: "Green Accord", percent: 7, functionName: "Temiz yeşil etki" },
        ],
      },
      {
        key: "B",
        name: "Orta Nota",
        percent: 35,
        items: [
          { name: "Neroli", inci: "Fragrance / Neroli Accord", percent: 15, functionName: "Temiz çiçeksi gövde" },
          { name: "Beyaz Çay", inci: "White Tea Accord", percent: 10, functionName: "Soft fresh gövde" },
          { name: "Frezya", inci: "Freesia Accord", percent: 10, functionName: "Zarif çiçeksi etki" },
        ],
      },
      {
        key: "C",
        name: "Dip Nota",
        percent: 20,
        items: [
          { name: "Temiz Musk", inci: "Musk Accord", percent: 8, functionName: "Kalıcılık / temiz his" },
          { name: "Sedir", inci: "Cedarwood Accord", percent: 7, functionName: "Hafif odunsuluk" },
          { name: "Amber", inci: "Amber Accord", percent: 5, functionName: "Sıcak dip nota" },
        ],
      },
    ],
    method: [
      "Önce esans akordu hazırlanır. Tüm üst, orta ve dip nota bileşenleri hassas terazide tartılır.",
      "Bileşenler koyu renk cam şişede birleştirilir ve yavaşça çalkalanır.",
      "Esans konsantresi 24-48 saat dinlendirilir. Bu aşamada koku daha yuvarlak hale gelir.",
      "EDP için örnek oran: %18 esans, %80 etil alkol/parfüm alkolü, %2 saf su veya uygun çözücü destek.",
      "Önce alkol behere alınır. Esans yavaş yavaş eklenir ve homojen karıştırılır.",
      "Karışım koyu renk cam şişede en az 2 hafta, daha iyi sonuç için 3-4 hafta dinlendirilir.",
      "Dinlendirme sonrası bulanıklık varsa uygun filtre ile süzülür.",
      "Alkol yanıcıdır. Açık alevden uzak çalışılır. IFRA, alerjen beyanı ve cilt toleransı kontrol edilmelidir.",
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

function normalizeText(text: string) {
  return text
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/\s+/g, " ")
    .trim();
}

function localClientFallback(question: string) {
  const q = normalizeText(question);

  if (
    q.includes("parfum") ||
    q.includes("parfüm") ||
    q.includes("esans") ||
    q.includes("koku") ||
    q.includes("fresh")
  ) {
    return [
      "Fresh kokulu parfüm için önce esans akordu kurulur. Mantık üst nota, orta nota ve dip nota şeklindedir.",
      "Başlangıç için fresh esans oranı: %45 üst nota, %35 orta nota, %20 dip nota olabilir.",
      "10 g fresh esans örneği: 2 g bergamot, 1 g limon, 0.8 g greyfurt, 0.7 g yeşil nota, 1.5 g neroli, 1 g beyaz çay, 1 g frezya, 0.8 g temiz musk, 0.7 g sedir, 0.5 g amber.",
      "Bu esans cam şişede 24-48 saat dinlendirilir. Sonra EDP için yaklaşık %18 esans, %80 alkol, %2 saf su/çözücü destek kullanılabilir.",
      "Karışım 2-4 hafta koyu renk cam şişede dinlendirilir, sonra gerekirse filtrelenir. Alkol yanıcıdır; IFRA ve alerjen güvenliği kontrol edilmelidir.",
    ].join(" ");
  }

  if (
    q.includes("niasinamid") ||
    q.includes("niasin amid") ||
    q.includes("niacinamide") ||
    q.includes("b3")
  ) {
    return "Niasinamid kozmetik formüllerde genelde %2-5 aralığında kullanılır. Hassas cilt ürünlerinde %2-4 daha konforlu olur. Bazı serumlarda %10 seviyesine kadar çıkılabilir ama pH, stabilite, çözünürlük ve tolerans testi gerekir.";
  }

  return "Sorunu aldım. Bunu ürün tipi, hedef etki, hammadde seçimi, kullanım oranı, pH, stabilite, üretim yöntemi ve güvenlik açısından yorumlayabilirim.";
}

export default function Page() {
  const [activeMenu, setActiveMenu] = useState("Ana Sayfa");
  const [selectedSector, setSelectedSector] = useState<SectorKey>("Kozmetik");
  const [formulaKey, setFormulaKey] = useState<FormulaKey>("serum");
  const [targetAmount, setTargetAmount] = useState(500);
  const [mainQuestion, setMainQuestion] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [inciSearch, setInciSearch] = useState("Niacinamide");
  const [inciResult, setInciResult] = useState(
    "Niacinamide / Niasinamid; bariyer desteği, ton eşitsizliği görünümü ve sebum dengesi için kullanılan çok yönlü bir aktif bileşendir."
  );
  const [market, setMarket] = useState("Avrupa Birliği (EU)");
  const [showMethod, setShowMethod] = useState(true);
  const [assistantMode, setAssistantMode] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState("A");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Merhaba, InciLab hazır. Sorunu nasıl yazarsan yaz, niyetini anlayıp kimya, formülasyon, INCI, mevzuat veya üretim yöntemi açısından cevaplamaya çalışacağım.",
    },
  ]);

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

  function addMessage(sender: "user" | "assistant", text: string) {
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender,
        text,
      },
    ]);
  }

  function setFormulaFromQuestion(text: string) {
    const q = normalizeText(text);

    if (
      q.includes("parfum") ||
      q.includes("parfüm") ||
      q.includes("esans") ||
      q.includes("koku") ||
      q.includes("fresh")
    ) {
      setFormulaKey("perfume");
      setSelectedSector("Parfüm & Koku");
      return;
    }

    if (q.includes("temizleme") || q.includes("jel") || q.includes("cleanser")) {
      setFormulaKey("cleanser");
      return;
    }

    if (q.includes("krem")) {
      setFormulaKey("cream");
      return;
    }

    if (q.includes("serum") || q.includes("nem")) {
      setFormulaKey("serum");
    }
  }

  function scrollTo(id: string) {
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  async function handleSend(question?: string) {
    const text = question ?? mainQuestion;

    if (!text.trim()) return;

    setFormulaFromQuestion(text);
    addMessage("user", text);
    setMainQuestion("");

    const thinkingId = Date.now() + Math.random();
    setChatMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        sender: "assistant",
        text: "Düşünüyorum...",
      },
    ]);

    try {
      const res = await fetch("/api/incilab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          sector: selectedSector,
          formula: formula.title,
          market,
        }),
      });

      const data = await res.json();

      setChatMessages((prev) => {
        const withoutThinking = prev.filter((msg) => msg.id !== thinkingId);

        return [
          ...withoutThinking,
          {
            id: Date.now() + Math.random(),
            sender: "assistant",
            text:
              data?.answer ||
              localClientFallback(text),
          },
        ];
      });
    } catch {
      const fallback = localClientFallback(text);

      setChatMessages((prev) => {
        const withoutThinking = prev.filter((msg) => msg.id !== thinkingId);

        return [
          ...withoutThinking,
          {
            id: Date.now() + Math.random(),
            sender: "assistant",
            text: fallback,
          },
        ];
      });
    }
  }

  function handleAnalysis() {
    if (!analysisText.trim()) return;
    handleSend(analysisText);
    setAnalysisText("");
  }

  function handleInciSearch(value?: string) {
    const searchValue = value ?? inciSearch;
    const q = normalizeText(searchValue);

    let result =
      `${searchValue}; ürün tipine göre fonksiyon, çözünürlük, kullanım oranı, pH uyumu, stabilite ve mevzuat açısından değerlendirilmelidir.`;

    if (q.includes("niacinamide") || q.includes("niasinamid")) {
      result =
        "Niacinamide / Niasinamid genelde %2-5 aralığında kullanılır. Hassas ciltlerde %2-4 daha konforlu olur. Bazı serumlarda %10'a kadar çıkılabilir ama tolerans ve stabilite testi gerekir.";
    }

    if (q.includes("panthenol") || q.includes("pantenol")) {
      result =
        "Panthenol / Pantenol genelde %0.5-5 aralığında kullanılır. Nem ve yatıştırıcı etki için %1-2 çok iyi çalışır.";
    }

    if (q.includes("hyaluron") || q.includes("sodium hyaluronate")) {
      result =
        "Sodium Hyaluronate genelde %0.05-0.5 aralığında kullanılır. Serumlarda %0.1-0.3 çoğu zaman yeterlidir.";
    }

    setInciSearch(searchValue);
    setInciResult(result);
    addMessage("assistant", `INCI sorgusu sonucu: ${result}`);
  }

  function handleSectorClick(sector: SectorKey) {
    setSelectedSector(sector);
    addMessage("assistant", sectorInfo[sector]);
    scrollTo("sector-area");
  }

  function handleMenuClick(item: string) {
    setActiveMenu(item);

    const actions: Record<string, () => void> = {
      "Ana Sayfa": () => scrollTo("hero-panel"),
      Sohbet: () => scrollTo("chat-panel"),
      "INCI Sorgula": () => scrollTo("inci-card"),
      "Formül Oluştur": () => scrollTo("formula-panel"),
      "Analiz Sonuçları": () => scrollTo("chat-panel"),
      "Trend Bileşenler": () => scrollTo("trend-card"),
      "Endüstriyel Sektörler": () => scrollTo("sector-area"),
      Kütüphane: () =>
        addMessage("assistant", "Kütüphane açıldı. Kayıtlı formüller, INCI notları ve mevzuat özetleri burada listelenebilir."),
      Favoriler: () =>
        addMessage("assistant", "Favoriler açıldı. Kaydettiğin formüller ve bileşenler burada görünecek."),
      Ayarlar: () =>
        addMessage("assistant", "Ayarlar açıldı. Tema, asistan modu, PDF ayarı ve çıktı dili buradan yönetilebilir."),
    };

    actions[item]?.();
  }

  function handleQuickAction(action: string) {
    const map: Record<string, string> = {
      "Bileşen Analizi": "Niacinamide ve Panthenol için bileşen analizi yap.",
      "Stabilite Tahmini": "Bu formül için stabilite tahmini yap.",
      "Uyumluluk Kontrolü": "Aktifler ve koruyucu sistem uyumlu mu kontrol et.",
      "Mevzuat Kontrolü": "Bu formülü Avrupa Birliği mevzuatına göre kontrol et.",
      "Formül Optimizasyonu": "Bu formülü hassas cilt için optimize et.",
      "Fresh Parfüm": "Fresh koku içerikli parfüm yapmak istiyorum. Esans yapımından itibaren tek tek detaylı anlat.",
    };

    handleSend(map[action] || action);
  }

  function selectFormula(key: FormulaKey) {
    setFormulaKey(key);

    if (key === "perfume") {
      setSelectedSector("Parfüm & Koku");
    }

    addMessage("assistant", `${formulas[key].title} seçildi. Fazlar, gramajlar ve hazırlama yöntemi sağ panelde güncellendi.`);
    scrollTo("formula-panel");
  }

  function selectAmount(amount: number) {
    setTargetAmount(amount);
    addMessage("assistant", `Hedef miktar ${amount === 1000 ? "1 L" : amount + " ml"} olarak güncellendi. Sağ panelde gramajlar otomatik hesaplandı.`);
  }

  function selectPhase(phaseKey: string) {
    setSelectedPhase(phaseKey);
    const phase = formula.phases.find((p) => p.key === phaseKey);
    addMessage("assistant", `Faz ${phaseKey} seçildi: ${phase?.name}. İçerikleri sağ panelde görüntüleniyor.`);
  }

  function handleTrendClick(name: string) {
    setInciSearch(name);
    handleInciSearch(name);
    addMessage("assistant", `${name} trend bileşeni seçildi. Formül uyumu ve kullanım amacı incelenebilir.`);
  }

  function handleMarketChange(value: string) {
    setMarket(value);
    addMessage("assistant", `${value} pazarı seçildi. Mevzuat kontrolü bu hedef pazara göre değerlendirilecek.`);
  }

  function downloadPdf() {
    const oldTitle = document.title;
    document.title = `InciLab - ${formula.title}`;
    setShowMethod(true);
    addMessage("assistant", "PDF çıktısı hazırlanıyor. Açılan yazdırma penceresinden PDF olarak kaydedebilirsin.");

    setTimeout(() => {
      window.print();
      document.title = oldTitle;
    }, 200);
  }

  function saveFormula() {
    const report = [
      "İNCİLAB FORMÜL RAPORU",
      "",
      `Formül: ${formula.title}`,
      `Ürün Tipi: ${formula.productType}`,
      `Hedef Miktar: ${targetAmount} ml / g`,
      `Toplam Yüzde: ${totalPercent.toFixed(2)}%`,
      `pH: ${formula.ph}`,
      `Viskozite: ${formula.viscosity}`,
      `Görünüm: ${formula.appearance}`,
      `Koku: ${formula.scent}`,
      `Hissiyat: ${formula.skinFeel}`,
      "",
      "İÇERİK LİSTESİ",
      ...allItems.map(
        (i) =>
          `Faz ${i.phaseKey} - ${i.name} (${i.inci}) | %${i.percent} | ${scaledAmount(i.percent).toFixed(2)} g | ${i.functionName}`
      ),
      "",
      "NASIL YAPILIR?",
      ...formula.method.map((m, index) => `${index + 1}. ${m}`),
      "",
      "AR-GE NOTU",
      "Stabilite, mikrobiyoloji, challenge test, IFRA/mevzuat kontrolü ve ambalaj uyumluluğu yapılmadan ürün piyasaya sunulmamalıdır.",
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "incilab-formul-raporu.txt";
    a.click();

    URL.revokeObjectURL(url);
    addMessage("assistant", "Formül raporu TXT olarak indirildi. PDF için PDF İndir butonunu kullanabilirsin.");
  }

  function clearChat() {
    setChatMessages([
      {
        id: Date.now(),
        sender: "assistant",
        text: "Sohbet temizlendi. Yeni bir formül, INCI, parfüm, mevzuat veya stabilite sorusu sorabilirsin.",
      },
    ]);
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
              onClick={() => handleMenuClick(item)}
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
            <button onClick={() => addMessage("assistant", "Pro Plan bilgisi açıldı. Daha fazla sorgu, PDF çıktısı ve gelişmiş analiz modları eklenebilir.")}>
              Pro Plan
            </button>
            <button onClick={() => addMessage("assistant", "Plan yükseltme ekranı için ödeme/üyelik modülü bağlanabilir.")}>
              Planı Yükselt →
            </button>
          </div>
        </div>

        <div className="profileCard">
          <div className="avatar">MB</div>
          <div>
            <strong>Merve Bekdemir</strong>
            <span>InciLab Admin</span>
          </div>
          <button onClick={() => addMessage("assistant", "Profil menüsü açıldı. Kullanıcı bilgileri, şirket adı ve çalışma alanı burada düzenlenebilir.")}>
            ⌄
          </button>
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
            <h1>Merhaba, Merve 👋</h1>
            <p>InciLab AI Asistan; formülasyon, analiz, parfüm, INCI ve mevzuat araştırmalarında yanında.</p>
          </div>

          <div className="topActions">
            <button onClick={() => addMessage("assistant", "Bildirimler: Formül raporu, mevzuat uyarısı ve trend bileşen güncellemeleri burada listelenebilir.")}>
              🔔
            </button>
            <button onClick={() => addMessage("assistant", "Parlak pastel laboratuvar teması aktif. Renkler açık pembe, bebe mavisi, lila, açık sarı ve en açık yeşil tonlarında.")}>
              ✦
            </button>
            <button onClick={() => addMessage("assistant", "Yardım: Soru kutusuna doğal şekilde yaz. İnciLab niyetini anlamaya çalışır; tek kalıba bağlı değildir.")}>
              ?
            </button>
            <button
              className="assistantMode"
              onClick={() => {
                setAssistantMode((v) => !v);
                addMessage("assistant", `Asistan modu ${assistantMode ? "kapatıldı" : "açıldı"}.`);
              }}
            >
              Asistan Modu <span className={assistantMode ? "on" : "off"} />
            </button>
          </div>
        </header>

        <section className="layout">
          <div className="center">
            <section id="hero-panel" className="heroPanel">
              <div className="orb" />
              <div className="heroContent">
                <h2>Bugün nasıl yardımcı olabilirim?</h2>
                <p>Soruyu dağınık yazsan bile niyeti anlayıp detaylı cevap üretmeye çalışırım.</p>

                <div className="mainInput">
                  <input
                    value={mainQuestion}
                    onChange={(e) => setMainQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Örn. fresh kokulu parfüm yapmak istiyorum, esansı nasıl yapacağım?"
                  />
                  <button onClick={() => handleSend()}>→</button>
                </div>

                <div className="quickPills">
                  {[
                    "Bileşen Analizi",
                    "Stabilite Tahmini",
                    "Uyumluluk Kontrolü",
                    "Mevzuat Kontrolü",
                    "Formül Optimizasyonu",
                    "Fresh Parfüm",
                  ].map((pill) => (
                    <button key={pill} onClick={() => handleQuickAction(pill)}>
                      {pill}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section id="chat-panel" className="chatPanel">
              <div className="chatHead">
                <h3>InciLab Sohbet</h3>
                <button onClick={clearChat}>Sohbeti Temizle</button>
              </div>

              <div className="messages">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={msg.sender === "user" ? "msg user" : "msg assistant"}
                  >
                    <strong>{msg.sender === "user" ? "Sen" : "InciLab"}</strong>
                    <p>{msg.text}</p>
                  </div>
                ))}
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

            <section className="formulaTypeRow no-print">
              <button onClick={() => selectFormula("serum")} className={formulaKey === "serum" ? "selectedFormula" : ""}>
                Nemlendirici Serum
              </button>
              <button onClick={() => selectFormula("cleanser")} className={formulaKey === "cleanser" ? "selectedFormula" : ""}>
                Yüz Temizleme Jeli
              </button>
              <button onClick={() => selectFormula("cream")} className={formulaKey === "cream" ? "selectedFormula" : ""}>
                Bariyer Krem
              </button>
              <button onClick={() => selectFormula("perfume")} className={formulaKey === "perfume" ? "selectedFormula" : ""}>
                Fresh Parfüm
              </button>
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
                  <button onClick={() => handleInciSearch()}>⌕</button>
                </div>
                <div className="resultText">{inciResult}</div>
                <ul className="lastSearches">
                  {["Niacinamide", "Sodium Hyaluronate", "Panthenol"].map((item) => (
                    <li key={item} onClick={() => handleInciSearch(item)}>
                      {item} <span>Sorgula</span>
                    </li>
                  ))}
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
                <select value={market} onChange={(e) => handleMarketChange(e.target.value)}>
                  <option>Avrupa Birliği (EU)</option>
                  <option>Türkiye</option>
                  <option>ABD</option>
                  <option>Birleşik Krallık</option>
                  <option>Japonya</option>
                </select>
                <div className="checkList">
                  <p>✓ İçerik listesi kontrol edilir</p>
                  <p>✓ Yasaklı/kısıtlı bileşen kontrol edilir</p>
                  <p>✓ Alerjen ve etiket beyanı değerlendirilir</p>
                  <p>✓ Ürün tipi ve hedef pazar dikkate alınır</p>
                </div>
                <button className="linkBtn" onClick={() => handleSend(`${market} mevzuat kontrolü yap`)}>
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
                    <button key={trend.name} onClick={() => handleTrendClick(trend.name)}>
                      <span>{index + 1}</span>
                      <b>{trend.name}</b>
                      <i>{trend.rate}</i>
                    </button>
                  ))}
                </div>
              </article>
            </section>

            <section className="methodWide">
              <div className="methodHead">
                <div>
                  <h3>Nasıl Yapılır? Hazırlama Aşamaları</h3>
                  <p>Seçili formülün laboratuvar ölçekli üretim adımlarını faz faz gösterir.</p>
                </div>
                <button onClick={() => setShowMethod((v) => !v)}>
                  {showMethod ? "Gizle" : "Göster"}
                </button>
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
              <p>Spesifik bir analiz talebini yaz; cevap direkt sohbet alanına düşer.</p>
              <div className="analysisInput">
                <input
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAnalysis();
                  }}
                  placeholder="Örn. Niasinamid formüllerde en çok kaç kullanılabilir?"
                />
                <button onClick={handleAnalysis}>✧ Analiz Başlat</button>
              </div>
              <div className="analysisLinks">
                <button onClick={() => setAnalysisText("Fresh kokulu parfüm yapmak istiyorum, esans yapımından itibaren anlat.")}>
                  🌸 Parfüm Sorusu
                </button>
                <button onClick={() => setAnalysisText("Niasinamid formüllerde en çok kaç kullanılabilir?")}>
                  ⚙ İçerik Uyumu
                </button>
                <button onClick={() => setAnalysisText("Mevzuat kontrolü yap")}>
                  🛡 Mevzuat
                </button>
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
                <input value={formula.title} readOnly />
                <button
                  onClick={() =>
                    selectFormula(
                      formulaKey === "serum"
                        ? "cleanser"
                        : formulaKey === "cleanser"
                        ? "cream"
                        : formulaKey === "cream"
                        ? "perfume"
                        : "serum"
                    )
                  }
                >
                  ✎
                </button>
              </div>

              <label>Fazlar</label>
              <div className="phaseButtons">
                {formula.phases.map((phase) => (
                  <button
                    key={phase.key}
                    onClick={() => selectPhase(phase.key)}
                    className={selectedPhase === phase.key ? "phaseActive" : ""}
                  >
                    <b>Faz {phase.key}</b>
                    <span>% {phase.percent.toFixed(2).replace(".", ",")}</span>
                  </button>
                ))}
              </div>

              <label>Hedef Miktar</label>
              <div className="amountButtons">
                {[10, 30, 50, 100, 250, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    className={targetAmount === amount ? "active" : ""}
                    onClick={() => selectAmount(amount)}
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
                    Hedef Miktar: <b>{targetAmount} ml/g</b> · Toplam:{" "}
                    <b>{targetAmount.toFixed(2).replace(".", ",")}</b> · Toplam %:{" "}
                    <b>{totalPercent.toFixed(2).replace(".", ",")}%</b>
                  </p>
                </div>
                <span>Uyumlu</span>
              </div>

              <div className="phaseResultList">
                {formula.phases.map((phase) => (
                  <article
                    key={phase.key}
                    className={selectedPhase === phase.key ? "resultActive" : ""}
                  >
                    <div className="phaseResultHead">
                      <h3>
                        Faz {phase.key} <small>({phase.name})</small>
                      </h3>
                      <strong>
                        % {phase.percent.toFixed(2).replace(".", ",")}
                        <br />
                        <small>{scaledAmount(phase.percent).toFixed(2).replace(".", ",")} g/ml</small>
                      </strong>
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th>İçerik Adı</th>
                          <th>%</th>
                          <th>Miktar</th>
                          <th>Fonksiyon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phase.items.map((item) => (
                          <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.percent.toFixed(2).replace(".", ",")}</td>
                            <td>{scaledAmount(item.percent).toFixed(2).replace(".", ",")} g/ml</td>
                            <td>{item.functionName}</td>
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
                  <p><b>Tip:</b> {formula.productType}</p>
                </div>
              </div>

              <div className="pdfButtons no-print">
                <button onClick={saveFormula}>Formülü Kaydet</button>
                <button onClick={downloadPdf}>▣ PDF İndir</button>
              </div>
              <p className="pdfNote">
                Rapor, içerik listesi, hazırlama yöntemi ve mevzuat/güvenlik notu dahildir.
              </p>
            </section>
          </aside>
        </section>
      </section>

      <style>{`
        * { box-sizing: border-box; }

        :root {
          --ink: #16213f;
          --muted: #73809d;
          --line: rgba(255, 255, 255, 0.72);
          --pink: #ff9bd6;
          --lila: #b79cff;
          --blue: #a7dfff;
          --mint: #a9f7de;
          --yellow: #fff1a8;
          --violet: #7b61ff;
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

        button, input, select { font: inherit; }
        button { cursor: pointer; }

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
        .chatPanel,
        .methodWide,
        .formulaTypeRow {
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
          background: linear-gradient(100deg, #8d7cff, #d997ff 44%, #ff9bd6 100%);
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

        .usageCard { margin-top: 22px; }

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

        .assistantMode span.off { background: #ff9ba8; }

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
          background: linear-gradient(135deg, var(--pink), var(--lila) 48%, var(--blue));
          box-shadow: 0 18px 34px rgba(183,156,255,.28);
        }

        .mainInput button {
          width: 58px;
          height: 58px;
          border-radius: 22px;
          font-size: 30px;
        }

        .quickPills,
        .sectorButtons,
        .analysisLinks,
        .amountButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .quickPills { margin-top: 18px; }

        .quickPills button,
        .amountButtons button,
        .sectorButtons button,
        .analysisLinks button,
        .formulaTypeRow button {
          border: 1px solid rgba(255,255,255,.8);
          background: rgba(255,255,255,.56);
          color: #405070;
          border-radius: 999px;
          padding: 12px 20px;
          font-weight: 700;
          box-shadow: 0 10px 24px rgba(115,103,180,.06);
        }

        .chatPanel {
          border-radius: 28px;
          padding: 18px;
        }

        .chatHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .chatHead h3 { margin: 0; }

        .chatHead button {
          border: 0;
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255,255,255,.55);
          color: #7b61ff;
          font-weight: 800;
        }

        .messages {
          display: grid;
          gap: 10px;
          max-height: 320px;
          overflow: auto;
          padding-right: 6px;
        }

        .msg {
          border-radius: 18px;
          padding: 12px 14px;
          max-width: 88%;
          background: rgba(255,255,255,.62);
          border: 1px solid rgba(255,255,255,.8);
        }

        .msg.user {
          margin-left: auto;
          background: linear-gradient(135deg, rgba(255,155,214,.25), rgba(167,223,255,.28));
        }

        .msg strong {
          display: block;
          font-size: 12px;
          color: #7b61ff;
          margin-bottom: 4px;
        }

        .msg p {
          margin: 0;
          color: #405070;
          line-height: 1.55;
          white-space: pre-wrap;
        }

        .sectorArea { padding: 0 10px; }

        .sectorArea p {
          margin: 0 0 10px;
          color: #51617f;
        }

        .sectorButtons button {
          border-radius: 17px;
          min-width: 142px;
        }

        .sectorButtons button.selected,
        .formulaTypeRow button.selectedFormula {
          color: #6f54e9;
          background: linear-gradient(135deg, rgba(255,255,255,.72), rgba(255,155,214,.20), rgba(167,223,255,.20));
          box-shadow: 0 14px 30px rgba(123,97,255,.13);
        }

        .sectorButtons span { margin-right: 9px; }

        .sectorArea small {
          display: block;
          margin-top: 13px;
          color: #73809d;
        }

        .formulaTypeRow {
          border-radius: 24px;
          padding: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
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
          cursor: pointer;
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

        .methodWide li p { margin: 5px 0 0; }

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

        .analysisLinks { margin-top: 13px; }

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

        .rightPanel::-webkit-scrollbar { width: 8px; }
        .rightPanel::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(183,156,255,.35);
        }

        .formulaCreate,
        .formulaResult {
          border-radius: 30px;
          padding: 24px;
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

        .phaseButtons button.phaseActive {
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

        .resultHead h2 { font-size: 20px; }

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

        .phaseResultList article.resultActive {
          border-color: rgba(183,156,255,.85);
          box-shadow: 0 0 0 3px rgba(183,156,255,.13);
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

        .phaseResultHead small { color: #66718e; }

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

        .summaryBox h3 { margin: 0 0 10px; }

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
          .page { grid-template-columns: 1fr; }
          .sidebar {
            position: relative;
            height: auto;
          }
          .layout { grid-template-columns: 1fr; }
          .rightPanel {
            position: relative;
            height: auto;
          }
          .infoGrid { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .page { padding: 10px; }
          .heroPanel { grid-template-columns: 1fr; }
          .topBar { flex-direction: column; }
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
          body { background: white; }

          .no-print,
          .sidebar,
          .topBar,
          .heroPanel,
          .sectorArea,
          .infoGrid,
          .analysisPanel,
          .formulaCreate,
          .chatPanel,
          .formulaTypeRow {
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

          .methodWide { margin-top: 20px; }

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
    "Parfüm & Koku": "🌸",
  };

  return icons[sector];
}
