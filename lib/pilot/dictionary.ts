export interface PilotDictionary {
  landing: {
    title: string;
    intro: string;
    purposeLabel: string;
    purposeText: string;
    stepsLabel: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    durationLabel: string;
    durationText: string;
    confidentialityLabel: string;
    confidentialityText: string;
    voluntaryLabel: string;
    voluntaryText: string;
    continueButton: string;
  };
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
  landing: {
    title: "About this study",
    intro: "We're inviting you to take part in a short research study for KarigarSetu, a platform for craftsmen like you.",
    purposeLabel: "Why we're doing this",
    purposeText: "We want to make this app easy to use for everyone, whatever your reading level, language, or experience with phones and apps. Your feedback helps us find what works and what doesn't.",
    stepsLabel: "What you'll do",
    step1: "Answer a few short questions about yourself",
    step2: "Try three different versions of the app, one after another",
    step3: "Answer a few short questions after each version",
    step4: "Share your overall opinion at the end",
    durationLabel: "How long it takes",
    durationText: "About 15 to 20 minutes in total.",
    confidentialityLabel: "Your information",
    confidentialityText: "Your answers are used only for this research and are not shared outside the study. There are no right or wrong answers -- we are testing the app, not you.",
    voluntaryLabel: "Your choice",
    voluntaryText: "Taking part is entirely voluntary. You can stop at any time, for any reason.",
    continueButton: "Continue",
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
  landing: {
    title: "इस अध्ययन के बारे में",
    intro: "हम आपको KarigarSetu, कारीगरों के लिए एक मंच, के लिए एक छोटे शोध अध्ययन में भाग लेने के लिए आमंत्रित कर रहे हैं।",
    purposeLabel: "हम यह क्यों कर रहे हैं",
    purposeText: "हम चाहते हैं कि यह ऐप हर किसी के लिए उपयोग करना आसान हो, चाहे आपका पढ़ने का स्तर, भाषा, या फोन और ऐप्स का अनुभव कुछ भी हो। आपकी प्रतिक्रिया हमें यह जानने में मदद करती है कि क्या काम करता है और क्या नहीं।",
    stepsLabel: "आप क्या करेंगे",
    step1: "अपने बारे में कुछ छोटे सवालों के जवाब दें",
    step2: "ऐप के तीन अलग-अलग संस्करण एक के बाद एक आज़माएं",
    step3: "प्रत्येक संस्करण के बाद कुछ छोटे सवालों के जवाब दें",
    step4: "अंत में अपनी समग्र राय साझा करें",
    durationLabel: "इसमें कितना समय लगेगा",
    durationText: "कुल मिलाकर लगभग 15 से 20 मिनट।",
    confidentialityLabel: "आपकी जानकारी",
    confidentialityText: "आपके जवाब केवल इस शोध के लिए उपयोग किए जाते हैं और अध्ययन के बाहर साझा नहीं किए जाते। कोई सही या गलत जवाब नहीं है -- हम ऐप का परीक्षण कर रहे हैं, आपका नहीं।",
    voluntaryLabel: "आपकी पसंद",
    voluntaryText: "भाग लेना पूरी तरह से स्वैच्छिक है। आप किसी भी समय, किसी भी कारण से रुक सकते हैं।",
    continueButton: "जारी रखें",
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
  landing: {
    title: "এই গবেষণা সম্পর্কে",
    intro: "আমরা আপনাকে KarigarSetu, কারিগরদের জন্য একটি প্ল্যাটফর্ম, নিয়ে একটি ছোট গবেষণায় অংশ নেওয়ার জন্য আমন্ত্রণ জানাচ্ছি।",
    purposeLabel: "আমরা কেন এটি করছি",
    purposeText: "আমরা চাই এই অ্যাপটি সবার জন্য ব্যবহার করা সহজ হোক, আপনার পড়ার দক্ষতা, ভাষা, বা ফোন এবং অ্যাপ ব্যবহারের অভিজ্ঞতা যাই হোক না কেন। আপনার মতামত আমাদের বুঝতে সাহায্য করে কী কাজ করে এবং কী করে না।",
    stepsLabel: "আপনি যা করবেন",
    step1: "নিজের সম্পর্কে কয়েকটি ছোট প্রশ্নের উত্তর দিন",
    step2: "অ্যাপের তিনটি ভিন্ন সংস্করণ একে একে ব্যবহার করে দেখুন",
    step3: "প্রতিটি সংস্করণের পরে কয়েকটি ছোট প্রশ্নের উত্তর দিন",
    step4: "শেষে আপনার সামগ্রিক মতামত জানান",
    durationLabel: "এতে কত সময় লাগবে",
    durationText: "মোট প্রায় ১৫ থেকে ২০ মিনিট।",
    confidentialityLabel: "আপনার তথ্য",
    confidentialityText: "আপনার উত্তরগুলি শুধুমাত্র এই গবেষণার জন্য ব্যবহৃত হয় এবং গবেষণার বাইরে শেয়ার করা হয় না। কোনো সঠিক বা ভুল উত্তর নেই -- আমরা অ্যাপটি পরীক্ষা করছি, আপনাকে নয়।",
    voluntaryLabel: "আপনার সিদ্ধান্ত",
    voluntaryText: "অংশগ্রহণ সম্পূর্ণভাবে ঐচ্ছিক। আপনি যেকোনো সময়, যেকোনো কারণে থামতে পারেন।",
    continueButton: "চালিয়ে যান",
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
