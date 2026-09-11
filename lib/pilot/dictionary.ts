export interface PilotDictionary {
  consent: { title: string; body: string; agree: string };
  intake: {
    title: string;
    fullName: string;
    contact: string;
    contactHint: string;
    gender: string;
    genderFemale: string;
    genderMale: string;
    genderOther: string;
    genderPreferNot: string;
    ageGroup: string;
    language: string;
    literacyLevel: string;
    literacyLow: string;
    literacyMedium: string;
    literacyHigh: string;
    digitalExperience: string;
    digitalLow: string;
    digitalMedium: string;
    digitalHigh: string;
    submit: string;
  };
  conditionIntro: { title: string; body: string; continueButton: string };
  taskProfileInfo: {
    instruction: string;
    nameLabel: string;
    craftLabel: string;
    craftPlaceholder: string;
    doneButton: string;
    comprehensionQuestion: string;
  };
  taskShareProfile: {
    instruction: string;
    buttonEditProfile: string;
    buttonViewOrders: string;
    buttonShareProfile: string;
    buttonSettings: string;
    comprehensionQuestion: string;
    comprehensionCorrect: string;
    comprehensionWrong1: string;
    comprehensionWrong2: string;
  };
  helpButton: { label: string; hintShown: string };
  satisfaction: { question: string };
  sus: { title: string; instruction: string };
  finalFeedback: { title: string; preferQuestion: string; commentsLabel: string; submit: string };
  debrief: { title: string; body: string };
  common: { next: string; version: string; of3: string; scaleStronglyDisagree: string; scaleStronglyAgree: string };
}

const en: PilotDictionary = {
  consent: {
    title: "Before we begin",
    body: "This is a short research study to help us improve KarigarSetu for people with different reading, language, and digital experience levels. You'll try three versions of the app and answer a few short questions about each. There are no right or wrong answers -- we're testing the app, not you. Your answers are kept for research purposes and will not be shared outside this study. You can stop at any time.",
    agree: "I agree to take part",
  },
  intake: {
    title: "A little about you",
    fullName: "Full name",
    contact: "Phone number or email",
    contactHint: "Used only to contact you about this study, e.g. for compensation.",
    gender: "Gender",
    genderFemale: "Female",
    genderMale: "Male",
    genderOther: "Other",
    genderPreferNot: "Prefer not to say",
    ageGroup: "Age group",
    language: "Which language would you like to use?",
    literacyLevel: "How comfortable are you reading?",
    literacyLow: "I find reading difficult",
    literacyMedium: "I can read, but slowly",
    literacyHigh: "I read comfortably",
    digitalExperience: "How much do you use smartphone apps?",
    digitalLow: "Rarely or never",
    digitalMedium: "Sometimes",
    digitalHigh: "Often",
    submit: "Start the study",
  },
  conditionIntro: {
    title: "Next: Version {n}",
    body: "You'll now try a different version of the app. Please complete the tasks as you naturally would.",
    continueButton: "Continue",
  },
  taskProfileInfo: {
    instruction: "Please enter your name and choose your craft.",
    nameLabel: "Your name",
    craftLabel: "Your craft",
    craftPlaceholder: "Choose your craft",
    doneButton: "I'm done",
    comprehensionQuestion: "Which craft did you just choose?",
  },
  taskShareProfile: {
    instruction: "Find and tap the button that lets you share your profile.",
    buttonEditProfile: "Edit Profile",
    buttonViewOrders: "View Orders",
    buttonShareProfile: "Share Profile",
    buttonSettings: "Settings",
    comprehensionQuestion: "What does the Share Profile button do?",
    comprehensionCorrect: "Lets other people see your profile link",
    comprehensionWrong1: "Deletes your profile",
    comprehensionWrong2: "Logs you out of the app",
  },
  helpButton: { label: "I need help", hintShown: "Look for the button described above." },
  satisfaction: { question: "How satisfied were you with this way of using the app?" },
  sus: { title: "A few questions about that version", instruction: "Tell us how much you agree with each statement." },
  finalFeedback: {
    title: "Last question",
    preferQuestion: "Which version did you like best?",
    commentsLabel: "Anything else you'd like to tell us? (optional)",
    submit: "Finish",
  },
  debrief: {
    title: "Thank you!",
    body: "That's the end of the study. Thank you for helping us make KarigarSetu easier to use. We'll be in touch using the contact details you provided.",
  },
  common: { next: "Next", version: "Version", of3: "of 3", scaleStronglyDisagree: "Strongly disagree", scaleStronglyAgree: "Strongly agree" },
};

const hi: PilotDictionary = {
  consent: {
    title: "शुरू करने से पहले",
    body: "यह एक छोटा शोध अध्ययन है जो हमें अलग-अलग पढ़ने, भाषा और डिजिटल अनुभव स्तर वाले लोगों के लिए KarigarSetu को बेहतर बनाने में मदद करेगा। आप ऐप के तीन संस्करण आज़माएंगे और प्रत्येक के बारे में कुछ छोटे सवालों के जवाब देंगे। कोई सही या गलत जवाब नहीं है -- हम ऐप का परीक्षण कर रहे हैं, आपका नहीं। आपके जवाब केवल शोध के लिए रखे जाएंगे और इस अध्ययन के बाहर साझा नहीं किए जाएंगे। आप किसी भी समय रुक सकते हैं।",
    agree: "मैं भाग लेने के लिए सहमत हूं",
  },
  intake: {
    title: "आपके बारे में थोड़ा",
    fullName: "पूरा नाम",
    contact: "फ़ोन नंबर या ईमेल",
    contactHint: "केवल इस अध्ययन के बारे में आपसे संपर्क करने के लिए उपयोग किया जाएगा, जैसे मुआवज़े के लिए।",
    gender: "लिंग",
    genderFemale: "महिला",
    genderMale: "पुरुष",
    genderOther: "अन्य",
    genderPreferNot: "बताना नहीं चाहते",
    ageGroup: "आयु समूह",
    language: "आप किस भाषा का उपयोग करना चाहेंगे?",
    literacyLevel: "पढ़ने में आप कितना सहज महसूस करते हैं?",
    literacyLow: "मुझे पढ़ना मुश्किल लगता है",
    literacyMedium: "मैं पढ़ सकता/सकती हूं, पर धीरे-धीरे",
    literacyHigh: "मैं आराम से पढ़ लेता/लेती हूं",
    digitalExperience: "आप स्मार्टफोन ऐप्स का कितना उपयोग करते हैं?",
    digitalLow: "शायद ही कभी या कभी नहीं",
    digitalMedium: "कभी-कभी",
    digitalHigh: "अक्सर",
    submit: "अध्ययन शुरू करें",
  },
  conditionIntro: {
    title: "अगला: संस्करण {n}",
    body: "अब आप ऐप का एक अलग संस्करण आज़माएंगे। कृपया कार्यों को उसी तरह पूरा करें जैसे आप स्वाभाविक रूप से करते हैं।",
    continueButton: "जारी रखें",
  },
  taskProfileInfo: {
    instruction: "कृपया अपना नाम दर्ज करें और अपना शिल्प चुनें।",
    nameLabel: "आपका नाम",
    craftLabel: "आपका शिल्प",
    craftPlaceholder: "अपना शिल्प चुनें",
    doneButton: "मैं पूरा कर चुका/चुकी हूं",
    comprehensionQuestion: "आपने अभी कौन सा शिल्प चुना?",
  },
  taskShareProfile: {
    instruction: "वह बटन खोजें और दबाएं जिससे आप अपनी प्रोफ़ाइल साझा कर सकें।",
    buttonEditProfile: "प्रोफ़ाइल संपादित करें",
    buttonViewOrders: "ऑर्डर देखें",
    buttonShareProfile: "प्रोफ़ाइल साझा करें",
    buttonSettings: "सेटिंग्स",
    comprehensionQuestion: "\"प्रोफ़ाइल साझा करें\" बटन क्या करता है?",
    comprehensionCorrect: "दूसरे लोगों को आपकी प्रोफ़ाइल का लिंक देखने देता है",
    comprehensionWrong1: "आपकी प्रोफ़ाइल हटा देता है",
    comprehensionWrong2: "आपको ऐप से लॉग आउट कर देता है",
  },
  helpButton: { label: "मुझे मदद चाहिए", hintShown: "ऊपर बताए गए बटन को खोजें।" },
  satisfaction: { question: "ऐप उपयोग करने के इस तरीके से आप कितने संतुष्ट थे?" },
  sus: { title: "उस संस्करण के बारे में कुछ सवाल", instruction: "बताएं कि आप हर बयान से कितना सहमत हैं।" },
  finalFeedback: {
    title: "आखिरी सवाल",
    preferQuestion: "आपको कौन सा संस्करण सबसे अच्छा लगा?",
    commentsLabel: "क्या आप हमें और कुछ बताना चाहेंगे? (वैकल्पिक)",
    submit: "समाप्त करें",
  },
  debrief: {
    title: "धन्यवाद!",
    body: "अध्ययन यहीं समाप्त होता है। KarigarSetu को उपयोग करने में आसान बनाने में हमारी मदद करने के लिए धन्यवाद। हम आपके दिए गए संपर्क विवरण का उपयोग करके आपसे संपर्क करेंगे।",
  },
  common: { next: "अगला", version: "संस्करण", of3: "में से 3", scaleStronglyDisagree: "पूरी तरह असहमत", scaleStronglyAgree: "पूरी तरह सहमत" },
};

const bn: PilotDictionary = {
  consent: {
    title: "শুরু করার আগে",
    body: "এটি একটি ছোট গবেষণা যা বিভিন্ন পড়ার, ভাষার এবং ডিজিটাল অভিজ্ঞতার স্তরের মানুষদের জন্য KarigarSetu-কে আরও ভালো করতে সাহায্য করবে। আপনি অ্যাপের তিনটি সংস্করণ ব্যবহার করে দেখবেন এবং প্রতিটি সম্পর্কে কয়েকটি ছোট প্রশ্নের উত্তর দেবেন। কোনো সঠিক বা ভুল উত্তর নেই -- আমরা অ্যাপটি পরীক্ষা করছি, আপনাকে নয়। আপনার উত্তরগুলি শুধুমাত্র গবেষণার জন্য রাখা হবে এবং এই গবেষণার বাইরে শেয়ার করা হবে না। আপনি যেকোনো সময় থামতে পারেন।",
    agree: "আমি অংশ নিতে সম্মত",
  },
  intake: {
    title: "আপনার সম্পর্কে কিছুটা",
    fullName: "পুরো নাম",
    contact: "ফোন নম্বর বা ইমেইল",
    contactHint: "শুধুমাত্র এই গবেষণা সম্পর্কে আপনার সাথে যোগাযোগ করতে ব্যবহৃত হবে, যেমন ক্ষতিপূরণের জন্য।",
    gender: "লিঙ্গ",
    genderFemale: "নারী",
    genderMale: "পুরুষ",
    genderOther: "অন্যান্য",
    genderPreferNot: "বলতে চাই না",
    ageGroup: "বয়স গ্রুপ",
    language: "আপনি কোন ভাষা ব্যবহার করতে চান?",
    literacyLevel: "পড়তে আপনি কতটা স্বাচ্ছন্দ্য বোধ করেন?",
    literacyLow: "আমার পড়তে অসুবিধা হয়",
    literacyMedium: "আমি পড়তে পারি, তবে ধীরে ধীরে",
    literacyHigh: "আমি স্বচ্ছন্দে পড়তে পারি",
    digitalExperience: "আপনি কতটা স্মার্টফোন অ্যাপ ব্যবহার করেন?",
    digitalLow: "খুব কমই বা কখনো না",
    digitalMedium: "মাঝে মাঝে",
    digitalHigh: "প্রায়ই",
    submit: "গবেষণা শুরু করুন",
  },
  conditionIntro: {
    title: "পরবর্তী: সংস্করণ {n}",
    body: "আপনি এখন অ্যাপের একটি ভিন্ন সংস্করণ ব্যবহার করে দেখবেন। অনুগ্রহ করে স্বাভাবিকভাবে কাজগুলো সম্পূর্ণ করুন।",
    continueButton: "চালিয়ে যান",
  },
  taskProfileInfo: {
    instruction: "অনুগ্রহ করে আপনার নাম লিখুন এবং আপনার কারুশিল্প বেছে নিন।",
    nameLabel: "আপনার নাম",
    craftLabel: "আপনার কারুশিল্প",
    craftPlaceholder: "আপনার কারুশিল্প বেছে নিন",
    doneButton: "আমি শেষ করেছি",
    comprehensionQuestion: "আপনি এইমাত্র কোন কারুশিল্প বেছে নিলেন?",
  },
  taskShareProfile: {
    instruction: "যে বাটনটি দিয়ে আপনি আপনার প্রোফাইল শেয়ার করতে পারবেন সেটি খুঁজে ট্যাপ করুন।",
    buttonEditProfile: "প্রোফাইল সম্পাদনা করুন",
    buttonViewOrders: "অর্ডার দেখুন",
    buttonShareProfile: "প্রোফাইল শেয়ার করুন",
    buttonSettings: "সেটিংস",
    comprehensionQuestion: "\"প্রোফাইল শেয়ার করুন\" বাটনটি কী করে?",
    comprehensionCorrect: "অন্যদের আপনার প্রোফাইলের লিঙ্ক দেখতে দেয়",
    comprehensionWrong1: "আপনার প্রোফাইল মুছে ফেলে",
    comprehensionWrong2: "আপনাকে অ্যাপ থেকে লগ আউট করে দেয়",
  },
  helpButton: { label: "আমার সাহায্য দরকার", hintShown: "উপরে বর্ণিত বাটনটি খুঁজুন।" },
  satisfaction: { question: "অ্যাপ ব্যবহারের এই পদ্ধতিতে আপনি কতটা সন্তুষ্ট ছিলেন?" },
  sus: { title: "সেই সংস্করণ সম্পর্কে কয়েকটি প্রশ্ন", instruction: "প্রতিটি বক্তব্যের সাথে আপনি কতটা একমত তা বলুন।" },
  finalFeedback: {
    title: "শেষ প্রশ্ন",
    preferQuestion: "আপনার কোন সংস্করণটি সবচেয়ে ভালো লেগেছে?",
    commentsLabel: "আপনি কি আমাদের আর কিছু বলতে চান? (ঐচ্ছিক)",
    submit: "শেষ করুন",
  },
  debrief: {
    title: "ধন্যবাদ!",
    body: "গবেষণা এখানেই শেষ। KarigarSetu ব্যবহার করা সহজ করতে আমাদের সাহায্য করার জন্য ধন্যবাদ। আপনার দেওয়া যোগাযোগের বিবরণ ব্যবহার করে আমরা আপনার সাথে যোগাযোগ করব।",
  },
  common: { next: "পরবর্তী", version: "সংস্করণ", of3: "৩ এর মধ্যে", scaleStronglyDisagree: "একেবারেই একমত নই", scaleStronglyAgree: "সম্পূর্ণ একমত" },
};

const PILOT_DICTIONARIES = { en, hi, bn };

export function getPilotDictionary(locale: "en" | "hi" | "bn"): PilotDictionary {
  return PILOT_DICTIONARIES[locale];
}

export function formatPilot(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
