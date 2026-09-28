/**
 * IMPORTANT NOTE ON TRANSLATIONS:
 * WHO-5 and SWLS are licensed/validated psychometric instruments. The
 * English wording below is the standard published wording (WHO-5: WHO
 * Regional Office for Europe; SWLS: Diener et al. 1985), used here
 * verbatim as instructed. The Hindi and Bengali versions are a working
 * translation for pilot use ONLY -- they have not been through a formal
 * back-translation/psychometric validation process, and should be
 * replaced with an officially validated translation (if one exists for
 * your target population) before this instrument is used in any
 * published or high-stakes research. This applies to every instrument in
 * this file, not just WHO-5/SWLS -- SUS in lib/pilot/sus.ts carries the
 * same caveat already.
 */

export interface ScaleItem {
  id: string;
  text: { en: string; hi: string; bn: string };
}

// ---- Section F1: WHO-5 Well-Being Index ----
// Scale: 0 = At no time ... 5 = All of the time. Score = sum x 4 (0-100).
export const WHO5_ITEMS: ScaleItem[] = [
  { id: "who5_1", text: { en: "I have felt cheerful and in good spirits", hi: "मैं प्रसन्न और अच्छे मूड में महसूस करता/करती रहा/रही हूं", bn: "আমি প্রফুল্ল এবং ভালো মেজাজে অনুভব করেছি" } },
  { id: "who5_2", text: { en: "I have felt calm and relaxed", hi: "मैं शांत और आराम महसूस करता/करती रहा/रही हूं", bn: "আমি শান্ত এবং স্বস্তি অনুভব করেছি" } },
  { id: "who5_3", text: { en: "I have felt active and vigorous", hi: "मैं सक्रिय और ऊर्जावान महसूस करता/करती रहा/रही हूं", bn: "আমি সক্রিয় এবং উদ্যমী অনুভব করেছি" } },
  { id: "who5_4", text: { en: "I woke up feeling fresh and rested", hi: "मैं ताज़ा और आराम महसूस करते हुए जागा/जागी", bn: "আমি সতেজ এবং বিশ্রামপ্রাপ্ত অনুভব করে ঘুম থেকে উঠেছি" } },
  { id: "who5_5", text: { en: "My daily life has been filled with things that interest me", hi: "मेरा दैनिक जीवन उन चीज़ों से भरा रहा है जो मुझे रुचिकर लगती हैं", bn: "আমার দৈনন্দিন জীবন এমন জিনিসে ভরা ছিল যা আমার আগ্রহের" } },
];

export function scoreWho5(responses: Record<string, number>): number {
  const sum = WHO5_ITEMS.reduce((total, item) => total + (responses[item.id] ?? 0), 0);
  return sum * 4;
}

// ---- Section F2: Satisfaction With Life Scale (SWLS) ----
// Scale: 1 = Strongly disagree ... 7 = Strongly agree. Score = sum (5-35).
export const SWLS_ITEMS: ScaleItem[] = [
  { id: "swls_1", text: { en: "In most ways my life is close to my ideal.", hi: "अधिकतर मामलों में मेरा जीवन मेरे आदर्श के करीब है।", bn: "বেশিরভাগ ক্ষেত্রে আমার জীবন আমার আদর্শের কাছাকাছি।" } },
  { id: "swls_2", text: { en: "The conditions of my life are excellent.", hi: "मेरे जीवन की परिस्थितियां उत्कृष्ट हैं।", bn: "আমার জীবনের অবস্থা চমৎকার।" } },
  { id: "swls_3", text: { en: "I am satisfied with my life.", hi: "मैं अपने जीवन से संतुष्ट हूं।", bn: "আমি আমার জীবনে সন্তুষ্ট।" } },
  { id: "swls_4", text: { en: "So far I have gotten the important things I want in life.", hi: "अब तक मुझे जीवन में वे महत्वपूर्ण चीज़ें मिल चुकी हैं जो मैं चाहता/चाहती था/थी।", bn: "এ পর্যন্ত আমি জীবনে যে গুরুত্বপূর্ণ জিনিসগুলি চেয়েছিলাম তা পেয়েছি।" } },
  { id: "swls_5", text: { en: "If I could live my life over, I would change almost nothing.", hi: "अगर मैं अपना जीवन फिर से जी सकता/सकती, तो मैं लगभग कुछ भी नहीं बदलता/बदलती।", bn: "যদি আমি আমার জীবন আবার বাঁচতে পারতাম, আমি প্রায় কিছুই পরিবর্তন করতাম না।" } },
];

export function scoreSwls(responses: Record<string, number>): number {
  return SWLS_ITEMS.reduce((total, item) => total + (responses[item.id] ?? 0), 0);
}

// ---- Section I: NASA Task Load Index (raw TLX -- unweighted mean of 6 dimensions, 0-100 each) ----
export interface TlxDimension {
  id: "mental" | "physical" | "temporal" | "performance" | "effort" | "frustration";
  label: { en: string; hi: string; bn: string };
  lowAnchor: { en: string; hi: string; bn: string };
  highAnchor: { en: string; hi: string; bn: string };
}

const LOW = { en: "Very low", hi: "बहुत कम", bn: "খুব কম" };
const HIGH = { en: "Very high", hi: "बहुत अधिक", bn: "খুব বেশি" };

export const TLX_DIMENSIONS: TlxDimension[] = [
  { id: "mental", label: { en: "Mental Demand", hi: "मानसिक मांग", bn: "মানসিক চাহিদা" }, lowAnchor: LOW, highAnchor: HIGH },
  { id: "physical", label: { en: "Physical Demand", hi: "शारीरिक मांग", bn: "শারীরিক চাহিদা" }, lowAnchor: LOW, highAnchor: HIGH },
  { id: "temporal", label: { en: "Temporal Demand (time pressure)", hi: "समय का दबाव", bn: "সময়ের চাপ" }, lowAnchor: LOW, highAnchor: HIGH },
  {
    id: "performance",
    label: { en: "Performance (how successful you felt)", hi: "प्रदर्शन (आपने कितना सफल महसूस किया)", bn: "কর্মক্ষমতা (আপনি কতটা সফল অনুভব করেছেন)" },
    lowAnchor: { en: "Perfect", hi: "उत्तम", bn: "নিখুঁত" },
    highAnchor: { en: "Failure", hi: "असफल", bn: "ব্যর্থ" },
  },
  { id: "effort", label: { en: "Effort", hi: "प्रयास", bn: "প্রচেষ্টা" }, lowAnchor: LOW, highAnchor: HIGH },
  { id: "frustration", label: { en: "Frustration", hi: "निराशा", bn: "হতাশা" }, lowAnchor: LOW, highAnchor: HIGH },
];

/** Raw TLX: simple unweighted mean of the 6 dimensions (each already 0-100). */
export function scoreRawTlx(ratings: Record<string, number>): number {
  const values = TLX_DIMENSIONS.map((d) => ratings[d.id] ?? 0);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

// ---- Section J: Task Comprehension and Independence ----
// ci_8 (audio) only applies to conditions with audio (TA, TAI); ci_9
// (icons) only to TAI. The rest always apply.
export interface ComprehensionItem extends ScaleItem {
  appliesTo: "always" | "audio" | "icons";
}

export const COMPREHENSION_INDEPENDENCE_ITEMS: ComprehensionItem[] = [
  { id: "ci_1", appliesTo: "always", text: { en: "I understood what the interface was asking me to do.", hi: "मुझे समझ में आया कि इंटरफ़ेस मुझसे क्या करने के लिए कह रहा था।", bn: "ইন্টারফেসটি আমাকে কী করতে বলছিল তা আমি বুঝেছি।" } },
  { id: "ci_2", appliesTo: "always", text: { en: "I understood the information presented to me.", hi: "मुझे मुझे दी गई जानकारी समझ में आई।", bn: "আমাকে দেওয়া তথ্য আমি বুঝেছি।" } },
  { id: "ci_3", appliesTo: "always", text: { en: "I understood the meaning of the instructions.", hi: "मुझे निर्देशों का अर्थ समझ में आया।", bn: "আমি নির্দেশাবলীর অর্থ বুঝেছি।" } },
  { id: "ci_4", appliesTo: "always", text: { en: "I knew what action I needed to take next.", hi: "मुझे पता था कि मुझे आगे क्या कार्रवाई करनी है।", bn: "আমি জানতাম পরবর্তীতে আমাকে কী পদক্ষেপ নিতে হবে।" } },
  { id: "ci_5", appliesTo: "always", text: { en: "I could complete the task without another person's help.", hi: "मैं किसी अन्य व्यक्ति की मदद के बिना कार्य पूरा कर सका/सकी।", bn: "আমি অন্য কারো সাহায্য ছাড়াই কাজটি সম্পূর্ণ করতে পেরেছি।" } },
  { id: "ci_6", appliesTo: "always", text: { en: "I felt confident making decisions while using the interface.", hi: "इंटरफ़ेस का उपयोग करते समय मुझे निर्णय लेने में आत्मविश्वास महसूस हुआ।", bn: "ইন্টারফেস ব্যবহার করার সময় সিদ্ধান্ত নিতে আমি আত্মবিশ্বাসী বোধ করেছি।" } },
  { id: "ci_7", appliesTo: "always", text: { en: "The text helped me understand the task.", hi: "टेक्स्ट ने मुझे कार्य समझने में मदद की।", bn: "টেক্সট আমাকে কাজটি বুঝতে সাহায্য করেছে।" } },
  { id: "ci_8", appliesTo: "audio", text: { en: "The audio helped me understand the task.", hi: "ऑडियो ने मुझे कार्य समझने में मदद की।", bn: "অডিও আমাকে কাজটি বুঝতে সাহায্য করেছে।" } },
  { id: "ci_9", appliesTo: "icons", text: { en: "The icons/pictures helped me understand the task.", hi: "आइकन/चित्रों ने मुझे कार्य समझने में मदद की।", bn: "আইকন/ছবি আমাকে কাজটি বুঝতে সাহায্য করেছে।" } },
  { id: "ci_10", appliesTo: "always", text: { en: "The combination of available information helped me understand the task.", hi: "उपलब्ध जानकारी के संयोजन ने मुझे कार्य समझने में मदद की।", bn: "উপলব্ধ তথ্যের সমন্বয় আমাকে কাজটি বুঝতে সাহায্য করেছে।" } },
];

export function comprehensionItemsForCondition(condition: "T" | "TA" | "TAI"): ComprehensionItem[] {
  return COMPREHENSION_INDEPENDENCE_ITEMS.filter((item) => {
    if (item.appliesTo === "always") return true;
    if (item.appliesTo === "audio") return condition === "TA" || condition === "TAI";
    if (item.appliesTo === "icons") return condition === "TAI";
    return true;
  });
}

// ---- Section D: Digital Familiarity (0-4 scale, 7 items) ----
export const DIGITAL_FAMILIARITY_ITEMS: ScaleItem[] = [
  { id: "df_1", text: { en: "Install/set up a new device", hi: "एक नया डिवाइस इंस्टॉल/सेटअप करना", bn: "একটি নতুন ডিভাইস ইনস্টল/সেটআপ করা" } },
  { id: "df_2", text: { en: "Send an e-mail with an attachment", hi: "अटैचमेंट के साथ ईमेल भेजना", bn: "সংযুক্তি সহ একটি ইমেইল পাঠানো" } },
  { id: "df_3", text: { en: "Copy and paste information", hi: "जानकारी कॉपी और पेस्ट करना", bn: "তথ্য কপি এবং পেস্ট করা" } },
  { id: "df_4", text: { en: "Duplicate or move files/folders", hi: "फ़ाइलों/फ़ोल्डरों को डुप्लिकेट या स्थानांतरित करना", bn: "ফাইল/ফোল্ডার ডুপ্লিকেট বা সরানো" } },
  { id: "df_5", text: { en: "Use a spreadsheet", hi: "स्प्रेडशीट का उपयोग करना", bn: "স্প্রেডশিট ব্যবহার করা" } },
  { id: "df_6", text: { en: "Create/use a presentation", hi: "प्रेजेंटेशन बनाना/उपयोग करना", bn: "উপস্থাপনা তৈরি/ব্যবহার করা" } },
  { id: "df_7", text: { en: "Configure software/settings", hi: "सॉफ़्टवेयर/सेटिंग्स कॉन्फ़िगर करना", bn: "সফটওয়্যার/সেটিংস কনফিগার করা" } },
];

/** DFI = (sum of 7 items, each 0-4) / 28 x 100. */
export function scoreDigitalFamiliarity(responses: Record<string, number>): { sum: number; index: number } {
  const sum = DIGITAL_FAMILIARITY_ITEMS.reduce((total, item) => total + (responses[item.id] ?? 0), 0);
  return { sum, index: Math.round((sum / 28) * 1000) / 10 };
}

// ---- Section E: Digital Self-Efficacy (1-5 agree scale, 5 items) ----
export const SELF_EFFICACY_ITEMS: ScaleItem[] = [
  { id: "se_1", text: { en: "I feel confident using a digital device that I have not used before.", hi: "मैं ऐसे डिजिटल डिवाइस का उपयोग करने में आत्मविश्वास महसूस करता/करती हूं जिसे मैंने पहले उपयोग नहीं किया है।", bn: "আমি এমন একটি ডিজিটাল ডিভাইস ব্যবহার করতে আত্মবিশ্বাসী যা আমি আগে ব্যবহার করিনি।" } },
  { id: "se_2", text: { en: "I can usually solve simple problems when using a digital device.", hi: "डिजिटल डिवाइस का उपयोग करते समय मैं आमतौर पर सरल समस्याओं को हल कर सकता/सकती हूं।", bn: "ডিজিটাল ডিভাইস ব্যবহার করার সময় আমি সাধারণত সাধারণ সমস্যার সমাধান করতে পারি।" } },
  { id: "se_3", text: { en: "I can learn to use a new digital application without much help.", hi: "मैं बिना ज्यादा मदद के किसी नए डिजिटल एप्लिकेशन का उपयोग करना सीख सकता/सकती हूं।", bn: "আমি খুব বেশি সাহায্য ছাড়াই একটি নতুন ডিজিটাল অ্যাপ্লিকেশন ব্যবহার করতে শিখতে পারি।" } },
  { id: "se_4", text: { en: "I feel comfortable exploring unfamiliar functions on a digital device.", hi: "मुझे डिजिटल डिवाइस पर अपरिचित फ़ंक्शन का पता लगाने में सहजता महसूस होती है।", bn: "একটি ডিজিটাল ডিভাইসে অপরিচিত ফাংশন অন্বেষণ করতে আমি স্বাচ্ছন্দ্য বোধ করি।" } },
  { id: "se_5", text: { en: "I can recover when I make a mistake while using a digital device.", hi: "जब मैं डिजिटल डिवाइस का उपयोग करते समय गलती करता/करती हूं तो मैं उससे उबर सकता/सकती हूं।", bn: "একটি ডিজিটাল ডিভাইস ব্যবহার করার সময় ভুল করলে আমি তা থেকে সামলে উঠতে পারি।" } },
];
