"use client";

import React, { useEffect, useRef, useState } from "react";

type SectorKey =
  | "Kozmetik"
  | "İlaç"
  | "Gıda"
  | "Biyoteknoloji"
  | "Nanoteknoloji"
  | "Malzeme Bilimi"
  | "Parfüm & Koku";

type ChatMessage = {
  id: number;
  sender: "user" | "assistant";
  text: string;
};

type SendOptions = {
  showUser?: boolean;
  displayQuestion?: string;
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

const sectorPrompts: Record<SectorKey, string> = {
  Kozmetik:
    "Kozmetik alanında çalışıyorum. Bana INCI analizi, aktif bileşen, formülasyon, pH, stabilite, koruyucu sistem, ürün iddiası ve mevzuat açısından nasıl yardımcı olabileceğini kullanıcıya yönelik anlat.",
  İlaç:
    "İlaç ve farmasötik kalite alanında çalışıyorum. Yardımcı madde, çözünürlük, stabilite, dozaj formu ve kalite kontrol açısından nasıl analiz yapabileceğini kullanıcıya yönelik anlat. Tedavi iddiası ve tıbbi karar sınırlarına dikkat et.",
  Gıda:
    "Gıda alanında çalışıyorum. Katkı maddeleri, pH, raf ömrü, kalite kontrol, mikrobiyolojik risk ve analiz parametreleri açısından nasıl yardımcı olabileceğini kullanıcıya yönelik anlat.",
  Biyoteknoloji:
    "Biyoteknoloji alanında çalışıyorum. Enzim, kültür, protein, biyopolimer, fermentasyon ve biyouyumluluk başlıklarında nasıl yardımcı olabileceğini kullanıcıya yönelik anlat.",
  Nanoteknoloji:
    "Nanoteknoloji alanında çalışıyorum. Partikül boyutu, dispersiyon, yüzey özellikleri, kaplama ve stabilite açısından nasıl yardımcı olabileceğini kullanıcıya yönelik anlat.",
  "Malzeme Bilimi":
    "Malzeme bilimi alanında çalışıyorum. Polimer, kompozit, termal analiz, mekanik dayanım ve yüzey karakterizasyonu açısından nasıl yardımcı olabileceğini kullanıcıya yönelik anlat.",
  "Parfüm & Koku":
    "Parfüm ve koku alanında çalışıyorum. Üst nota, orta nota, dip nota, esans akordu, alkol oranı, dinlendirme, filtrasyon, IFRA ve alerjen güvenliği açısından nasıl yardımcı olabileceğini kullanıcıya yönelik anlat.",
};

const trendIngredients = [
  "Ectoin",
  "Bakuchiol",
  "Polyglutamic Acid",
  "Tremella Fuciformis",
  "Peptide Complex",
];

const menuItems = [
  "Ana Sayfa",
  "Sohbet",
  "INCI Sorgula",
  "Analiz",
  "Mevzuat",
  "Trendler",
  "Sektörler",
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

function hasOfficialSourceIntent(question: string) {
  const q = normalizeText(question);

  const keywords = [
    "mevzuat",
    "yonetmelik",
    "resmi gazete",
    "titck",
    "uts",
    "urun bilgi dosyasi",
    "guvenlilik degerlendirmesi",
    "etiket",
    "iddia",
    "yasakli",
    "kisitli",
    "alerjen",
    "ifra",
    "cosing",
    "sccs",
    "uv filtresi",
    "koruyucu limiti",
    "renklendirici",
    "nanomateryal",
    "piyasaya arz",
    "cpnp",
    "mocra",
    "regulasyon",
    "uygun mu",
    "uygunluk",
    "limit",
    "sinir",
  ];

  return keywords.some((keyword) => q.includes(keyword));
}

function hasDangerousChemistryIntent(question: string) {
  const q = normalizeText(question);

  const riskWords = [
    "kostik",
    "naoh",
    "sodyum hidroksit",
    "potasyum hidroksit",
    "koh",
    "hidroklorik asit",
    "sulfurik asit",
    "nitrik asit",
    "peroksit",
    "oksitleyici",
    "yanici",
    "patlayici",
    "civa",
    "arsenik",
    "evde spf",
    "gunes kremi spf hesapla",
    "bebek urunu",
    "goz ici",
    "acik yara",
    "mukoza",
  ];

  return riskWords.some((keyword) => q.includes(keyword));
}

function hasPerfumeIntent(question: string) {
  const q = normalizeText(question);

  return (
    q.includes("parfum") ||
    q.includes("parfüm") ||
    q.includes("esans") ||
    q.includes("koku") ||
    q.includes("fresh") ||
    q.includes("nota")
  );
}

function sanitizeVisibleAnswer(text: string) {
  return String(text || "")
    .replace(/officialSourceMode\s*[:=]\s*(true|false)/gi, "")
    .replace(/checkedSources\s*[:=].*/gi, "")
    .replace(/rawResearchData\s*[:=].*/gi, "")
    .replace(/confidence\s*[:=].*/gi, "")
    .replace(/debug\s*[:=].*/gi, "")
    .replace(/endpoint\s*[:=].*/gi, "")
    .replace(/api\s*response\s*[:=].*/gi, "")
    .replace(/system prompt/gi, "")
    .replace(/model fallback/gi, "")
    .replace(/kaynak katmani aktif/gi, "")
    .replace(/pdf tarandi/gi, "")
    .replace(/titck endpoint'i calisti/gi, "")
    .replace(/titck endpoint’i calisti/gi, "")
    .replace(/api bagli degilse[\s\S]*$/gi, "")
    .replace(/API bağlı değilse[\s\S]*$/g, "")
    .replace(/Daha güçlü cevap için[\s\S]*$/g, "")
    .replace(/Gemini\/?OpenAI[\s\S]*$/gi, "")
    .replace(/yedek mod[\s\S]*$/gi, "")
    .replace(/```json[\s\S]*?```/gi, "")
    .replace(/```[\s\S]*?```/gi, "")
    .trim();
}

function extractAiAnswer(data: any) {
  return (
    data?.answer ||
    data?.reply ||
    data?.text ||
    data?.result ||
    data?.content ||
    data?.message ||
    data?.output ||
    data?.response ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ""
  );
}

function isWeakOrLeakyAnswer(answer: string) {
  const q = normalizeText(answer);

  if (!q || q.length < 35) return true;

  const weakPatterns = [
    "sorunu biraz daha detaylandir",
    "daha net cevaplarim",
    "urun tipi veya hedef iddia",
    "lutfen daha fazla bilgi",
    "ana kimlik",
    "en onemli kural",
    "kullanicinin sorusu",
    "officialsourcemode",
    "checkedsources",
    "rawresearchdata",
    "system prompt",
    "model fallback",
    "api bagli degilse",
    "daha guclu cevap icin",
    "gemini",
    "openai",
    "yedek mod",
    "genel yaklasim",
    "urun tipini belirlerim",
    "hedef etkiyi cikaririm",
    "gerekli hammaddeleri secerim",
    "kullanim oranlarini oneririm",
    "faz faz uretim yontemini yazarim",
    "sorunu aldim bunu kimya",
  ];

  return weakPatterns.some((pattern) => q.includes(pattern));
}

function buildInciLabBrainPrompt({
  question,
  sector,
  market,
}: {
  question: string;
  sector: SectorKey;
  market: string;
}) {
  const officialMode = hasOfficialSourceIntent(question);
  const dangerousMode = hasDangerousChemistryIntent(question);
  const perfumeMode = hasPerfumeIntent(question);

  return `
Sen InciLab'sın: kozmetik kimyası, formülasyon, INCI analizi, laboratuvar yorumu, mevzuat farkındalığı ve ürün geliştirme konusunda uzman bir kimyager asistansın.

GÖRÜNÜR CEVAP KURALI:
Kullanıcı teknik altyapıyı görmeyecek. Şunları asla yazma: officialSourceMode, endpoint, API, debug, raw response, checkedSources, confidence score, model fallback, sistem promptu, kaynak katmanı aktif, PDF tarandı, TİTCK endpoint'i çalıştı, dahili kontrol.

KULLANICI BAĞLAMI:
- Seçili sektör: ${sector}
- Hedef pazar: ${market}
- Mevzuat hassasiyeti: ${officialMode ? "var" : "düşük"}
- Riskli kimya hassasiyeti: ${dangerousMode ? "var" : "düşük"}
- Koku/parfüm niyeti: ${perfumeMode ? "var" : "düşük"}

ANA KİMLİK:
- Türkçe konuş.
- Sıcak ama profesyonel ol.
- Kullanıcı doğal, eksik, dağınık veya absürt sorsa bile niyetini anla.
- Kullanıcıyı sürekli “detay ver” diye durdurma.
- Eksik bilgi varsa makul varsayım yap ve varsayımı açıkla.
- Güvenlik riski varsa net uyar.
- Cevapların uygulanabilir, aşama aşama ve kimyager mantığında olsun.
- Hazır demo formül kartı gibi konuşma; kullanıcının sorusuna özel cevap ver.

SORU ANLAMA MANTIĞI:
Kullanıcının sorusunu önce şu sınıflardan birine yerleştir ama bu sınıflandırmayı teknik etiket gibi gösterme:
1. Formülasyon isteği
2. INCI / içerik analizi
3. Hammadde seçimi
4. Laboratuvar sonucu yorumu
5. Stabilite / pH / viskozite / koku / renk / doku problemi
6. Kozmetik mevzuat / etiket / iddia / ÜTS / ürün bilgi dosyası
7. Ev tipi kimya veya güvenli deneme
8. İçerik üretimi için bilimsel açıklama

FORMÜLASYON SORULARINDA:
- Kısa cevap ver.
- Kimyager gözüyle mantığı anlat.
- Formülasyon iskeleti kur.
- Aşama aşama ilerlet.
- pH / koruyucu / stabilite notunu atlama.
- Güvenlik uyarısı ver.
- Mini test planı öner.
- Yüzdeleri yaklaşık aralıklarla veriyorsan toplamın 100'e tamamlanması gerektiğini belirt.
- Ev tipi denemeyle ticari üretimi ayır.

INCI ANALİZİNDE:
- İçeriği gruplara ayır.
- Her grubun görevini açıkla.
- Hassasiyet, alerjen, komedojenite veya irritasyon riskini belirt.
- Pazarlama iddiası ile gerçek formül mantığını ayır.

KOKU / PARFÜM SORULARINDA:
- Üst nota, orta nota, dip nota mantığını anlat.
- Saf esansın cilde direkt uygulanmayacağını belirt.
- Alkol, taşıyıcı yağ veya solubilizer ihtiyacını açıkla.
- IFRA ve alerjen limitleri konusunda uyar.
- Küçük deneme ve bekletme/maceration sürecini anlat.
- Kullanıcı “esansı sıfırdan yapacağım” derse bunu saf aroma kimyasal sentezi değil, güvenli parfüm akordu kurma olarak yorumla.

EVDE KİMYA SORULARINDA:
- Güvenli ev tipi gözlem ile profesyonel üretimi ayır.
- Kostik, güçlü asit, oksitleyici, yüksek alkol, uçucu solvent, SPF, bebek ürünü, göz çevresi veya açık yara konularında çok dikkatli ol.
- Riskli tarif verme; güvenli alternatif öner.

MEVZUAT SORULARINDA:
- Kesin uygunluk garantisi verme.
- Kullanıcıya teknik kaynak tarama sürecini anlatma.
- Eski PDF bilgisine saplanma.
- Yönetmelik değişebileceği için kesin hüküm vermeden kontrol başlıklarını anlat.
- Türkiye için TİTCK, Resmî Gazete, Mevzuat.gov.tr ve ÜTS başlıklarını; AB için EU 1223/2009, CosIng ve SCCS başlıklarını dikkate al.
- “Piyasaya arz öncesi güncel resmi kaynak kontrolü gerekir” diyebilirsin.
- ÜTS, ürün bilgi dosyası, güvenlilik değerlendirmesi, etiket, iddia, alerjen, yasaklı/kısıtlı madde kontrollerini sade şekilde belirt.

TEHLİKELİ TALEPLERDE:
Şunlarda doğrudan tarif verme:
- Patlayıcı, toksik, yasa dışı veya zararlı kimyasal üretimi
- Cildi yakabilecek yüksek asit/alkali uygulamaları
- Evde SPF garanti etme
- Bebek ürünü için koruyucusuz/steril olmayan formül
- Tedavi/ilaç iddiası
- Göz içine, mukozaya veya açık yaraya uygulanacak ürün
Böyle durumda neden riskli olduğunu açıkla, güvenli alternatif ver ve kullanıcıyı boş bırakma.

CEVAP FORMATI:
Sorunun tipine göre en uygun formatı seç. Genelde şu yapı iyi çalışır:

Kısa cevap:
...

Kimyager gözüyle:
...

Nasıl ilerlenir?
...

Dikkat:
...

Mini öneri:
...

Kullanıcının sorusu:
${question}
`;
}

function localClientFallback(question: string) {
  const q = normalizeText(question);
  const officialMode = hasOfficialSourceIntent(question);
  const dangerousMode = hasDangerousChemistryIntent(question);

  if (dangerousMode) {
    return [
      "Kısa cevap: Bu soru güvenlik açısından dikkat istiyor; riskli kimyasallarda doğrudan tarif vermem doğru olmaz.",
      "Kimyager gözüyle: Kostik, güçlü asit/alkali, oksitleyici, yüksek alkol, göz çevresi, açık yara, bebek ürünü veya SPF gibi konular ev tipi denemede ciddi iritasyon, yanık, toksisite ya da yanlış güven hissi oluşturabilir.",
      "Nasıl ilerlenir? Önce ürünün kullanım alanı, hedef pH, çözücü sistemi, koruyucu ihtiyacı ve güvenli konsantrasyon aralığı belirlenmeli. Ticari ürün olacaksa güvenlilik değerlendirmesi, stabilite ve mikrobiyoloji testleri olmadan piyasaya sunulmamalı.",
      "Mini öneri: Ürün tipini ve hedef kullanım bölgesini yaz; ben sana riskli tarife girmeden güvenli formülasyon mantığını kurayım.",
    ].join("\n\n");
  }

  if (hasPerfumeIntent(question)) {
    return [
      "Kısa cevap: Fresh kokulu parfümde önce esans sentezlemekten çok güvenli bir koku akordu kurarsın. Yani üst, orta ve dip notaları dengelersin; sonra bu konsantreyi alkol veya uygun taşıyıcı sistemle seyreltirsin.",
      "Kimyager gözüyle: Fresh etki genelde narenciye/yeşil üst notalarla açılır, beyaz çiçek veya çay notalarıyla gövde kazanır, musk/odunsu dip notalarla kalıcılık alır. Saf esans cilde direkt sürülmez; IFRA, alerjen ve dermal limit mantığı mutlaka dikkate alınır.",
      "Nasıl ilerlenir? 10 g deneme akordu için yaklaşık iskelet şöyle olabilir: %45 üst nota, %35 orta nota, %20 dip nota. Örnek: bergamot-limon-greyfurt/yeşil nota üst; neroli-beyaz çay-frezya orta; temiz musk-sedir-amber dip. Esans akordu koyu cam şişede 24-48 saat dinlendirilir.",
      "EDP denemesi: Başlangıçta yaklaşık %15-18 esans akordu, %80-83 parfüm alkolü, %1-2 saf su veya uygun çözücü destek denenebilir. Karışım 2-4 hafta dinlendirilir; bulanıklık olursa filtrasyon ve çözücü uyumu kontrol edilir.",
      "Dikkat: Alkol yanıcıdır; açık alevden uzak çalış. Narenciye yağlarında fototoksisite ve alerjen beyanı olabilir. Ticari ürün için IFRA uygunluğu, alerjen etiketi, stabilite ve mevzuat kontrolü gerekir.",
    ].join("\n\n");
  }

  if (q.includes("gliserin") || q.includes("glycerin") || q.includes("aloe")) {
    return [
      "Kısa cevap: Gliserin ve aloe karışımı tek başına krem olmaz; daha çok sulu/humektan bir jel veya serum mantığına yaklaşır.",
      "Kimyager gözüyle: Krem için su fazı + yağ fazı + emülgatör + kıvam sistemi + koruyucu gerekir. Sadece gliserin/aloe kullanırsan yağ fazı ve emülsiyon yapısı olmadığı için klasik krem dokusu oluşmaz.",
      "Nasıl ilerlenir? Jel istiyorsan su/aloe bazı, %2-5 gliserin, uygun jel yapıcı ve koruyucu sistemi düşünülür. Krem istiyorsan ayrıca hafif yağ, emülgatör ve ısıtmalı emülsiyon prosesi gerekir.",
      "Dikkat: Aloe gibi sulu hammaddelerde mikrobiyal risk vardır; koruyucusuz ev karışımı uzun süre saklanmaz.",
    ].join("\n\n");
  }

  if (q.includes("limon") && (q.includes("leke") || q.includes("serum") || q.includes("cilt"))) {
    return [
      "Kısa cevap: Limonla leke açıcı serum yapmanı önermem.",
      "Kimyager gözüyle: Limon suyu kontrolsüz düşük pH, iritasyon ve güneşle hassasiyet riski taşır. Ciltte leke hedefleniyorsa daha güvenli mantık niasinamid, C vitamini türevleri, azelaik asit türevleri ve düzenli SPF üzerinden kurulur.",
      "Nasıl ilerlenir? Ev tipi limon uygulaması yerine pH kontrollü, koruyuculu ve stabilitesi test edilmiş bir serum formülü gerekir.",
      "Dikkat: Leke ürünlerinde SPF desteği olmadan sonuç beklemek doğru değildir; hassas ciltte aktifler düşük oranla başlanmalıdır.",
    ].join("\n\n");
  }

  if (q.includes("niasinamid") || q.includes("niacinamide") || q.includes("b3")) {
    return [
      "Kısa cevap: Niasinamid kozmetik formüllerde çoğunlukla %2-5 aralığında mantıklı ve konforlu çalışır.",
      "Kimyager gözüyle: Bariyer hissi, ton eşitsizliği görünümü ve sebum dengesi için kullanılır. Hassas cilt ürünlerinde %2-4 daha nazik bir aralıktır; %10 gibi yüksek oranlar bazı ciltlerde kızarma, batma veya pütür yapabilir.",
      "Formülasyon notu: Su fazında çözündürülür, pH genelde ciltle uyumlu aralıkta tutulur. Koruyucu sistem, çözünürlük, stabilite ve tolerans testi atlanmamalıdır.",
    ].join("\n\n");
  }

  if (officialMode) {
    return [
      "Kısa cevap: Bu konu mevzuat açısından değerlendirilmelidir; tek cümleyle 'uygun' demek doğru olmaz.",
      "Mevzuat gözüyle: Ürün tipi, kullanım alanı, içerik listesi, yasaklı/kısıtlı madde kontrolü, alerjen beyanı, etiket dili, iddia sınırı, ürün bilgi dosyası, güvenlilik değerlendirmesi ve hedef pazar ayrı ayrı kontrol edilmelidir.",
      "Kimyager gözüyle: Formülasyon tarafında pH, koruyucu sistem, stabilite, mikrobiyoloji, ambalaj uyumu ve kullanım bölgesi güvenliği birlikte düşünülür.",
      "Dikkat: Piyasaya arz öncesi güncel resmi kaynak kontrolü gerekir. Eski PDF veya eski kılavuz bilgisine dayanarak kesin uygunluk beyanı verilmemelidir.",
    ].join("\n\n");
  }

  return [
    "Kısa cevap: Sorunu aldım; bunu ürün tipi, hedef etki, hammadde seçimi, kullanım oranı, pH, stabilite, üretim yöntemi ve güvenlik açısından yorumlayabilirim.",
    "Kimyager gözüyle: Önce ürünün ciltte kalan mı durulanan mı olduğunu, su/yağ fazı ihtiyacını, aktiflerin uyumluluğunu, koruyucu sistemini ve pH aralığını düşünmek gerekir.",
    "Mini öneri: Ürün tipini veya yapmak istediğin etkiyi bir cümleyle yaz; ben sana formülasyon iskeletini ve üretim adımlarını çıkarayım.",
  ].join("\n\n");
}

export default function Page() {
  const [activeMenu, setActiveMenu] = useState("Ana Sayfa");
  const [selectedSector, setSelectedSector] = useState<SectorKey>("Kozmetik");
  const [market, setMarket] = useState("Avrupa Birliği (EU)");
  const [mainQuestion, setMainQuestion] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [inciSearch, setInciSearch] = useState("");
  const [inciResult, setInciResult] = useState(
    "Bir INCI adı yaz; kullanım amacı, olası oran mantığı, pH/stabilite uyumu ve dikkat notlarını sohbet alanında yorumlayayım."
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Merhaba, InciLab hazır. Formülasyon, INCI, parfüm, stabilite, mevzuat veya laboratuvar yorumu için sorunu doğal şekilde yazabilirsin.",
    },
  ]);

  const timersRef = useRef<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearInterval(timer));
      timersRef.current = [];
    };
  }, []);

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

  function typeAssistantAnswer(answer: string, replaceMessageId?: number) {
    const finalText = answer.trim() || localClientFallback("");
    const messageId = Date.now() + Math.random();
    const chars = Array.from(finalText);

    setChatMessages((prev) => {
      const cleared = replaceMessageId ? prev.filter((msg) => msg.id !== replaceMessageId) : prev;
      return [
        ...cleared,
        {
          id: messageId,
          sender: "assistant",
          text: "",
        },
      ];
    });

    let index = 0;
    const timer = window.setInterval(() => {
      index += 4;
      const partial = chars.slice(0, index).join("");

      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, text: partial } : msg))
      );

      if (index >= chars.length) {
        window.clearInterval(timer);
        timersRef.current = timersRef.current.filter((item) => item !== timer);
      }
    }, 12);

    timersRef.current.push(timer);
  }

  function scrollTo(id: string) {
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  function cleanAnswer(answer: string, originalQuestion: string) {
    const visibleAnswer = sanitizeVisibleAnswer(answer);
    return !visibleAnswer || isWeakOrLeakyAnswer(visibleAnswer)
      ? localClientFallback(originalQuestion)
      : visibleAnswer;
  }

  async function handleSend(question?: string, options?: SendOptions) {
    const text = (question ?? mainQuestion).trim();
    if (!text) return;

    const displayQuestion = options?.displayQuestion ?? text;

    if (options?.showUser !== false) {
      addMessage("user", displayQuestion);
    }

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

    const brainPrompt = buildInciLabBrainPrompt({
      question: text,
      sector: selectedSector,
      market,
    });

    const officialMode = hasOfficialSourceIntent(text);

    const applyAssistantAnswer = (answer: string) => {
      typeAssistantAnswer(cleanAnswer(answer, text), thinkingId);
    };

    try {
      const res = await fetch("/api/incilab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          userQuestion: text,
          sector: selectedSector,
          market,
          mode: "incilab-public-ready-v3",
          systemPrompt: brainPrompt,
          prompt: brainPrompt,
          message: brainPrompt,
          internalOptions: {
            assistant: "InciLab",
            brainVersion: "public-ready-v3",
            officialSourceMode: officialMode,
            hideTechnicalDetailsFromUser: true,
            userFacingOnly: true,
            preferredOfficialSources: [
              "TITCK",
              "Resmi Gazete",
              "Mevzuat.gov.tr",
              "CosIng",
              "SCCS",
              "EU 1223/2009",
            ],
          },
        }),
      });

      const data = await res.json().catch(() => null);
      const rawAnswer = extractAiAnswer(data);

      if (!res.ok || !rawAnswer || isWeakOrLeakyAnswer(rawAnswer)) {
        throw new Error("InciLab cevabı zayıf veya teknik detay içeriyor.");
      }

      applyAssistantAnswer(rawAnswer);
    } catch {
      try {
        const geminiRes = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: brainPrompt,
            prompt: brainPrompt,
            question: text,
            mode: "incilab-public-ready-v3",
            internalOptions: {
              assistant: "InciLab",
              brainVersion: "public-ready-v3",
              officialSourceMode: officialMode,
              hideTechnicalDetailsFromUser: true,
              userFacingOnly: true,
            },
          }),
        });

        const geminiData = await geminiRes.json().catch(() => null);
        const geminiAnswer = extractAiAnswer(geminiData);

        if (!geminiRes.ok || !geminiAnswer || isWeakOrLeakyAnswer(geminiAnswer)) {
          throw new Error("Yedek cevap alınamadı.");
        }

        applyAssistantAnswer(geminiAnswer);
      } catch {
        applyAssistantAnswer(localClientFallback(text));
      }
    }
  }

  function handleAnalysis() {
    const text = analysisText.trim();
    if (!text) return;
    handleSend(text);
    setAnalysisText("");
  }

  function handleInciSearch(value?: string) {
    const searchValue = (value ?? inciSearch).trim();
    if (!searchValue) return;

    setInciSearch(searchValue);
    setInciResult(`${searchValue} için sohbet alanında detaylı INCI yorumu hazırlanıyor.`);
    handleSend(`INCI analizi yap: ${searchValue}. Fonksiyonu, kullanım mantığı, pH/stabilite uyumu, hassasiyet riski ve mevzuat dikkatlerini sade şekilde anlat.`, {
      displayQuestion: `INCI analizi: ${searchValue}`,
    });
  }

  function handleSectorClick(sector: SectorKey) {
    setSelectedSector(sector);
    handleSend(sectorPrompts[sector], {
      displayQuestion: `${sector} alanını aç`,
    });
    scrollTo("chat-panel");
  }

  function handleMenuClick(item: string) {
    setActiveMenu(item);

    const actions: Record<string, () => void> = {
      "Ana Sayfa": () => scrollTo("hero-panel"),
      Sohbet: () => scrollTo("chat-panel"),
      "INCI Sorgula": () => scrollTo("inci-card"),
      Analiz: () => scrollTo("analysis-panel"),
      Mevzuat: () => scrollTo("regulation-card"),
      Trendler: () => scrollTo("trend-card"),
      Sektörler: () => scrollTo("sector-area"),
    };

    actions[item]?.();
  }

  function handleQuickAction(action: string) {
    const map: Record<string, string> = {
      "Bileşen Analizi": "Bir kozmetik içerik listesini nasıl analiz edeceğini örnek başlıklarla anlat. Kullanıcıdan INCI listesini istemeden önce analiz mantığını sade açıkla.",
      "Stabilite Tahmini": "Bir kozmetik formülde stabilite tahmini yaparken pH, viskozite, renk, koku, faz ayrımı, ambalaj ve mikrobiyoloji açısından hangi başlıklara bakılır?",
      "Uyumluluk Kontrolü": "Aktif bileşen, koruyucu sistem ve pH uyumluluğu nasıl kontrol edilir? Kullanıcıya pratik bir kontrol listesi ver.",
      "Mevzuat Kontrolü": `${market} hedef pazarı için kozmetik ürün mevzuat kontrolünde hangi başlıklar değerlendirilir?`,
      "Formül Danışmanı": "Bir ürün fikrini formülasyon iskeletine dönüştürürken nasıl ilerlenir? Su/yağ fazı, aktif, koruyucu, pH, stabilite ve test planını sade anlat.",
      "Fresh Parfüm": "Fresh koku içerikli parfüm yapmak istiyorum. Esans akordu, üst-orta-dip nota, alkol oranı, dinlendirme, filtrasyon, IFRA ve alerjen güvenliğiyle anlat.",
    };

    handleSend(map[action] || action, {
      displayQuestion: action,
    });
  }

  function handleTrendClick(name: string) {
    handleSend(`${name} trend bileşenini kozmetik formülasyon açısından analiz et. Fonksiyonu, kullanım mantığı, hangi ürün tiplerinde mantıklı olduğu, pH/stabilite ve pazarlama iddiası sınırını anlat.`, {
      displayQuestion: `${name} trend bileşenini analiz et`,
    });
  }

  function clearChat() {
    timersRef.current.forEach((timer) => window.clearInterval(timer));
    timersRef.current = [];

    setChatMessages([
      {
        id: Date.now(),
        sender: "assistant",
        text: "Sohbet temizlendi. Yeni bir formülasyon, INCI, parfüm, mevzuat veya stabilite sorusu sorabilirsin.",
      },
    ]);
  }

  return (
    <main className="page">
      <aside className="sidebar">
        <div className="brand">
          <div className="logoGem">⬡</div>
          <div>
            <strong>InciLab</strong>
            <span>Formülasyon & INCI Asistanı</span>
          </div>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
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
          <h3>Güvenli Kullanım</h3>
          <p>
            InciLab; eğitim, ön değerlendirme ve Ar-Ge yönlendirmesi içindir.
            Ticari üretimde test ve mevzuat kontrolü ayrıca gerekir.
          </p>
          <button
            onClick={() =>
              typeAssistantAnswer(
                "Not: Ticari ürün geliştirmede stabilite, mikrobiyoloji, challenge test, ambalaj uyumu, güvenlilik değerlendirmesi ve güncel mevzuat kontrolü ayrıca yapılmalıdır."
              )
            }
          >
            Kullanım Notu
          </button>
        </div>
      </aside>

      <section className="main">
        <header className="topBar">
          <div>
            <h1>Merhaba 👋</h1>
            <p>
              Formülasyon, INCI analizi, parfüm, stabilite ve mevzuat ön değerlendirmelerini tek sohbetten yönet.
            </p>
          </div>

          <div className="topActions">
            <button
              onClick={() =>
                typeAssistantAnswer(
                  "Sorunu doğal şekilde yazabilirsin. Ürün fikri, içerik listesi, pH problemi, koku sorusu, mevzuat kontrolü ya da laboratuvar sonucu olabilir."
                )
              }
            >
              Yardım
            </button>
          </div>
        </header>

        <section id="hero-panel" className="heroPanel">
          <div className="orb" />
          <div className="heroContent">
            <span className="eyebrow">Akıllı Laboratuvar Asistanı</span>
            <h2>Bugün neyi analiz edelim?</h2>
            <p>
              Soruyu dağınık yazsan bile niyeti yakalayıp kimyager gözüyle açık, güvenli ve uygulanabilir cevap verir.
            </p>

            <div className="mainInput">
              <input
                value={mainQuestion}
                onChange={(e) => setMainQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Örn. fresh kokulu parfüm yapmak istiyorum, esansı nasıl kurarım?"
              />
              <button onClick={() => handleSend()}>→</button>
            </div>

            <div className="quickPills">
              {[
                "Bileşen Analizi",
                "Stabilite Tahmini",
                "Uyumluluk Kontrolü",
                "Mevzuat Kontrolü",
                "Formül Danışmanı",
                "Fresh Parfüm",
              ].map((pill) => (
                <button key={pill} onClick={() => handleQuickAction(pill)}>
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="contentGrid">
          <section id="chat-panel" className="chatPanel">
            <div className="chatHead">
              <div>
                <h3>InciLab Sohbet</h3>
                <p>Cevaplar hızlı ama harf harf akar; sade ve anlaşılır şekilde görüntülenir.</p>
              </div>
              <button onClick={clearChat}>Sohbeti Temizle</button>
            </div>

            <div className="messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={msg.sender === "user" ? "msg user" : "msg assistant"}>
                  <strong>{msg.sender === "user" ? "Sen" : "InciLab"}</strong>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </section>

          <aside className="sideStack">
            <article id="regulation-card" className="softCard">
              <div className="cardTitle">
                <span>🛡</span>
                <div>
                  <h3>Mevzuat Kontrolü</h3>
                  <p>Hedef pazarı seç; kontrol sohbetten yürüsün.</p>
                </div>
              </div>

              <label>Pazar</label>
              <select value={market} onChange={(e) => setMarket(e.target.value)}>
                <option>Avrupa Birliği (EU)</option>
                <option>Türkiye</option>
                <option>ABD</option>
                <option>Birleşik Krallık</option>
                <option>Japonya</option>
              </select>

              <button
                className="primarySoft"
                onClick={() =>
                  handleSend(`${market} hedef pazarı için kozmetik ürün mevzuat kontrolünde hangi başlıklara bakmalıyım?`, {
                    displayQuestion: `${market} mevzuat kontrolü yap`,
                  })
                }
              >
                Kontrolü Başlat
              </button>
            </article>

            <article id="inci-card" className="softCard">
              <div className="cardTitle">
                <span>🧬</span>
                <div>
                  <h3>INCI Sorgula</h3>
                  <p>İçeriği yaz; görev, uyum ve risk notunu yorumlasın.</p>
                </div>
              </div>

              <div className="miniSearch">
                <input
                  value={inciSearch}
                  onChange={(e) => setInciSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInciSearch();
                  }}
                  placeholder="INCI veya kimyasal adı yaz..."
                />
                <button onClick={() => handleInciSearch()}>⌕</button>
              </div>

              <p className="resultText">{inciResult}</p>
            </article>
          </aside>
        </section>

        <section id="analysis-panel" className="analysisPanel">
          <div>
            <h3>Analiz Sorusu</h3>
            <p>
              Buraya yazdığın her şey sohbet gibi çalışır. Ayrı boş panel değil; cevap direkt InciLab sohbetine düşer.
            </p>
          </div>

          <div className="analysisInput">
            <input
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAnalysis();
              }}
              placeholder="Örn. Bu içerik listesinde hassas cilt için risk var mı?"
            />
            <button onClick={handleAnalysis}>Analiz Başlat</button>
          </div>

          <div className="analysisLinks">
            <button onClick={() => setAnalysisText("Fresh kokulu parfüm yapmak istiyorum, esans akordundan itibaren anlat.")}>🌸 Parfüm</button>
            <button onClick={() => setAnalysisText("Bir kozmetik formülde koruyucu sistem uyumu nasıl kontrol edilir?")}>⚙ Uyum</button>
            <button onClick={() => setAnalysisText("Türkiye için kozmetik ürün mevzuat kontrolü yaparken hangi başlıklara bakılır?")}>🛡 Mevzuat</button>
          </div>
        </section>

        <section id="sector-area" className="sectorArea">
          <div className="sectionHead">
            <h3>Sektör Seçin</h3>
            <p>Sadece “mod açıldı” demez; seçilen alan için sohbetten gerçek analiz başlatır.</p>
          </div>

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
        </section>

        <section id="trend-card" className="trendPanel">
          <div className="sectionHead">
            <h3>Trend Bileşenler</h3>
            <p>Hazır formül göstermez; seçtiğin bileşeni sohbet içinde analiz eder.</p>
          </div>

          <div className="trendList">
            {trendIngredients.map((name, index) => (
              <button key={name} onClick={() => handleTrendClick(name)}>
                <span>{index + 1}</span>
                <b>{name}</b>
                <i>Analiz et</i>
              </button>
            ))}
          </div>
        </section>
      </section>

      <style>{`
        * { box-sizing: border-box; }

        :root {
          --ink: #17213d;
          --muted: #697894;
          --line: rgba(255, 255, 255, 0.72);
          --panel: rgba(255, 255, 255, 0.70);
          --panel-strong: rgba(255, 255, 255, 0.86);
          --pink: #ff9bd6;
          --lila: #b79cff;
          --blue: #a7dfff;
          --mint: #a9f7de;
          --yellow: #fff1a8;
          --violet: #7b61ff;
          --shadow: 0 24px 70px rgba(92, 91, 160, 0.18);
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
        button { cursor: pointer; border: 0; }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 292px 1fr;
          gap: 20px;
          padding: 16px;
        }

        .sidebar,
        .heroPanel,
        .softCard,
        .analysisPanel,
        .chatPanel,
        .sectorArea,
        .trendPanel {
          border: 1px solid var(--line);
          background: linear-gradient(145deg, rgba(255,255,255,.74), rgba(255,255,255,.46));
          box-shadow: var(--shadow);
          backdrop-filter: blur(22px);
        }

        .sidebar {
          position: sticky;
          top: 16px;
          height: calc(100vh - 32px);
          border-radius: 34px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow: hidden;
        }

        .brand {
          display: flex;
          gap: 12px;
          align-items: center;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(123, 97, 255, .14);
        }

        .logoGem {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: linear-gradient(135deg, #fff, #f3edff);
          color: var(--violet);
          font-size: 24px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.8), 0 12px 32px rgba(123, 97, 255, .18);
        }

        .brand strong { display: block; font-size: 20px; }
        .brand span { display: block; color: var(--muted); font-size: 12px; margin-top: 2px; }

        .menu { display: grid; gap: 8px; }

        .menuItem {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 18px;
          color: #35405f;
          background: rgba(255,255,255,.42);
          text-align: left;
          transition: .18s ease;
        }

        .menuItem:hover,
        .menuItem.active {
          transform: translateY(-1px);
          background: linear-gradient(135deg, rgba(255,255,255,.95), rgba(238,233,255,.92));
          color: var(--violet);
          box-shadow: 0 14px 30px rgba(123, 97, 255, .12);
        }

        .menuItem span {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
        }

        .usageCard {
          margin-top: auto;
          border-radius: 26px;
          padding: 18px;
          background: linear-gradient(145deg, rgba(255,255,255,.72), rgba(246,240,255,.74));
          border: 1px solid rgba(255,255,255,.7);
        }

        .usageCard h3 { margin: 0 0 8px; }
        .usageCard p { margin: 0 0 14px; color: var(--muted); font-size: 13px; line-height: 1.45; }
        .usageCard button,
        .primarySoft {
          width: 100%;
          padding: 11px 14px;
          border-radius: 16px;
          color: #fff;
          background: linear-gradient(135deg, #7b61ff, #ff8ed2);
          box-shadow: 0 16px 34px rgba(123, 97, 255, .22);
        }

        .main { min-width: 0; display: flex; flex-direction: column; gap: 18px; }

        .topBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 4px 0;
        }

        .topBar h1 { margin: 0; font-size: 28px; }
        .topBar p { margin: 4px 0 0; color: var(--muted); }

        .topActions button {
          padding: 11px 16px;
          border-radius: 16px;
          background: rgba(255,255,255,.72);
          color: var(--ink);
          box-shadow: 0 10px 24px rgba(80, 80, 130, .08);
        }

        .heroPanel {
          position: relative;
          overflow: hidden;
          min-height: 330px;
          border-radius: 38px;
          padding: 46px;
        }

        .orb {
          position: absolute;
          right: -120px;
          top: -130px;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,.88), transparent 28%),
            radial-gradient(circle at 40% 55%, rgba(255,155,214,.72), transparent 38%),
            radial-gradient(circle at 62% 38%, rgba(167,223,255,.72), transparent 42%),
            radial-gradient(circle at 54% 68%, rgba(169,247,222,.58), transparent 42%);
          filter: blur(.2px);
          opacity: .88;
        }

        .heroContent { position: relative; max-width: 820px; }
        .eyebrow {
          display: inline-flex;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.66);
          color: var(--violet);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .04em;
        }

        .heroContent h2 {
          margin: 18px 0 10px;
          font-size: clamp(34px, 5vw, 64px);
          line-height: .95;
          letter-spacing: -0.05em;
        }

        .heroContent p { margin: 0 0 24px; color: var(--muted); font-size: 17px; line-height: 1.55; max-width: 650px; }

        .mainInput {
          display: flex;
          gap: 10px;
          padding: 8px;
          border-radius: 25px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(255,255,255,.86);
          box-shadow: 0 16px 40px rgba(90, 86, 160, .12);
        }

        .mainInput input,
        .miniSearch input,
        .analysisInput input,
        select {
          width: 100%;
          border: 0;
          outline: 0;
          color: var(--ink);
          background: rgba(255,255,255,.74);
        }

        .mainInput input { padding: 0 14px; background: transparent; min-height: 50px; }
        .mainInput button {
          width: 54px;
          min-width: 54px;
          height: 54px;
          border-radius: 19px;
          color: #fff;
          font-size: 24px;
          background: linear-gradient(135deg, #7b61ff, #ff8ed2);
        }

        .quickPills,
        .analysisLinks,
        .sectorButtons,
        .trendList {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .quickPills button,
        .analysisLinks button,
        .sectorButtons button,
        .trendList button {
          border-radius: 999px;
          padding: 10px 14px;
          color: #34405f;
          background: rgba(255,255,255,.70);
          border: 1px solid rgba(255,255,255,.78);
          transition: .18s ease;
        }

        .quickPills button:hover,
        .analysisLinks button:hover,
        .sectorButtons button:hover,
        .sectorButtons button.selected,
        .trendList button:hover {
          transform: translateY(-1px);
          color: var(--violet);
          background: rgba(255,255,255,.95);
          box-shadow: 0 12px 28px rgba(123, 97, 255, .12);
        }

        .contentGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr);
          gap: 18px;
          align-items: start;
        }

        .chatPanel {
          border-radius: 32px;
          padding: 20px;
          min-height: 610px;
        }

        .chatHead {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }

        .chatHead h3,
        .sectionHead h3,
        .analysisPanel h3,
        .cardTitle h3 { margin: 0; }

        .chatHead p,
        .sectionHead p,
        .analysisPanel p,
        .cardTitle p { margin: 4px 0 0; color: var(--muted); font-size: 13px; }

        .chatHead button {
          padding: 10px 13px;
          border-radius: 14px;
          background: rgba(255,255,255,.72);
          color: var(--muted);
        }

        .messages {
          max-height: 620px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 4px;
        }

        .msg {
          max-width: 84%;
          padding: 14px 16px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,.82);
          box-shadow: 0 10px 26px rgba(80, 80, 130, .08);
        }

        .msg strong {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          color: var(--violet);
        }

        .msg p {
          margin: 0;
          white-space: pre-wrap;
          line-height: 1.55;
        }

        .msg.assistant { background: rgba(255,255,255,.78); }
        .msg.user {
          align-self: flex-end;
          color: #fff;
          background: linear-gradient(135deg, #7b61ff, #ff8ed2);
        }
        .msg.user strong { color: rgba(255,255,255,.84); }

        .sideStack { display: flex; flex-direction: column; gap: 18px; }

        .softCard,
        .analysisPanel,
        .sectorArea,
        .trendPanel {
          border-radius: 30px;
          padding: 20px;
        }

        .cardTitle {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .cardTitle > span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(255,255,255,.70);
        }

        label {
          display: block;
          margin: 8px 0 7px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 700;
        }

        select {
          height: 46px;
          border-radius: 16px;
          padding: 0 12px;
          margin-bottom: 12px;
          border: 1px solid rgba(255,255,255,.8);
        }

        .miniSearch,
        .analysisInput {
          display: flex;
          gap: 8px;
          padding: 7px;
          border-radius: 20px;
          background: rgba(255,255,255,.70);
          border: 1px solid rgba(255,255,255,.80);
        }

        .miniSearch input,
        .analysisInput input {
          min-height: 42px;
          padding: 0 12px;
          border-radius: 14px;
        }

        .miniSearch button,
        .analysisInput button {
          min-width: 48px;
          padding: 0 15px;
          border-radius: 15px;
          color: #fff;
          background: linear-gradient(135deg, #7b61ff, #ff8ed2);
          white-space: nowrap;
        }

        .resultText {
          margin: 12px 0 0;
          color: var(--muted);
          line-height: 1.5;
        }

        .analysisPanel {
          display: grid;
          grid-template-columns: .75fr 1fr;
          gap: 14px;
          align-items: center;
        }

        .analysisLinks { grid-column: 1 / -1; }

        .sectionHead { margin-bottom: 14px; }

        .sectorButtons button { display: flex; align-items: center; gap: 8px; }
        .sectorButtons span { font-size: 17px; }

        .trendList button {
          min-width: 210px;
          display: grid;
          grid-template-columns: 30px 1fr auto;
          align-items: center;
          text-align: left;
          border-radius: 20px;
        }

        .trendList span {
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(123,97,255,.10);
          color: var(--violet);
          font-weight: 800;
        }

        .trendList i { color: var(--muted); font-style: normal; font-size: 13px; }

        @media (max-width: 1120px) {
          .page { grid-template-columns: 1fr; }
          .sidebar { position: relative; top: 0; height: auto; }
          .contentGrid { grid-template-columns: 1fr; }
          .analysisPanel { grid-template-columns: 1fr; }
        }

        @media (max-width: 720px) {
          .page { padding: 10px; }
          .heroPanel { padding: 28px 18px; border-radius: 28px; }
          .topBar { align-items: flex-start; flex-direction: column; }
          .mainInput,
          .analysisInput { flex-direction: column; }
          .mainInput button,
          .analysisInput button { width: 100%; }
          .msg { max-width: 96%; }
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
    Analiz: "▧",
    Mevzuat: "🛡",
    Trendler: "⌁",
    Sektörler: "⌘",
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

