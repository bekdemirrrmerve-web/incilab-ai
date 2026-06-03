import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

type OfficialContext = {
  enabled: boolean;
  summary: string;
};

function normalizeText(text: string) {
  return String(text || "")
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

function hasOfficialSourceIntent(question: string, market?: string) {
  const q = normalizeText(`${question} ${market || ""}`);

  const keywords = [
    "mevzuat",
    "yonetmelik",
    "resmi gazete",
    "titck",
    "uts",
    "ürün takip sistemi",
    "urun takip sistemi",
    "ürün bilgi dosyası",
    "urun bilgi dosyasi",
    "güvenlilik değerlendirmesi",
    "guvenlilik degerlendirmesi",
    "etiket",
    "iddia",
    "yasakli",
    "kisitli",
    "alerjen",
    "ifra",
    "cosing",
    "sccs",
    "1223/2009",
    "uv filtresi",
    "koruyucu limiti",
    "renklendirici",
    "nanomateryal",
    "piyasaya arz",
    "cpnp",
    "mocra",
    "turkiye",
    "avrupa birligi",
    "eu",
    "abd",
    "uk",
    "birlesik krallik",
  ];

  return keywords.some((keyword) => q.includes(keyword));
}

function isHighRiskQuestion(question: string) {
  const q = normalizeText(question);

  const highRiskKeywords = [
    "kostik",
    "sodyum hidroksit",
    "naoh",
    "potasyum hidroksit",
    "koh",
    "hidroklorik asit",
    "hcl",
    "sulfurik asit",
    "sülfürik asit",
    "nitrik asit",
    "peroksit",
    "hidrojen peroksit",
    "çamaşır suyu",
    "camasir suyu",
    "amonyak",
    "patlayici",
    "patlayıcı",
    "yanici",
    "yanıcı",
    "toksik",
    "zehir",
    "goz icine",
    "göz içine",
    "acik yara",
    "açık yara",
    "mukoza",
    "bebek",
    "hamile",
    "spf",
    "gunes kremi",
    "güneş kremi",
    "evde peeling",
    "yüksek asit",
    "yuksek asit",
  ];

  return highRiskKeywords.some((keyword) => q.includes(keyword));
}

function sanitizeVisibleAnswer(text: string) {
  let clean = String(text || "");

  const bannedLinePatterns = [
    /officialSourceMode\s*[:=].*/gi,
    /checkedSources\s*[:=].*/gi,
    /rawResearchData\s*[:=].*/gi,
    /confidence\s*score\s*[:=].*/gi,
    /confidence\s*[:=].*/gi,
    /debug\s*[:=].*/gi,
    /endpoint\s*[:=].*/gi,
    /api\s*response\s*[:=].*/gi,
    /source\s*:\s*["']?gemini.*$/gim,
    /source\s*:\s*["']?local.*$/gim,
    /model fallback.*/gi,
    /system prompt.*/gi,
    /sistem promptu.*/gi,
    /api bağl[ıi] değilse.*/gi,
    /api bagli degilse.*/gi,
    /gemini\/openai api bağlantısı gerekir.*/gi,
    /gemini\/openai api baglantisi gerekir.*/gi,
    /daha güçlü cevap için.*/gi,
    /daha guclu cevap icin.*/gi,
    /tavily.*/gi,
    /raw response.*/gi,
    /pdf tarand[ıi].*/gi,
    /kaynak katman[ıi] aktif.*/gi,
  ];

  for (const pattern of bannedLinePatterns) {
    clean = clean.replace(pattern, "");
  }

  clean = clean
    .replace(/```json[\s\S]*?```/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return clean;
}

function isWeakAnswer(answer: string) {
  const a = normalizeText(answer);

  if (!a || a.length < 80) return true;

  const weakSignals = [
    "sorunu aldim",
    "bunu kimya, formulasyon",
    "genel yaklaşim",
    "genel yaklasim",
    "urun tipini belirlerim",
    "hedef etkiyi cikaririm",
    "gerekli hammaddeleri secerim",
    "kullanim oranlarini oneririm",
    "faz faz uretim yontemini yazarim",
    "api bagli degilse",
    "gemini/openai",
    "daha guclu cevap icin",
    "daha net sor",
    "sorunu biraz daha",
    "detay verirsen",
  ];

  return weakSignals.some((signal) => a.includes(signal));
}

function localFallback(question: string, market?: string) {
  const q = normalizeText(question);
  const officialMode = hasOfficialSourceIntent(question, market);

  if (
    (q.includes("limon") || q.includes("lemon")) &&
    (q.includes("leke") || q.includes("serum") || q.includes("cilt") || q.includes("yuz") || q.includes("yüz"))
  ) {
    return `Kısa cevap: Limonla leke açıcı serum yapmanı önermem.

Kimyager gözüyle:
Limon suyu kozmetik aktif gibi kontrol edilebilir bir hammadde değildir. pH'ı çok düşük olabilir, içeriği standart değildir ve ciltte iritasyon, yanma, bariyer bozulması ve güneşle hassasiyet riskini artırabilir. Leke hedefinde bu yaklaşım güvenli ve profesyonel bir formülasyon mantığı sayılmaz.

Daha doğru mantık:
- Niasinamid: genelde %2-5 aralığı
- Panthenol / Betaine gibi bariyer destekleri
- C vitamini türevleri: formüle ve pH sistemine göre seçilmeli
- Azelaik asit türevleri veya meyan kökü gibi daha kontrollü aydınlatıcı destekler
- Gündüz mutlaka düzenli SPF

Dikkat:
Leke ürünlerinde asıl kritik nokta aktiften çok düzenli güneş korumasıdır. SPF olmadan leke açıcı serumdan sağlıklı sonuç beklemek zor. Ev tipi limon uygulaması yerine pH'ı, koruyucusu ve stabilitesi kontrol edilmiş bir serum mantığı daha güvenlidir.`;
  }

  if (
    (q.includes("gliserin") || q.includes("glycerin")) &&
    (q.includes("aloe") || q.includes("aloe vera")) &&
    (q.includes("krem") || q.includes("cream"))
  ) {
    return `Kısa cevap: Gliserin + aloe vera karışımı tek başına krem olmaz.

Kimyager gözüyle:
Bu karışım daha çok sulu/humektan bir jel veya nem destekli tonik mantığına yaklaşır. Krem olması için su fazı, yağ fazı, emülgatör, kıvam yapısı ve koruyucu sistem gerekir.

Krem iskeleti için temel mantık:
- Su fazı: su, aloe, gliserin gibi nem tutucular
- Yağ fazı: hafif ester yağlar, bitkisel yağlar veya emollientler
- Emülgatör: su ve yağı bir arada tutar
- Kıvam verici: krem dokusunu oluşturur
- Koruyucu: mikrobiyal riski azaltır
- pH ayarı: cilt uyumu ve koruyucu etkinliği için gerekir

Dikkat:
Aloe ve su içeren her karışım mikrobiyal açıdan risklidir. Evde yapılıp günlerce bekletilecekse koruyucusuz kullanmak doğru değildir. Küçük miktar hazırlanmalı, hijyenik çalışılmalı ve ticari ürün gibi saklanmamalıdır.`;
  }

  if (
    q.includes("niasinamid") ||
    q.includes("niasin amid") ||
    q.includes("niacinamide") ||
    q.includes("b3")
  ) {
    return `Kısa cevap: Niasinamid çoğu kozmetik formülde genelde %2-5 aralığında daha konforlu çalışır.

Kimyager gözüyle:
Hassas cilt ürünlerinde %2-4 bandı daha güvenli ve tolere edilebilir olur. %10 seviyeleri bazı ticari serumlarda görülebilir ama bu her formül için otomatik iyi fikir değildir; çözünürlük, pH, diğer aktiflerle uyum ve tolerans testleri gerekir.

Formülasyon notu:
- Uygun pH genelde yaklaşık 5.2-6.2 bandıdır.
- Çok düşük pH'lı asit sistemleriyle aynı formülde dikkatli olunmalıdır.
- Panthenol, beta-glucan, betaine ve hyaluronik asit gibi desteklerle daha konforlu bir serum kurulabilir.

Dikkat:
Yüksek oranlarda kızarma, batma, yapışkan his veya hassasiyet görülebilir. Hassas cilt hedefleniyorsa “yüksek oran” yerine dengeli formül daha mantıklı olur.`;
  }

  if (
    q.includes("parfum") ||
    q.includes("parfüm") ||
    q.includes("esans") ||
    q.includes("koku") ||
    q.includes("fresh")
  ) {
    return `Fresh kokulu bir parfüm yapmak için önce esans akordu kurulur, sonra bu akort alkol bazlı parfüme dönüştürülür.

1) Esans mantığı:
Fresh kokularda üç yapı vardır:
- Üst nota: ilk gelen ferah kısım. Bergamot, limon, greyfurt, mandalina, yeşil elma, yeşil çay, nane.
- Orta nota: kokunun gövdesi. Neroli, frezya, yasemin, lavanta, beyaz çay, müge.
- Dip nota: kalıcılığı veren kısım. Temiz musk, sedir, amber, sandal, hafif odunsu notalar.

2) Fresh esans oranı:
Başlangıç için:
- %45 üst nota
- %35 orta nota
- %20 dip nota

3) 10 g fresh esans örneği:
- Bergamot: 2 g
- Limon: 1 g
- Greyfurt: 0.8 g
- Yeşil nota / yeşil elma akordu: 0.7 g
- Neroli: 1.5 g
- Beyaz çay: 1 g
- Frezya: 1 g
- Temiz musk: 0.8 g
- Sedir: 0.7 g
- Amber: 0.5 g

4) Esans yapımı:
Tüm esans bileşenleri cam beherde veya koyu renk cam şişede tartılır. Yavaşça karıştırılır. 24-48 saat dinlendirilir. Bu aşama esans konsantresidir.

5) Parfüme çevirme:
100 ml EDP için örnek:
- 18 ml esans
- 80 ml parfüm alkolü / etil alkol
- 2 ml saf su veya uygun çözücü destek

6) Sıra:
Önce alkol alınır. Esans yavaşça eklenir. Homojen karıştırılır. Gerekirse az miktar saf su eklenir. Koyu renk cam şişede 2-4 hafta dinlendirilir. Sonra filtrelenir.

7) Dikkat:
Alkol yanıcıdır. Açık alevden uzak çalışılmalı. Esanslar alerjen içerebilir. Cilde uygulanacak ürünlerde IFRA uygunluğu, alerjen beyanı ve yama testi gerekir.`;
  }

  if (q.includes("bebek") && (q.includes("koruyucusuz") || q.includes("krem") || q.includes("losyon"))) {
    return `Kısa cevap: Bebek için koruyucusuz su içeren krem yapmak güvenli bir fikir değil.

Kimyager gözüyle:
Bebek ürünlerinde cilt bariyeri daha hassas olduğu için mikrobiyal güvenlik, hammadde saflığı, alerjen riski, pH ve koruyucu sistemi çok daha kritik olur. Su, aloe, hidrolat veya bitkisel ekstrakt içeren ürünlerde koruyucu yoksa bakteri, maya ve küf riski oluşabilir.

Daha güvenli yaklaşım:
- Çok basit, parfümsüz, alerjen riski düşük formül
- Güvenli koruyucu sistemi
- pH ve stabilite kontrolü
- Mikrobiyolojik test / challenge test
- Pediatrik kullanım iddiasında ekstra dikkat

Dikkat:
Ev tipi bebek kremi ticari ürün gibi saklanmamalı ve kullanılmamalıdır. Bebek ürünü piyasaya arz edilecekse güvenlilik değerlendirmesi ve mevzuat kontrolleri şarttır.`;
  }

  if (q.includes("spf") || q.includes("gunes kremi") || q.includes("güneş kremi")) {
    return `Kısa cevap: Evde güneş kremi/SPF ürünü formüle edip SPF değerini garanti etmek doğru değildir.

Kimyager gözüyle:
Güneş koruyucu ürünlerde sadece UV filtresi eklemek yetmez. Filtrenin dağılımı, film oluşturma, fotostabilite, emülsiyon yapısı, ambalaj uyumu ve laboratuvar SPF/UVA testleri gerekir. Ev tipi karışımla “SPF 30 oldu” gibi bir sonuç verilemez.

Dikkat:
SPF ürünü piyasaya arz edilecekse güncel mevzuat, izinli UV filtreleri, kullanım limitleri, etiket iddiaları ve performans testleri profesyonel şekilde kontrol edilmelidir.`;
  }

  if (isHighRiskQuestion(question)) {
    return `Bu konu güvenlik açısından dikkat istiyor.

Kimyager gözüyle:
Soruda güçlü asit/alkali, oksitleyici, yanıcı madde, bebek ürünü, göz çevresi, açık yara veya SPF gibi hassas bir alan varsa doğrudan ev tipi tarif vermek doğru olmayabilir. Bu tip ürünlerde pH, konsantrasyon, temas süresi, koruyucu sistem, stabilite ve kullanıcı güvenliği kritik olur.

Daha güvenli yaklaşım:
- Önce ürün tipini ve kullanım bölgesini netleştir.
- Ev tipi denemeyi küçük ve risksiz gözlem seviyesinde tut.
- Cilde uygulanacaksa düşük riskli, kozmetik hammaddelerle ilerle.
- Ticari/piyasaya arz edilecek ürünlerde güvenlilik değerlendirmesi, stabilite ve mevzuat kontrolü yapılmalı.

Dikkat:
Yanma, tahriş, toksisite veya mikrobiyal risk doğurabilecek tariflerde güvenli alternatif seçmek gerekir.`;
  }

  if (officialMode) {
    return `Kısa cevap:
Bu konu mevzuat açısından kontrol edilmesi gereken bir başlık. Kesin uygunluk yorumu vermek için ürün tipi, hedef pazar, içerik listesi, kullanım bölgesi, iddia dili ve etiket bilgisi birlikte değerlendirilmelidir.

Mevzuat açısından:
- Ürünün kozmetik ürün tanımına girip girmediği kontrol edilmeli.
- Yasaklı/kısıtlı madde, UV filtresi, koruyucu, renklendirici ve alerjen beyanı açısından içerik listesi incelenmeli.
- Etiket ve reklam iddiaları tedavi/ilaç iddiasına kaymamalı.
- Türkiye pazarı için ÜTS, ürün bilgi dosyası, güvenlilik değerlendirmesi ve sorumlu kişi/teknik gereklilikler ayrıca değerlendirilmelidir.
- AB pazarı için 1223/2009 çerçevesi, CosIng ve ilgili ekler kontrol edilmelidir.

Dikkat:
Mevzuat güncellenebilir. Piyasaya arz öncesi güncel resmi kaynak ve uzman güvenlilik değerlendirmesiyle son kontrol yapılmalıdır.`;
  }

  return `Kısa cevap:
Sorunu aldım. Bunu InciLab mantığıyla ürün tipi, hedef etki, hammadde seçimi, kullanım oranı, pH, stabilite, üretim yöntemi ve güvenlik açısından değerlendirebilirim.

Kimyager gözüyle:
Önce kullanıcının niyetini belirlerim: formülasyon mu istiyor, INCI analizi mi, mevzuat kontrolü mü, üretim yöntemi mi, yoksa güvenli ev tipi açıklama mı? Sonra eksik bilgileri makul varsayımla tamamlayıp uygulanabilir bir cevap veririm.

Daha net ilerlemek için:
Sorunu ürün adı, içerik, hedef etki veya kullanım bölgesiyle yazarsan daha spesifik oran, faz sırası ve güvenlik notu çıkarabilirim.`;
}

function buildOfficialQuery(question: string, market?: string) {
  const q = question.trim();
  const m = market?.trim() || "";

  if (normalizeText(m).includes("turkiye") || normalizeText(q).includes("titck") || normalizeText(q).includes("uts")) {
    return `${q} ${m} TİTCK Kozmetik Mevzuatı Kozmetik Ürünler Yönetmeliği resmi kaynak`;
  }

  if (normalizeText(m).includes("avrupa") || normalizeText(m).includes("eu") || normalizeText(q).includes("cosing")) {
    return `${q} ${m} Regulation EC 1223/2009 CosIng official European Commission`;
  }

  return `${q} ${m} kozmetik mevzuatı resmi kaynak TİTCK Resmi Gazete CosIng`;
}

async function fetchOfficialContext(question: string, market?: string): Promise<OfficialContext> {
  const enabled = hasOfficialSourceIntent(question, market);

  if (!enabled || !TAVILY_API_KEY) {
    return {
      enabled,
      summary: "",
    };
  }

  try {
    const tavilyResponse = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: buildOfficialQuery(question, market),
        search_depth: "advanced",
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
        include_domains: [
          "titck.gov.tr",
          "mevzuat.gov.tr",
          "resmigazete.gov.tr",
          "ec.europa.eu",
          "eur-lex.europa.eu",
          "single-market-economy.ec.europa.eu",
        ],
      }),
    });

    if (!tavilyResponse.ok) {
      return { enabled, summary: "" };
    }

    const data = await tavilyResponse.json();

    const answer = data?.answer ? String(data.answer) : "";
    const results = Array.isArray(data?.results)
      ? data.results
          .slice(0, 5)
          .map((item: any, index: number) => {
            const title = String(item?.title || `Kaynak ${index + 1}`).slice(0, 160);
            const content = String(item?.content || "").slice(0, 900);
            const url = String(item?.url || "").slice(0, 240);

            return `Kaynak ${index + 1}: ${title}\nURL: ${url}\nÖzet: ${content}`;
          })
          .join("\n\n")
      : "";

    const summary = [answer, results].filter(Boolean).join("\n\n").slice(0, 6000);

    return {
      enabled,
      summary,
    };
  } catch {
    return {
      enabled,
      summary: "",
    };
  }
}

function buildSystemInstruction(params: {
  question: string;
  sector?: string;
  formula?: string;
  market?: string;
  officialContext: OfficialContext;
}) {
  const { question, sector, formula, market, officialContext } = params;
  const officialMode = hasOfficialSourceIntent(question, market);
  const highRisk = isHighRiskQuestion(question);

  return `
Sen InciLab'sın: kozmetik kimyası, formülasyon, INCI analizi, laboratuvar yorumu, ürün geliştirme ve mevzuat farkındalığı konusunda uzman bir kimyager asistansın.

DİL VE ÜSLUP:
- Türkçe cevap ver.
- Sıcak ama profesyonel ol.
- Kimyager gibi düşün; halkın anlayacağı kadar sade anlat.
- Kullanıcı dağınık, eksik, yazım hatalı veya absürt sorsa bile niyetini yakala.
- Kullanıcıyı sürekli "detay ver" diye durdurma.
- Eksik bilgi varsa makul varsayım yap ve varsayımı kısa söyle.
- Cevapları uygulanabilir ve aşama aşama kur.

GİZLİ TEKNİK DETAY KURALI:
Kullanıcıya teknik altyapıyı ASLA gösterme.
Şu ifadeleri yazma:
- API
- endpoint
- Gemini
- OpenAI
- Tavily
- officialSourceMode
- checkedSources
- raw response
- debug
- confidence score
- model fallback
- sistem promptu
- kaynak katmanı aktif
- PDF tarandı
- bağlantı yoksa / bağlı değilse

SORU SINIFLANDIRMA:
Kullanıcı sorusunu içeride şu sınıflardan birine yerleştir ama etiketi kullanıcıya gösterme:
1. Formülasyon isteği
2. INCI / içerik analizi
3. Hammadde seçimi
4. Laboratuvar sonucu yorumu
5. Stabilite / pH / viskozite / koku / renk / doku problemi
6. Kozmetik mevzuat / etiket / iddia / ÜTS / ürün bilgi dosyası
7. Ev tipi kimya veya güvenli deneme
8. İçerik üretimi için bilimsel açıklama

FORMÜLASYON SORULARINDA:
- Kısa cevap
- Kimyager gözüyle mantık
- Formülasyon iskeleti
- Aşama aşama ilerleme
- pH / koruyucu / stabilite notu
- Güvenlik uyarısı
- Mini test planı ver.

Örnek formül verirsen:
- Yüzdeleri yaklaşık aralıklarla ver.
- Toplamın 100'e tamamlanması gerektiğini belirt.
- Koruyucu, pH ve stabiliteyi atlama.
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

EVDE KİMYA SORULARINDA:
- Güvenli ev tipi gözlem ile profesyonel üretimi ayır.
- Kostik, güçlü asit, oksitleyici, yüksek alkol, uçucu solvent, SPF, bebek ürünü, göz çevresi veya açık yara konularında çok dikkatli ol.
- Riskli tarif verme; güvenli alternatif öner.

MEVZUAT SORULARINDA:
Mevzuat hassasiyeti: ${officialMode ? "var" : "düşük"}
Canlı resmi kaynak bağlamı: ${officialContext.summary ? "var" : "yok veya alınamadı"}
Hedef pazar: ${market || "belirtilmedi"}

Mevzuat içeren konularda:
- Kesin uygunluk garantisi verme.
- Güncel resmi kaynak ve uzman güvenlilik değerlendirmesi ile son kontrol gerektiğini sade şekilde söyleyebilirsin.
- TİTCK, Resmî Gazete, Mevzuat.gov.tr, EU 1223/2009, CosIng, SCCS gibi kaynaklardan gelen bilgiyi arka planda değerlendir; ama teknik kontrol sürecini anlatma.
- Eski PDF bilgisine saplanma.
- Yönetmelik değişebileceği için kesin hüküm vermeden kontrol başlıklarını anlat.
- ÜTS, ürün bilgi dosyası, güvenlilik değerlendirmesi, etiket, iddia, alerjen, yasaklı/kısıtlı madde kontrollerini sade şekilde belirt.

GÜVENLİK:
Yüksek risk sinyali: ${highRisk ? "var" : "düşük"}
Şunlarda doğrudan tarif verme:
- Patlayıcı, toksik, yasa dışı veya zararlı kimyasal üretimi
- Cildi yakabilecek yüksek asit/alkali uygulamaları
- Evde SPF garanti etme
- Bebek ürünü için koruyucusuz/steril olmayan formül
- Tedavi/ilaç iddiası
- Göz içine, mukozaya veya açık yaraya uygulanacak ürün

Böyle durumda:
- Neden riskli olduğunu açıkla.
- Güvenli alternatif ver.
- Kullanıcıyı boş bırakma.

GİZLİ RESMİ KAYNAK BAĞLAMI:
Aşağıdaki bağlam sadece cevabı doğrulamak için kullanılacak. Kullanıcıya "kaynak taradım, PDF okudum, API kullandım" gibi teknik süreç söyleme.
${officialContext.summary || "Bu soruda canlı resmi kaynak bağlamı yok. Genel güvenli formülasyon ve mevzuat farkındalığı ile cevap ver."}

KULLANICI BAĞLAMI:
Sektör: ${sector || "belirtilmedi"}
Seçili formül: ${formula || "belirtilmedi"}
Pazar: ${market || "belirtilmedi"}
Kullanıcı sorusu: ${question}

CEVAP FORMATI:
Konuya göre en uygun formatı seç. Genelde şu yapı iyi çalışır:

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
`;
}

async function askGemini(params: {
  question: string;
  sector?: string;
  formula?: string;
  market?: string;
  officialContext: OfficialContext;
}) {
  if (!GEMINI_API_KEY) return "";

  const systemInstruction = buildSystemInstruction(params);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: params.question,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.38,
          topP: 0.88,
          maxOutputTokens: 2200,
        },
      }),
    }
  );

  if (!response.ok) {
    return "";
  }

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.parts?.map((part: any) => part?.text).filter(Boolean).join("\n") ||
    ""
  );
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: "InciLab API",
    version: "2.2.0",
    message: "InciLab kimyager beyni çalışıyor.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const question = String(body?.question || body?.message || "");
    const sector = body?.sector ? String(body.sector) : "";
    const formula = body?.formula ? String(body.formula) : "";
    const market = body?.market ? String(body.market) : "";

    if (!question.trim()) {
      return NextResponse.json({
        ok: true,
        answer: "Sorunu yazınca InciLab bunu formülasyon, INCI, pH, stabilite, üretim yöntemi, güvenlik veya mevzuat açısından yorumlayabilir.",
      });
    }

    const officialContext = await fetchOfficialContext(question, market);

    let answer = "";

    try {
      answer = await askGemini({
        question,
        sector,
        formula,
        market,
        officialContext,
      });
    } catch {
      answer = "";
    }

    answer = sanitizeVisibleAnswer(answer);

    if (isWeakAnswer(answer)) {
      answer = localFallback(question, market);
    }

    answer = sanitizeVisibleAnswer(answer);

    return NextResponse.json({
      ok: true,
      answer,
    });
  } catch {
    return NextResponse.json({
      ok: true,
      answer:
        "Şu an cevap üretirken teknik bir aksama oldu ama güvenli tarafta kalalım: Sorunu ürün tipi, kullanım bölgesi, hedef etki, içerik listesi ve pH/stabilite açısından yeniden değerlendirerek ilerlemek gerekir. Riskli kimyasal, bebek ürünü, SPF veya mevzuat içeren konularda kesin uygulama yapmadan güncel resmi kontrol ve güvenlilik değerlendirmesi yapılmalıdır.",
    });
  }
}
