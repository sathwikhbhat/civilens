const QUESTION_TEXT = {
  state: {
    "en-IN": "Which state do you live in?",
    "hi-IN": "आप किस राज्य में रहते हैं?",
    "mr-IN": "तुम्ही कोणत्या राज्यात राहता?",
    "ta-IN": "நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?",
  },
  district: {
    "en-IN": "Which district do you live in?",
    "hi-IN": "आप किस जिले में रहते हैं?",
    "mr-IN": "तुम्ही कोणत्या जिल्ह्यात राहता?",
    "ta-IN": "நீங்கள் எந்த மாவட்டத்தில் வசிக்கிறீர்கள்?",
  },
  age: {
    "en-IN": "What is your age? Please say the number like 52.",
    "hi-IN": "आपकी उम्र क्या है? कृपया 52 जैसा अंक बोलें।",
    "mr-IN": "तुमचे वय किती आहे? कृपया 52 सारखा अंक बोला.",
    "ta-IN": "உங்கள் வயது என்ன? 52 போன்ற எண்ணாகச் சொல்லவும்.",
  },
  occupation: {
    "en-IN": "What is your occupation?",
    "hi-IN": "आपका पेशा क्या है?",
    "mr-IN": "तुमचा व्यवसाय काय आहे?",
    "ta-IN": "உங்கள் தொழில் என்ன?",
  },
  income: {
    "en-IN":
      "What is your annual family income range? You can say below 1 lakh, 1 to 3 lakh, 3 to 8 lakh, or above 8 lakh.",
    "hi-IN":
      "आपकी वार्षिक पारिवारिक आय किस सीमा में आती है? आप 1 लाख से कम, 1 से 3 लाख, 3 से 8 लाख, या 8 लाख से अधिक कह सकते हैं।",
    "mr-IN":
      "तुमच्या कुटुंबाचे वार्षिक उत्पन्न कोणत्या श्रेणीत येते? तुम्ही 1 लाखाच्या खाली, 1 ते 3 लाख, 3 ते 8 लाख, किंवा 8 लाखांपेक्षा जास्त असे सांगू शकता.",
    "ta-IN":
      "உங்கள் குடும்பத்தின் ஆண்டு வருமானம் எந்த வரம்பில் வருகிறது? 1 லட்சத்திற்குக் கீழே, 1 முதல் 3 லட்சம், 3 முதல் 8 லட்சம், அல்லது 8 லட்சத்திற்கு மேல் என்று சொல்லலாம்.",
  },
  category: {
    "en-IN": "Do you belong to General, OBC, SC or ST category?",
    "hi-IN": "क्या आप सामान्य, ओबीसी, एससी या एसटी वर्ग से हैं?",
    "mr-IN": "तुम्ही जनरल, ओबीसी, एससी की एसटी प्रवर्गातील आहात का?",
    "ta-IN": "நீங்கள் பொதுப் பிரிவு, ஓபிசி, எஸ்சி அல்லது எஸ்டி வகையைச் சேர்ந்தவரா?",
  },
  land: {
    "en-IN": "How many acres of land do you own?",
    "hi-IN": "आपके पास कितने एकड़ जमीन है?",
    "mr-IN": "तुमच्याकडे किती एकर जमीन आहे?",
    "ta-IN": "உங்களிடம் எத்தனை ஏக்கர் நிலம் உள்ளது?",
  },
  complete: {
    "en-IN": "Thank you. Your details are complete.",
    "hi-IN": "धन्यवाद। आपकी जानकारी पूरी हो गई है।",
    "mr-IN": "धन्यवाद. तुमची माहिती पूर्ण झाली आहे.",
    "ta-IN": "நன்றி. உங்கள் தகவல்கள் முழுமையாக கிடைத்துவிட்டன.",
  },
};

function getText(key, language = "en-IN") {
  return QUESTION_TEXT[key]?.[language] || QUESTION_TEXT[key]?.["en-IN"] || "";
}

export function nextQuestion(missing, language = "en-IN") {
  if (missing.includes("state")) return getText("state", language);
  if (missing.includes("district")) return getText("district", language);
  if (missing.includes("age")) return getText("age", language);
  if (missing.includes("occupation")) return getText("occupation", language);
  if (missing.includes("income")) return getText("income", language);
  if (missing.includes("category")) return getText("category", language);
  if (missing.includes("land")) return getText("land", language);

  return getText("complete", language);
}