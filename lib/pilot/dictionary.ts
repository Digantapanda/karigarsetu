// Pilot-specific UI text (labels, instructions, option text) in all three
// languages. Validated-instrument item wording itself lives in
// lib/pilot/instruments.ts and lib/pilot/sus.ts, not here -- this file is
// for surrounding UI chrome: section titles, field labels, button text.
// Translations of that surrounding text are working drafts for pilot use,
// not officially validated translations (see instruments.ts).

export interface PilotDictionary {
  landing: {
    title: string; intro: string;
    purposeLabel: string; purposeText: string;
    stepsLabel: string; step1: string; step2: string; step3: string; step4: string;
    durationLabel: string; durationText: string;
    confidentialityLabel: string; confidentialityText: string;
    voluntaryLabel: string; voluntaryText: string;
    interviewLanguageLabel: string;
    preferredLanguageLabel: string;
    preferredLanguageHint: string;
    continueButton: string;
  };
  intake: {
    title: string;
    participantInfoTitle: string;
    deviceLabel: string; deviceMobile: string; deviceDesktop: string;
    fullName: string; contact: string; contactHint: string;

    sectionA: string;
    ageLabel: string;
    genderLabel: string; genderMan: string; genderWoman: string; genderNonBinary: string;
    genderSelfDescribe: string; genderSelfDescribePlaceholder: string; genderPreferNot: string;
    educationLabel: string;
    educationNoFormal: string; educationPrimary: string; educationMiddle: string;
    educationSecondary: string; educationHigherSecondary: string; educationDiplomaIti: string;
    educationUndergrad: string; educationPostgradPlus: string;
    occupationLabel: string;
    occupationStudent: string; occupationSalaried: string; occupationSelfEmployed: string;
    occupationFarmer: string; occupationDailyWage: string; occupationHomemaker: string;
    occupationRetired: string; occupationUnemployed: string; occupationOther: string;
    occupationOtherPlaceholder: string;
    residenceLabel: string; residenceRural: string; residenceSemiUrban: string; residenceUrban: string;
    primaryLanguageLabel: string; otherLanguagesLabel: string; preferredLanguageTaskLabel: string;

    sectionB: string;
    b1: string; b2: string; b3: string;
    readWriteScale1Read: string; readWriteScale1Write: string;
    readWriteScale2: string; readWriteScale3: string; readWriteScale4: string; readWriteScale5: string;
    understandScale1: string; understandScale2: string; understandScale3: string; understandScale4: string; understandScale5: string;

    sectionC: string;
    c1: string; c1Opt1: string; c1Opt2: string; c1Opt3: string; c1Opt4: string;
    c2: string; c2Opt1: string; c2Opt2: string; c2Opt3: string; c2Opt4: string;
    c3: string; c3Opt1: string; c3Opt2: string; c3Opt3: string;
    c4: string; c4Opt1: string; c4Opt2: string; c4Opt3: string; c4Opt4: string; c4Opt5: string;

    sectionD: string; sectionDInstruction: string;
    dScale0: string; dScale1: string; dScale2: string; dScale3: string; dScale4: string;

    sectionE: string;

    sectionF: string; who5Title: string; who5Instruction: string;
    who5Scale0: string; who5Scale1: string; who5Scale2: string; who5Scale3: string; who5Scale4: string; who5Scale5: string;
    swlsTitle: string; swlsInstruction: string;

    sectionG: string; g1: string;
    happyVeryUnhappy: string; happyUnhappy: string; happyNeutral: string; happyHappy: string; happyVeryHappy: string;

    submit: string;
  };

  conditionIntro: { title: string; body: string; continueButton: string };

  postTask: {
    tlxTitle: string; tlxInstruction: string; tlxLowLabel: string; tlxHighLabel: string;
    comprehensionTitle: string;
    satisfactionTitle: string;
    k1: string; k2: string; k3: string;
    satisfactionScale1: string; satisfactionScale2: string; satisfactionScale3: string; satisfactionScale4: string; satisfactionScale5: string;
    postHappinessLabel: string;
  };

  helpButton: { label: string; hintShown: string };
  sus: { title: string; instruction: string };

  finalFeedback: {
    title: string;
    m1Question: string; m1TextOnly: string; m1TextAudio: string; m1TextAudioIcons: string; m1NoPreference: string;
    m2Question: string; m2Text: string; m2Audio: string; m2Icons: string; m2Combination: string; m2None: string;
    m3Question: string;
    m4Question: string;
    submit: string;
  };
  debrief: { title: string; body: string };
  common: {
    next: string; back: string; version: string; of3: string;
    scaleStronglyDisagree: string; scaleStronglyAgree: string;
    optional: string;
  };

  // Real-app pilot task instructions (tasks run on the live app, not standalone screens)
  liveTasks: {
    task1Instruction: string;
    task2Instruction: string;
    task3Instruction: string;
    task4Instruction: string;
    orderAccept: string;
    orderDecline: string;
    taskDoneButton: string;
  };
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
    durationText: "About 20 to 25 minutes in total.",
    confidentialityLabel: "Your information",
    confidentialityText: "Your answers are used only for this research and are not shared outside the study. There are no right or wrong answers -- we are testing the app, not you.",
    voluntaryLabel: "Your choice",
    voluntaryText: "Taking part is entirely voluntary. You can stop at any time, for any reason.",
    interviewLanguageLabel: "Language for this session",
    preferredLanguageLabel: "What language would you prefer, in general?",
    preferredLanguageHint: "This can be different from the language used in this session.",
    continueButton: "Continue",
  },
  intake: {
    title: "A little about you",
    participantInfoTitle: "Participant information",
    deviceLabel: "Device you're using today", deviceMobile: "Mobile", deviceDesktop: "Desktop/laptop",
    fullName: "Full name", contact: "Phone number or email",
    contactHint: "Used only to contact you about this study, e.g. for compensation.",

    sectionA: "About you",
    ageLabel: "Age",
    genderLabel: "Gender", genderMan: "Man", genderWoman: "Woman", genderNonBinary: "Non-binary / third gender",
    genderSelfDescribe: "Self-describe", genderSelfDescribePlaceholder: "Please describe", genderPreferNot: "Prefer not to say",
    educationLabel: "Highest level of education completed",
    educationNoFormal: "No formal schooling", educationPrimary: "Primary", educationMiddle: "Middle",
    educationSecondary: "Secondary", educationHigherSecondary: "Higher secondary", educationDiplomaIti: "Diploma / ITI",
    educationUndergrad: "Undergraduate", educationPostgradPlus: "Postgraduate or higher",
    occupationLabel: "Occupation",
    occupationStudent: "Student", occupationSalaried: "Salaried employee", occupationSelfEmployed: "Self-employed / business",
    occupationFarmer: "Farmer / agricultural worker", occupationDailyWage: "Daily-wage worker", occupationHomemaker: "Homemaker",
    occupationRetired: "Retired", occupationUnemployed: "Unemployed", occupationOther: "Other",
    occupationOtherPlaceholder: "Please specify",
    residenceLabel: "Place of residence", residenceRural: "Rural", residenceSemiUrban: "Semi-urban", residenceUrban: "Urban",
    primaryLanguageLabel: "Primary language", otherLanguagesLabel: "Other languages understood",
    preferredLanguageTaskLabel: "Preferred language for the task",

    sectionB: "Reading and writing",
    b1: "How comfortable are you reading information on your own?",
    b2: "How comfortable are you writing on your own?",
    b3: "How easy is it for you to understand written information on a digital device?",
    readWriteScale1Read: "Cannot read", readWriteScale1Write: "Cannot write",
    readWriteScale2: "A few words", readWriteScale3: "Simple sentences",
    readWriteScale4: "Most everyday information", readWriteScale5: "Complex information",
    understandScale1: "Very difficult", understandScale2: "Difficult", understandScale3: "Neither",
    understandScale4: "Easy", understandScale5: "Very easy",

    sectionC: "Access to phones and internet",
    c1: "Broadband/Internet access",
    c1Opt1: "Yes, personal connection", c1Opt2: "Yes, shared connection", c1Opt3: "Access elsewhere", c1Opt4: "No regular access",
    c2: "Access to mobile phone",
    c2Opt1: "No access", c2Opt2: "Basic/keypad phone", c2Opt3: "Smartphone", c2Opt4: "Both",
    c3: "Is the phone you normally use exclusively yours?",
    c3Opt1: "Yes", c3Opt2: "No, shared with family", c3Opt3: "No, I borrow someone else's phone",
    c4: "Frequency of internet use",
    c4Opt1: "Never", c4Opt2: "Less than once a week", c4Opt3: "Several times a week", c4Opt4: "Daily", c4Opt5: "Several times a day",

    sectionD: "Digital familiarity",
    sectionDInstruction: "For each activity, tell us how confident you are doing it.",
    dScale0: "Never done", dScale1: "Need someone else to do it", dScale2: "Can do with help",
    dScale3: "Can usually do independently", dScale4: "Can do confidently and independently",

    sectionE: "Confidence with digital devices",

    sectionF: "How you've been feeling",
    who5Title: "Over the last two weeks",
    who5Instruction: "For each statement, tell us how much of the time it applied to you.",
    who5Scale0: "At no time", who5Scale1: "Some of the time", who5Scale2: "Less than half the time",
    who5Scale3: "More than half the time", who5Scale4: "Most of the time", who5Scale5: "All of the time",
    swlsTitle: "In general",
    swlsInstruction: "Tell us how much you agree with each statement (1 = strongly disagree, 7 = strongly agree).",

    sectionG: "Right now",
    g1: "How do you feel right now, before completing the task?",
    happyVeryUnhappy: "Very unhappy", happyUnhappy: "Unhappy", happyNeutral: "Neither",
    happyHappy: "Happy", happyVeryHappy: "Very happy",

    submit: "Start the study",
  },
  conditionIntro: {
    title: "Next: Version {n}",
    body: "You'll now try a different version of the app. Please complete the tasks as you naturally would.",
    continueButton: "Continue",
  },
  postTask: {
    tlxTitle: "About the effort involved",
    tlxInstruction: "For each of the following, rate from 0 (very low) to 100 (very high).",
    tlxLowLabel: "Very low", tlxHighLabel: "Very high",
    comprehensionTitle: "About understanding the tasks",
    satisfactionTitle: "About your satisfaction",
    k1: "How satisfied are you with your experience using this interface?",
    k2: "I would like to use this interface again.",
    k3: "I would recommend this type of interface to someone who has limited experience using digital technology.",
    satisfactionScale1: "Very dissatisfied / Strongly disagree", satisfactionScale2: "Dissatisfied / Disagree",
    satisfactionScale3: "Neither", satisfactionScale4: "Satisfied / Agree", satisfactionScale5: "Very satisfied / Strongly agree",
    postHappinessLabel: "How do you feel right now, after completing the tasks?",
  },
  helpButton: { label: "I need help", hintShown: "Look for the button described above." },
  sus: { title: "A few questions about that version", instruction: "Tell us how much you agree with each statement." },
  finalFeedback: {
    title: "Last questions",
    m1Question: "Which interface would you prefer for similar tasks?",
    m1TextOnly: "Text only", m1TextAudio: "Text + Audio", m1TextAudioIcons: "Text + Audio + Icons", m1NoPreference: "No preference",
    m2Question: "Which component helped you the most?",
    m2Text: "Text", m2Audio: "Audio", m2Icons: "Icons / pictures", m2Combination: "Combination", m2None: "None",
    m3Question: "What was the most difficult part of the interface?",
    m4Question: "What would make the interface easier for you?",
    submit: "Finish",
  },
  debrief: {
    title: "Thank you!",
    body: "That's the end of the study. Thank you for helping us make KarigarSetu easier to use. We'll be in touch using the contact details you provided.",
  },
  common: { next: "Next", back: "Back", version: "Version", of3: "of 3", scaleStronglyDisagree: "Strongly disagree", scaleStronglyAgree: "Strongly agree", optional: "(optional)" },
  liveTasks: {
    task1Instruction: "You'll see your dashboard. Take a moment to look around.",
    task2Instruction: "Find \"My Products\" and add a new product.",
    task3Instruction: "Go to view your profile, then share it by mail.",
    task4Instruction: "Go to view your orders. One order should be accepted, and one declined.",
    orderAccept: "Accept",
    orderDecline: "Decline",
    taskDoneButton: "I'm done",
  },
};

const hi: PilotDictionary = {
  landing: {
    title: "इस अध्ययन के बारे में",
    intro: "हम आपको KarigarSetu, कारीगरों के लिए एक मंच, के लिए एक छोटे शोध अध्ययन में भाग लेने के लिए आमंत्रित कर रहे हैं।",
    purposeLabel: "हम यह क्यों कर रहे हैं",
    purposeText: "हम चाहते हैं कि यह ऐप हर किसी के लिए उपयोग करना आसान हो, चाहे आपका पढ़ने का स्तर, भाषा, या फोन और ऐप्स का अनुभव कुछ भी हो।",
    stepsLabel: "आप क्या करेंगे",
    step1: "अपने बारे में कुछ छोटे सवालों के जवाब दें",
    step2: "ऐप के तीन अलग-अलग संस्करण एक के बाद एक आज़माएं",
    step3: "प्रत्येक संस्करण के बाद कुछ छोटे सवालों के जवाब दें",
    step4: "अंत में अपनी समग्र राय साझा करें",
    durationLabel: "इसमें कितना समय लगेगा",
    durationText: "कुल मिलाकर लगभग 20 से 25 मिनट।",
    confidentialityLabel: "आपकी जानकारी",
    confidentialityText: "आपके जवाब केवल इस शोध के लिए उपयोग किए जाते हैं। कोई सही या गलत जवाब नहीं है।",
    voluntaryLabel: "आपकी पसंद",
    voluntaryText: "भाग लेना पूरी तरह से स्वैच्छिक है। आप किसी भी समय रुक सकते हैं।",
    interviewLanguageLabel: "इस सत्र के लिए भाषा",
    preferredLanguageLabel: "सामान्य तौर पर आप कौन सी भाषा पसंद करेंगे?",
    preferredLanguageHint: "यह इस सत्र में उपयोग की गई भाषा से भिन्न हो सकती है।",
    continueButton: "जारी रखें",
  },
  intake: {
    title: "आपके बारे में थोड़ा",
    participantInfoTitle: "प्रतिभागी जानकारी",
    deviceLabel: "आज आप जिस डिवाइस का उपयोग कर रहे हैं", deviceMobile: "मोबाइल", deviceDesktop: "डेस्कटॉप/लैपटॉप",
    fullName: "पूरा नाम", contact: "फ़ोन नंबर या ईमेल",
    contactHint: "केवल इस अध्ययन के बारे में आपसे संपर्क करने के लिए उपयोग किया जाएगा।",

    sectionA: "आपके बारे में",
    ageLabel: "आयु",
    genderLabel: "लिंग", genderMan: "पुरुष", genderWoman: "महिला", genderNonBinary: "नॉन-बाइनरी / तीसरा लिंग",
    genderSelfDescribe: "स्वयं बताएं", genderSelfDescribePlaceholder: "कृपया बताएं", genderPreferNot: "बताना नहीं चाहते",
    educationLabel: "पूर्ण की गई उच्चतम शिक्षा",
    educationNoFormal: "कोई औपचारिक शिक्षा नहीं", educationPrimary: "प्राथमिक", educationMiddle: "मध्य",
    educationSecondary: "माध्यमिक", educationHigherSecondary: "उच्च माध्यमिक", educationDiplomaIti: "डिप्लोमा / आईटीआई",
    educationUndergrad: "स्नातक", educationPostgradPlus: "स्नातकोत्तर या उच्चतर",
    occupationLabel: "व्यवसाय",
    occupationStudent: "छात्र", occupationSalaried: "वेतनभोगी कर्मचारी", occupationSelfEmployed: "स्वरोजगार / व्यवसाय",
    occupationFarmer: "किसान / कृषि कार्यकर्ता", occupationDailyWage: "दैनिक-मजदूरी कार्यकर्ता", occupationHomemaker: "गृहिणी",
    occupationRetired: "सेवानिवृत्त", occupationUnemployed: "बेरोज़गार", occupationOther: "अन्य",
    occupationOtherPlaceholder: "कृपया बताएं",
    residenceLabel: "निवास स्थान", residenceRural: "ग्रामीण", residenceSemiUrban: "अर्ध-शहरी", residenceUrban: "शहरी",
    primaryLanguageLabel: "मुख्य भाषा", otherLanguagesLabel: "समझी जाने वाली अन्य भाषाएं",
    preferredLanguageTaskLabel: "कार्य के लिए पसंदीदा भाषा",

    sectionB: "पढ़ना और लिखना",
    b1: "आप स्वयं जानकारी पढ़ने में कितना सहज महसूस करते हैं?",
    b2: "आप स्वयं लिखने में कितना सहज महसूस करते हैं?",
    b3: "डिजिटल डिवाइस पर लिखित जानकारी समझना आपके लिए कितना आसान है?",
    readWriteScale1Read: "पढ़ नहीं सकते", readWriteScale1Write: "लिख नहीं सकते",
    readWriteScale2: "कुछ शब्द", readWriteScale3: "सरल वाक्य",
    readWriteScale4: "अधिकांश रोज़मर्रा की जानकारी", readWriteScale5: "जटिल जानकारी",
    understandScale1: "बहुत कठिन", understandScale2: "कठिन", understandScale3: "न तो",
    understandScale4: "आसान", understandScale5: "बहुत आसान",

    sectionC: "फोन और इंटरनेट तक पहुंच",
    c1: "ब्रॉडबैंड/इंटरनेट पहुंच",
    c1Opt1: "हां, व्यक्तिगत कनेक्शन", c1Opt2: "हां, साझा कनेक्शन", c1Opt3: "कहीं और पहुंच", c1Opt4: "कोई नियमित पहुंच नहीं",
    c2: "मोबाइल फोन तक पहुंच",
    c2Opt1: "कोई पहुंच नहीं", c2Opt2: "बेसिक/कीपैड फोन", c2Opt3: "स्मार्टफोन", c2Opt4: "दोनों",
    c3: "क्या आप जो फोन सामान्यतः उपयोग करते हैं वह पूरी तरह आपका है?",
    c3Opt1: "हां", c3Opt2: "नहीं, परिवार के साथ साझा", c3Opt3: "नहीं, मैं किसी और का फोन उधार लेता/लेती हूं",
    c4: "इंटरनेट उपयोग की आवृत्ति",
    c4Opt1: "कभी नहीं", c4Opt2: "सप्ताह में एक बार से कम", c4Opt3: "सप्ताह में कई बार", c4Opt4: "प्रतिदिन", c4Opt5: "दिन में कई बार",

    sectionD: "डिजिटल परिचय",
    sectionDInstruction: "प्रत्येक गतिविधि के लिए, बताएं कि आप इसे करने में कितना आश्वस्त महसूस करते हैं।",
    dScale0: "कभी नहीं किया", dScale1: "किसी और की मदद चाहिए", dScale2: "मदद से कर सकते हैं",
    dScale3: "आमतौर पर स्वतंत्र रूप से कर सकते हैं", dScale4: "आत्मविश्वास से और स्वतंत्र रूप से कर सकते हैं",

    sectionE: "डिजिटल डिवाइस में आत्मविश्वास",

    sectionF: "आप कैसा महसूस कर रहे हैं",
    who5Title: "पिछले दो हफ्तों में",
    who5Instruction: "प्रत्येक कथन के लिए, बताएं कि यह आप पर कितने समय लागू हुआ।",
    who5Scale0: "कभी नहीं", who5Scale1: "कुछ समय", who5Scale2: "आधे से कम समय",
    who5Scale3: "आधे से अधिक समय", who5Scale4: "अधिकांश समय", who5Scale5: "हर समय",
    swlsTitle: "सामान्य तौर पर",
    swlsInstruction: "बताएं कि आप हर बयान से कितना सहमत हैं (1 = पूरी तरह असहमत, 7 = पूरी तरह सहमत)।",

    sectionG: "अभी",
    g1: "कार्य पूरा करने से पहले, अभी आप कैसा महसूस कर रहे हैं?",
    happyVeryUnhappy: "बहुत दुखी", happyUnhappy: "दुखी", happyNeutral: "न तो",
    happyHappy: "खुश", happyVeryHappy: "बहुत खुश",

    submit: "अध्ययन शुरू करें",
  },
  conditionIntro: {
    title: "अगला: संस्करण {n}",
    body: "अब आप ऐप का एक अलग संस्करण आज़माएंगे। कृपया कार्यों को उसी तरह पूरा करें जैसे आप स्वाभाविक रूप से करते हैं।",
    continueButton: "जारी रखें",
  },
  postTask: {
    tlxTitle: "इसमें लगे प्रयास के बारे में",
    tlxInstruction: "निम्नलिखित में से प्रत्येक के लिए, 0 (बहुत कम) से 100 (बहुत अधिक) तक रेटिंग दें।",
    tlxLowLabel: "बहुत कम", tlxHighLabel: "बहुत अधिक",
    comprehensionTitle: "कार्यों को समझने के बारे में",
    satisfactionTitle: "आपकी संतुष्टि के बारे में",
    k1: "इस इंटरफ़ेस का उपयोग करने के अपने अनुभव से आप कितने संतुष्ट हैं?",
    k2: "मैं इस इंटरफ़ेस का फिर से उपयोग करना चाहूंगा/चाहूंगी।",
    k3: "मैं इस प्रकार के इंटरफ़ेस की सिफारिश उस व्यक्ति को करूंगा/करूंगी जिसे डिजिटल तकनीक का सीमित अनुभव है।",
    satisfactionScale1: "बहुत असंतुष्ट / पूरी तरह असहमत", satisfactionScale2: "असंतुष्ट / असहमत",
    satisfactionScale3: "न तो", satisfactionScale4: "संतुष्ट / सहमत", satisfactionScale5: "बहुत संतुष्ट / पूरी तरह सहमत",
    postHappinessLabel: "कार्य पूरा करने के बाद, अभी आप कैसा महसूस कर रहे हैं?",
  },
  helpButton: { label: "मुझे मदद चाहिए", hintShown: "ऊपर बताए गए बटन को खोजें।" },
  sus: { title: "उस संस्करण के बारे में कुछ सवाल", instruction: "बताएं कि आप हर बयान से कितना सहमत हैं।" },
  finalFeedback: {
    title: "आखिरी सवाल",
    m1Question: "समान कार्यों के लिए आप कौन सा इंटरफ़ेस पसंद करेंगे?",
    m1TextOnly: "केवल टेक्स्ट", m1TextAudio: "टेक्स्ट + ऑडियो", m1TextAudioIcons: "टेक्स्ट + ऑडियो + आइकन", m1NoPreference: "कोई प्राथमिकता नहीं",
    m2Question: "किस घटक ने आपकी सबसे ज्यादा मदद की?",
    m2Text: "टेक्स्ट", m2Audio: "ऑडियो", m2Icons: "आइकन / चित्र", m2Combination: "संयोजन", m2None: "कोई नहीं",
    m3Question: "इंटरफ़ेस का सबसे कठिन हिस्सा क्या था?",
    m4Question: "इंटरफ़ेस को आपके लिए आसान बनाने के लिए क्या किया जा सकता है?",
    submit: "समाप्त करें",
  },
  debrief: {
    title: "धन्यवाद!",
    body: "अध्ययन यहीं समाप्त होता है। धन्यवाद। हम आपके दिए गए संपर्क विवरण का उपयोग करके आपसे संपर्क करेंगे।",
  },
  common: { next: "अगला", back: "पीछे", version: "संस्करण", of3: "में से 3", scaleStronglyDisagree: "पूरी तरह असहमत", scaleStronglyAgree: "पूरी तरह सहमत", optional: "(वैकल्पिक)" },
  liveTasks: {
    task1Instruction: "आप अपना डैशबोर्ड देखेंगे। थोड़ा समय लेकर इसे देखें।",
    task2Instruction: "\"मेरे उत्पाद\" खोजें और एक नया उत्पाद जोड़ें।",
    task3Instruction: "अपनी प्रोफ़ाइल देखें, फिर उसे मेल द्वारा साझा करें।",
    task4Instruction: "अपने ऑर्डर देखें। एक ऑर्डर स्वीकार करें और एक अस्वीकार करें।",
    orderAccept: "स्वीकार करें",
    orderDecline: "अस्वीकार करें",
    taskDoneButton: "मैं पूरा कर चुका/चुकी हूं",
  },
};

const bn: PilotDictionary = {
  landing: {
    title: "এই গবেষণা সম্পর্কে",
    intro: "আমরা আপনাকে KarigarSetu নিয়ে একটি ছোট গবেষণায় অংশ নেওয়ার জন্য আমন্ত্রণ জানাচ্ছি।",
    purposeLabel: "আমরা কেন এটি করছি",
    purposeText: "আমরা চাই এই অ্যাপটি সবার জন্য ব্যবহার করা সহজ হোক, আপনার পড়ার দক্ষতা, ভাষা, বা অভিজ্ঞতা যাই হোক না কেন।",
    stepsLabel: "আপনি যা করবেন",
    step1: "নিজের সম্পর্কে কয়েকটি ছোট প্রশ্নের উত্তর দিন",
    step2: "অ্যাপের তিনটি ভিন্ন সংস্করণ একে একে ব্যবহার করে দেখুন",
    step3: "প্রতিটি সংস্করণের পরে কয়েকটি ছোট প্রশ্নের উত্তর দিন",
    step4: "শেষে আপনার সামগ্রিক মতামত জানান",
    durationLabel: "এতে কত সময় লাগবে",
    durationText: "মোট প্রায় ২০ থেকে ২৫ মিনিট।",
    confidentialityLabel: "আপনার তথ্য",
    confidentialityText: "আপনার উত্তরগুলি শুধুমাত্র এই গবেষণার জন্য ব্যবহৃত হয়। কোনো সঠিক বা ভুল উত্তর নেই।",
    voluntaryLabel: "আপনার সিদ্ধান্ত",
    voluntaryText: "অংশগ্রহণ সম্পূর্ণভাবে ঐচ্ছিক। আপনি যেকোনো সময় থামতে পারেন।",
    interviewLanguageLabel: "এই সেশনের জন্য ভাষা",
    preferredLanguageLabel: "সাধারণভাবে আপনি কোন ভাষা পছন্দ করবেন?",
    preferredLanguageHint: "এটি এই সেশনে ব্যবহৃত ভাষা থেকে ভিন্ন হতে পারে।",
    continueButton: "চালিয়ে যান",
  },
  intake: {
    title: "আপনার সম্পর্কে কিছুটা",
    participantInfoTitle: "অংশগ্রহণকারীর তথ্য",
    deviceLabel: "আজ আপনি যে ডিভাইস ব্যবহার করছেন", deviceMobile: "মোবাইল", deviceDesktop: "ডেস্কটপ/ল্যাপটপ",
    fullName: "পুরো নাম", contact: "ফোন নম্বর বা ইমেইল",
    contactHint: "শুধুমাত্র এই গবেষণা সম্পর্কে যোগাযোগের জন্য ব্যবহৃত হবে।",

    sectionA: "আপনার সম্পর্কে",
    ageLabel: "বয়স",
    genderLabel: "লিঙ্গ", genderMan: "পুরুষ", genderWoman: "নারী", genderNonBinary: "নন-বাইনারি / তৃতীয় লিঙ্গ",
    genderSelfDescribe: "নিজে বর্ণনা করুন", genderSelfDescribePlaceholder: "অনুগ্রহ করে বলুন", genderPreferNot: "বলতে চাই না",
    educationLabel: "সম্পন্ন সর্বোচ্চ শিক্ষা",
    educationNoFormal: "কোনো আনুষ্ঠানিক শিক্ষা নেই", educationPrimary: "প্রাথমিক", educationMiddle: "মাধ্যমিক (মধ্য)",
    educationSecondary: "মাধ্যমিক", educationHigherSecondary: "উচ্চ মাধ্যমিক", educationDiplomaIti: "ডিপ্লোমা / আইটিআই",
    educationUndergrad: "স্নাতক", educationPostgradPlus: "স্নাতকোত্তর বা তার বেশি",
    occupationLabel: "পেশা",
    occupationStudent: "ছাত্র/ছাত্রী", occupationSalaried: "বেতনভুক্ত কর্মচারী", occupationSelfEmployed: "স্ব-নিযুক্ত / ব্যবসা",
    occupationFarmer: "কৃষক / কৃষি শ্রমিক", occupationDailyWage: "দৈনিক-মজুরি শ্রমিক", occupationHomemaker: "গৃহিণী",
    occupationRetired: "অবসরপ্রাপ্ত", occupationUnemployed: "বেকার", occupationOther: "অন্যান্য",
    occupationOtherPlaceholder: "অনুগ্রহ করে উল্লেখ করুন",
    residenceLabel: "বসবাসের স্থান", residenceRural: "গ্রামীণ", residenceSemiUrban: "আধা-শহুরে", residenceUrban: "শহুরে",
    primaryLanguageLabel: "প্রধান ভাষা", otherLanguagesLabel: "বোঝা যায় এমন অন্যান্য ভাষা",
    preferredLanguageTaskLabel: "কাজের জন্য পছন্দের ভাষা",

    sectionB: "পড়া এবং লেখা",
    b1: "নিজে তথ্য পড়তে আপনি কতটা স্বাচ্ছন্দ্য বোধ করেন?",
    b2: "নিজে লিখতে আপনি কতটা স্বাচ্ছন্দ্য বোধ করেন?",
    b3: "একটি ডিজিটাল ডিভাইসে লিখিত তথ্য বোঝা আপনার জন্য কতটা সহজ?",
    readWriteScale1Read: "পড়তে পারি না", readWriteScale1Write: "লিখতে পারি না",
    readWriteScale2: "কয়েকটি শব্দ", readWriteScale3: "সহজ বাক্য",
    readWriteScale4: "বেশিরভাগ দৈনন্দিন তথ্য", readWriteScale5: "জটিল তথ্য",
    understandScale1: "খুব কঠিন", understandScale2: "কঠিন", understandScale3: "মাঝামাঝি",
    understandScale4: "সহজ", understandScale5: "খুব সহজ",

    sectionC: "ফোন এবং ইন্টারনেট অ্যাক্সেস",
    c1: "ব্রডব্যান্ড/ইন্টারনেট অ্যাক্সেস",
    c1Opt1: "হ্যাঁ, ব্যক্তিগত সংযোগ", c1Opt2: "হ্যাঁ, ভাগ করা সংযোগ", c1Opt3: "অন্য জায়গায় অ্যাক্সেস", c1Opt4: "নিয়মিত অ্যাক্সেস নেই",
    c2: "মোবাইল ফোন অ্যাক্সেস",
    c2Opt1: "অ্যাক্সেস নেই", c2Opt2: "সাধারণ/কীপ্যাড ফোন", c2Opt3: "স্মার্টফোন", c2Opt4: "উভয়ই",
    c3: "আপনি সাধারণত যে ফোন ব্যবহার করেন তা কি সম্পূর্ণভাবে আপনার নিজের?",
    c3Opt1: "হ্যাঁ", c3Opt2: "না, পরিবারের সাথে ভাগ করা", c3Opt3: "না, আমি অন্য কারো ফোন ধার নিই",
    c4: "ইন্টারনেট ব্যবহারের ফ্রিকোয়েন্সি",
    c4Opt1: "কখনো না", c4Opt2: "সপ্তাহে একবারের কম", c4Opt3: "সপ্তাহে কয়েকবার", c4Opt4: "প্রতিদিন", c4Opt5: "দিনে কয়েকবার",

    sectionD: "ডিজিটাল পরিচিতি",
    sectionDInstruction: "প্রতিটি কার্যকলাপের জন্য, বলুন আপনি এটি করতে কতটা আত্মবিশ্বাসী।",
    dScale0: "কখনো করিনি", dScale1: "অন্য কারো সাহায্য দরকার", dScale2: "সাহায্য নিয়ে করতে পারি",
    dScale3: "সাধারণত স্বাধীনভাবে করতে পারি", dScale4: "আত্মবিশ্বাসের সাথে ও স্বাধীনভাবে করতে পারি",

    sectionE: "ডিজিটাল ডিভাইসে আত্মবিশ্বাস",

    sectionF: "আপনি কেমন অনুভব করছেন",
    who5Title: "গত দুই সপ্তাহে",
    who5Instruction: "প্রতিটি বক্তব্যের জন্য, বলুন এটি আপনার ক্ষেত্রে কতটা সময় প্রযোজ্য ছিল।",
    who5Scale0: "কখনো না", who5Scale1: "কিছু সময়", who5Scale2: "অর্ধেকেরও কম সময়",
    who5Scale3: "অর্ধেকেরও বেশি সময়", who5Scale4: "বেশিরভাগ সময়", who5Scale5: "সব সময়",
    swlsTitle: "সাধারণভাবে",
    swlsInstruction: "প্রতিটি বক্তব্যের সাথে আপনি কতটা একমত তা বলুন (১ = একেবারেই একমত নই, ৭ = সম্পূর্ণ একমত)।",

    sectionG: "এই মুহূর্তে",
    g1: "কাজ শেষ করার আগে, এই মুহূর্তে আপনি কেমন অনুভব করছেন?",
    happyVeryUnhappy: "খুব অসুখী", happyUnhappy: "অসুখী", happyNeutral: "মাঝামাঝি",
    happyHappy: "খুশি", happyVeryHappy: "খুব খুশি",

    submit: "গবেষণা শুরু করুন",
  },
  conditionIntro: {
    title: "পরবর্তী: সংস্করণ {n}",
    body: "আপনি এখন অ্যাপের একটি ভিন্ন সংস্করণ ব্যবহার করে দেখবেন। অনুগ্রহ করে স্বাভাবিকভাবে কাজগুলো সম্পূর্ণ করুন।",
    continueButton: "চালিয়ে যান",
  },
  postTask: {
    tlxTitle: "এতে যে প্রচেষ্টা লেগেছে সে সম্পর্কে",
    tlxInstruction: "নিম্নলিখিত প্রতিটির জন্য, ০ (খুব কম) থেকে ১০০ (খুব বেশি) পর্যন্ত রেট করুন।",
    tlxLowLabel: "খুব কম", tlxHighLabel: "খুব বেশি",
    comprehensionTitle: "কাজগুলো বোঝা সম্পর্কে",
    satisfactionTitle: "আপনার সন্তুষ্টি সম্পর্কে",
    k1: "এই ইন্টারফেস ব্যবহারের অভিজ্ঞতায় আপনি কতটা সন্তুষ্ট?",
    k2: "আমি আবার এই ইন্টারফেস ব্যবহার করতে চাইব।",
    k3: "আমি এই ধরনের ইন্টারফেস এমন কাউকে সুপারিশ করব যার ডিজিটাল প্রযুক্তির সীমিত অভিজ্ঞতা আছে।",
    satisfactionScale1: "খুব অসন্তুষ্ট / একেবারেই একমত নই", satisfactionScale2: "অসন্তুষ্ট / একমত নই",
    satisfactionScale3: "মাঝামাঝি", satisfactionScale4: "সন্তুষ্ট / একমত", satisfactionScale5: "খুব সন্তুষ্ট / সম্পূর্ণ একমত",
    postHappinessLabel: "কাজ শেষ করার পরে, এখন আপনি কেমন অনুভব করছেন?",
  },
  helpButton: { label: "আমার সাহায্য দরকার", hintShown: "উপরে বর্ণিত বাটনটি খুঁজুন।" },
  sus: { title: "সেই সংস্করণ সম্পর্কে কয়েকটি প্রশ্ন", instruction: "প্রতিটি বক্তব্যের সাথে আপনি কতটা একমত তা বলুন।" },
  finalFeedback: {
    title: "শেষ প্রশ্ন",
    m1Question: "একই ধরনের কাজের জন্য আপনি কোন ইন্টারফেস পছন্দ করবেন?",
    m1TextOnly: "শুধু টেক্সট", m1TextAudio: "টেক্সট + অডিও", m1TextAudioIcons: "টেক্সট + অডিও + আইকন", m1NoPreference: "কোনো পছন্দ নেই",
    m2Question: "কোন উপাদানটি আপনাকে সবচেয়ে বেশি সাহায্য করেছে?",
    m2Text: "টেক্সট", m2Audio: "অডিও", m2Icons: "আইকন / ছবি", m2Combination: "সমন্বয়", m2None: "কোনোটিই না",
    m3Question: "ইন্টারফেসের সবচেয়ে কঠিন অংশ কী ছিল?",
    m4Question: "ইন্টারফেসটি আপনার জন্য সহজ করতে কী করা যেতে পারে?",
    submit: "শেষ করুন",
  },
  debrief: {
    title: "ধন্যবাদ!",
    body: "গবেষণা এখানেই শেষ। ধন্যবাদ। আপনার দেওয়া যোগাযোগের বিবরণ ব্যবহার করে আমরা যোগাযোগ করব।",
  },
  common: { next: "পরবর্তী", back: "পিছনে", version: "সংস্করণ", of3: "৩ এর মধ্যে", scaleStronglyDisagree: "একেবারেই একমত নই", scaleStronglyAgree: "সম্পূর্ণ একমত", optional: "(ঐচ্ছিক)" },
  liveTasks: {
    task1Instruction: "আপনি আপনার ড্যাশবোর্ড দেখবেন। একটু সময় নিয়ে দেখুন।",
    task2Instruction: "\"আমার পণ্য\" খুঁজুন এবং একটি নতুন পণ্য যোগ করুন।",
    task3Instruction: "আপনার প্রোফাইল দেখুন, তারপর মেইলের মাধ্যমে শেয়ার করুন।",
    task4Instruction: "আপনার অর্ডার দেখুন। একটি অর্ডার গ্রহণ করুন এবং একটি প্রত্যাখ্যান করুন।",
    orderAccept: "গ্রহণ করুন",
    orderDecline: "প্রত্যাখ্যান করুন",
    taskDoneButton: "আমি শেষ করেছি",
  },
};

const PILOT_DICTIONARIES = { en, hi, bn };

export function getPilotDictionary(locale: "en" | "hi" | "bn"): PilotDictionary {
  return PILOT_DICTIONARIES[locale];
}

export function formatPilot(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
