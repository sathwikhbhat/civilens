export function extractFields(text, persona, language = "en-IN", currentField = null) {
  const lower = text.toLowerCase().trim();
  const updated = JSON.parse(JSON.stringify(persona));

  function parseIndianNumber(value) {
    const cleaned = value.replace(/,/g, "");
    const match = cleaned.match(/\d+/);
    if (!match) return null;
    return parseInt(match[0], 10);
  }

  function mapIncomeNumberToBracket(amount) {
    if (amount === null || Number.isNaN(amount)) return null;

    if (amount < 100000) return "BELOW_1_LAKH";
    if (amount >= 100000 && amount <= 300000) return "ONE_TO_THREE_LAKH";
    if (amount > 300000 && amount <= 800000) return "THREE_TO_EIGHT_LAKH";
    if (amount > 800000) return "ABOVE_8_LAKH";

    return null;
  }

  const stateMap = {
    Maharashtra: ["maharashtra", "महाराष्ट्र", "महाराष्ट्रात", "महाराष्ट्रातून"],
    Karnataka: ["karnataka", "कर्नाटक", "ಕರ್ನಾಟಕ"],
    Odisha: ["odisha", "orissa", "ओडिशा", "ଓଡ଼ିଶା"],
    "Tamil Nadu": ["tamil nadu", "तमिल नाडु", "தமிழ்நாடு"],
  };

  const districtMap = {
    Bengaluru: ["bengaluru", "bangalore", "ಬೆಂಗಳೂರು"],
    Mysuru: ["mysuru", "mysore", "ಮೈಸೂರು"],
    Pune: ["pune", "पुणे"],
    Nagpur: ["nagpur", "नागपुर"],
    Chennai: ["chennai", "சென்னை"],
    Coimbatore: ["coimbatore", "கோயம்புத்தூர்"],
  };

  const occupationMap = {
    FARMER: [
      "farmer", "farming", "agriculture",
      "किसान", "खेती", "शेतकरी", "शेती", "விவசாயி"
    ],
    STUDENT: [
      "student", "studying",
      "छात्र", "विद्यार्थी", "स्टूडेंट", "மாணவர்"
    ],
    WORKER: [
      "worker", "labour", "labor",
      "मज़दूर", "मजदूर", "कामगार", "தொழிலாளர்"
    ],
    SELF_EMPLOYED: [
      "self employed", "business", "shopkeeper", "vendor",
      "स्वरोजगार", "दुकानदार", "व्यवसाय", "स्वयंरोजगार", "சுயதொழில்"
    ],
  };

  const categoryMap = {
    GENERAL: ["general", "सामान्य", "जनरल", "सर्वसाधारण", "பொது"],
    OBC: ["obc", "o b c", "ओबीसी", "इतर मागास", "ஓபிசி"],
    SC: ["sc", "s c", "एससी", "अनुसूचित जाति", "दलित", "எஸ்சி"],
    ST: ["st", "s t", "एसटी", "अनुसूचित जनजाति", "आदिवासी", "எஸ்டி"],
  };

  const incomeMap = [
    {
      value: "BELOW_1_LAKH",
      patterns: [
        "below 1 lakh", "less than 1 lakh", "under 1 lakh",
        "1 लाख से कम", "एक लाख से कम", "1 लाखाच्या खाली",
        "1 லட்சத்திற்குக் கீழே"
      ],
    },
    {
      value: "ONE_TO_THREE_LAKH",
      patterns: [
        "1 to 3 lakh", "one to three lakh",
        "1 से 3 लाख", "एक से तीन लाख", "1 ते 3 लाख",
        "1 முதல் 3 லட்சம்"
      ],
    },
    {
      value: "THREE_TO_EIGHT_LAKH",
      patterns: [
        "3 to 8 lakh", "three to eight lakh",
        "3 से 8 लाख", "3 ते 8 लाख",
        "3 முதல் 8 லட்சம்"
      ],
    },
    {
      value: "ABOVE_8_LAKH",
      patterns: [
        "above 8 lakh", "more than 8 lakh", "over 8 lakh",
        "8 लाख से ज़्यादा", "8 लाख से अधिक",
        "8 लाखांपेक्षा जास्त",
        "8 லட்சத்திற்கு மேல்"
      ],
    },
  ];

  const ageWordMap = {
    "fifty two": 52,
    "बावन": 52,
    "बावन्न": 52,
    "ಐವತ್ತೆರಡು": 52,
    "ஐம்பத்து இரண்டு": 52,

    "fifty": 50,
    "पचास": 50,
    "पन्नास": 50,
    "ஐம்பது": 50,

    "forty": 40,
    "चालीस": 40,
    "चाळीस": 40,
    "நாற்பது": 40,
  };

  const landWordMap = {
    "two acre": 2,
    "two acres": 2,
    "2 acre": 2,
    "2 acres": 2,
    "दो एकड़": 2,
    "दोन एकर": 2,
    "இரண்டு ஏக்கர்": 2,
  };

  // STATE
  for (const [state, patterns] of Object.entries(stateMap)) {
    if (patterns.some((p) => lower.includes(p.toLowerCase()))) {
      updated.geographic.state = state;
      break;
    }
  }

  // DISTRICT
  for (const [district, patterns] of Object.entries(districtMap)) {
    if (patterns.some((p) => lower.includes(p.toLowerCase()))) {
      updated.geographic.district = district;
      break;
    }
  }

  // OCCUPATION
  for (const [occupation, patterns] of Object.entries(occupationMap)) {
    if (patterns.some((p) => lower.includes(p.toLowerCase()))) {
      updated.occupation.type = occupation;
      break;
    }
  }

  // CATEGORY
  for (const [category, patterns] of Object.entries(categoryMap)) {
    if (patterns.some((p) => lower.includes(p.toLowerCase()))) {
      updated.demographics.category = category;
      break;
    }
  }

  // INCOME - phrase match first
  let incomeMatched = false;

  for (const item of incomeMap) {
    if (item.patterns.some((p) => lower.includes(p.toLowerCase()))) {
      updated.economic.incomeBracket = item.value;
      incomeMatched = true;
      break;
    }
  }

  // INCOME - handle phrases like "1,00,000 से कम", "below 100000"
  if (!incomeMatched) {
    const lessThanIncomePatterns = [
      /(\d[\d,]*)\s*से\s*कम/,
      /below\s*(\d[\d,]*)/,
      /less than\s*(\d[\d,]*)/,
      /under\s*(\d[\d,]*)/,
      /(\d[\d,]*)\s*पेक्षा\s*कमी/,
    ];

    for (const pattern of lessThanIncomePatterns) {
      const match = lower.match(pattern);

      if (match) {
        const amount = parseInt(match[1].replace(/,/g, ""), 10);

        if (!Number.isNaN(amount)) {
          if (amount <= 100000) {
            updated.economic.incomeBracket = "BELOW_1_LAKH";
          } else if (amount <= 300000) {
            updated.economic.incomeBracket = "ONE_TO_THREE_LAKH";
          } else if (amount <= 800000) {
            updated.economic.incomeBracket = "THREE_TO_EIGHT_LAKH";
          } else {
            updated.economic.incomeBracket = "ABOVE_8_LAKH";
          }

          incomeMatched = true;
          break;
        }
      }
    }
  }

  // INCOME - numeric fallback
  if (!incomeMatched) {
    const looksLikeIncome =
      currentField === "income" ||
      lower.includes("lakh") ||
      lower.includes("income") ||
      lower.includes("income range") ||
      lower.includes("आय") ||
      lower.includes("कमाई") ||
      lower.includes("उत्पन्न") ||
      lower.includes("लाख") ||
      lower.includes("வருமானம்") ||
      lower.includes("पैसे");

    if (looksLikeIncome) {
      const amount = parseIndianNumber(lower);
      const bracket = mapIncomeNumberToBracket(amount);

      if (bracket) {
        updated.economic.incomeBracket = bracket;
      }
    }
  }

  // AGE
  const isAgeContext =
    currentField === "age" ||
    lower.includes("age") ||
    lower.includes("years old") ||
    lower.includes("year old") ||
    lower.includes("old") ||
    lower.includes("उम्र") ||
    lower.includes("साल") ||
    lower.includes("वर्ष") ||
    lower.includes("वय") ||
    lower.includes("வயது");

  if (isAgeContext) {
    const ageDigitMatch = lower.match(/\b\d{1,3}\b/);

    if (ageDigitMatch) {
      const age = parseInt(ageDigitMatch[0], 10);
      if (age >= 1 && age <= 120) {
        updated.demographics.age = age;
      }
    } else {
      for (const [phrase, value] of Object.entries(ageWordMap)) {
        if (lower.includes(phrase.toLowerCase())) {
          updated.demographics.age = value;
          break;
        }
      }
    }
  }

  // LAND
  const landMatch = lower.match(/(\d+(\.\d+)?)\s*(acre|acres|एकड़|एकर|ಎಕರೆ|ஏக்கர்)/);
  if (landMatch) {
    updated.occupation.details.farmerDetails.landHolding.value = parseFloat(landMatch[1]);
    updated.occupation.details.farmerDetails.landHolding.unit = "ACRE";
  } else {
    for (const [phrase, value] of Object.entries(landWordMap)) {
      if (lower.includes(phrase.toLowerCase())) {
        updated.occupation.details.farmerDetails.landHolding.value = value;
        updated.occupation.details.farmerDetails.landHolding.unit = "ACRE";
        break;
      }
    }
  }

  return updated;
}