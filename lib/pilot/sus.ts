// Standard System Usability Scale (Brooke, 1996), 10 items, 5-point
// Likert (1 = strongly disagree, 5 = strongly agree). "the system" is
// phrased as "this way of using the app" since each participant rates a
// specific UI condition (Version 1/2/3), not the app as a whole.
//
// This instrument itself is presented with voice support in every
// condition, including T (text-only) -- it's the measurement tool, not
// the interface under test, so withholding audio here would make the
// questionnaire itself inaccessible to a low-literacy participant in the
// T condition, undermining the measurement rather than testing anything.

export interface SusItem {
  id: number;
  positive: boolean; // odd items are positively worded, even items negatively
  text: { en: string; hi: string; bn: string };
}

export const SUS_ITEMS: SusItem[] = [
  {
    id: 1,
    positive: true,
    text: {
      en: "I think that I would like to use this way of using the app frequently.",
      hi: "मुझे लगता है कि मैं ऐप के इस तरीके का बार-बार उपयोग करना चाहूंगा/चाहूंगी।",
      bn: "আমার মনে হয় আমি অ্যাপ ব্যবহারের এই পদ্ধতিটি বারবার ব্যবহার করতে চাইব।",
    },
  },
  {
    id: 2,
    positive: false,
    text: {
      en: "I found this way of using the app unnecessarily complicated.",
      hi: "मुझे ऐप के इस तरीके में अनावश्यक रूप से जटिलता महसूस हुई।",
      bn: "আমার কাছে অ্যাপ ব্যবহারের এই পদ্ধতিটি অপ্রয়োজনীয়ভাবে জটিল মনে হয়েছে।",
    },
  },
  {
    id: 3,
    positive: true,
    text: {
      en: "I thought this way of using the app was easy to use.",
      hi: "मुझे लगा कि ऐप का यह तरीका उपयोग करने में आसान था।",
      bn: "আমার মনে হয়েছে অ্যাপ ব্যবহারের এই পদ্ধতিটি ব্যবহার করা সহজ ছিল।",
    },
  },
  {
    id: 4,
    positive: false,
    text: {
      en: "I think I would need help from a technical person to use this way of using the app.",
      hi: "मुझे लगता है कि ऐप के इस तरीके का उपयोग करने के लिए मुझे किसी तकनीकी व्यक्ति की मदद चाहिए होगी।",
      bn: "আমার মনে হয় অ্যাপ ব্যবহারের এই পদ্ধতিটি ব্যবহার করতে আমার একজন প্রযুক্তিগত ব্যক্তির সাহায্য দরকার হবে।",
    },
  },
  {
    id: 5,
    positive: true,
    text: {
      en: "I found the different parts of this way of using the app worked well together.",
      hi: "मुझे लगा कि ऐप के इस तरीके के अलग-अलग हिस्से एक साथ अच्छी तरह काम करते हैं।",
      bn: "আমার মনে হয়েছে অ্যাপ ব্যবহারের এই পদ্ধতির বিভিন্ন অংশ একসাথে ভালোভাবে কাজ করেছে।",
    },
  },
  {
    id: 6,
    positive: false,
    text: {
      en: "I thought there was too much that was inconsistent in this way of using the app.",
      hi: "मुझे लगा कि ऐप के इस तरीके में बहुत असंगति थी।",
      bn: "আমার মনে হয়েছে অ্যাপ ব্যবহারের এই পদ্ধতিতে অনেক অসামঞ্জস্য ছিল।",
    },
  },
  {
    id: 7,
    positive: true,
    text: {
      en: "I would imagine that most people would learn to use this way of using the app very quickly.",
      hi: "मुझे लगता है कि ज्यादातर लोग ऐप के इस तरीके को बहुत जल्दी सीख लेंगे।",
      bn: "আমার মনে হয় বেশিরভাগ মানুষ অ্যাপ ব্যবহারের এই পদ্ধতিটি খুব দ্রুত শিখে ফেলবে।",
    },
  },
  {
    id: 8,
    positive: false,
    text: {
      en: "I found this way of using the app very awkward to use.",
      hi: "मुझे ऐप का यह तरीका उपयोग करने में बहुत अटपटा लगा।",
      bn: "আমার কাছে অ্যাপ ব্যবহারের এই পদ্ধতিটি ব্যবহার করা খুব অস্বস্তিকর মনে হয়েছে।",
    },
  },
  {
    id: 9,
    positive: true,
    text: {
      en: "I felt very confident using this way of using the app.",
      hi: "ऐप के इस तरीके का उपयोग करते समय मुझे बहुत आत्मविश्वास महसूस हुआ।",
      bn: "অ্যাপ ব্যবহারের এই পদ্ধতিটি ব্যবহার করার সময় আমি খুব আত্মবিশ্বাসী বোধ করেছি।",
    },
  },
  {
    id: 10,
    positive: false,
    text: {
      en: "I needed to learn a lot of things before I could get going with this way of using the app.",
      hi: "ऐप के इस तरीके से शुरुआत करने से पहले मुझे बहुत कुछ सीखना पड़ा।",
      bn: "অ্যাপ ব্যবহারের এই পদ্ধতি দিয়ে শুরু করার আগে আমাকে অনেক কিছু শিখতে হয়েছে।",
    },
  },
];

/**
 * Standard SUS scoring: for positively-worded items, contribution =
 * (response - 1); for negatively-worded items, contribution =
 * (5 - response). Sum of all 10 contributions (range 0-40) x 2.5 gives
 * the standard 0-100 SUS score.
 */
export function scoreSus(responses: Record<number, number>): number {
  let total = 0;
  for (const item of SUS_ITEMS) {
    const response = responses[item.id];
    if (!response) continue;
    total += item.positive ? response - 1 : 5 - response;
  }
  return Math.round(total * 2.5 * 10) / 10;
}
