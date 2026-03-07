function getLanguageText(language = "en-IN") {
  const TEXT = {
    "en-IN": {
      gotIt: "Got it.",
      and: ", ",
    },
    "hi-IN": {
      gotIt: "ठीक है।",
      and: ", ",
    },
    "mr-IN": {
      gotIt: "ठीक आहे.",
      and: ", ",
    },
    "ta-IN": {
      gotIt: "சரி.",
      and: ", ",
    },
  };

  return TEXT[language] || TEXT["en-IN"];
}

function buildSummaryParts(persona, language = "en-IN") {
  const parts = [];

  if (language === "hi-IN") {
    if (persona.occupation?.type === "FARMER") parts.push("आप किसान हैं");
    if (persona.occupation?.type === "STUDENT") parts.push("आप छात्र हैं");
    if (persona.occupation?.type === "WORKER") parts.push("आप कामगार हैं");
    if (persona.occupation?.type === "SELF_EMPLOYED") parts.push("आप स्वरोज़गार में हैं");

    if (persona.geographic?.state) parts.push(`आप ${persona.geographic.state} से हैं`);
    if (persona.demographics?.age) parts.push(`आपकी उम्र ${persona.demographics.age} है`);
    if (persona.demographics?.category) parts.push(`आप ${persona.demographics.category} वर्ग से हैं`);
  } else if (language === "mr-IN") {
    if (persona.occupation?.type === "FARMER") parts.push("तुम्ही शेतकरी आहात");
    if (persona.occupation?.type === "STUDENT") parts.push("तुम्ही विद्यार्थी आहात");
    if (persona.occupation?.type === "WORKER") parts.push("तुम्ही कामगार आहात");
    if (persona.occupation?.type === "SELF_EMPLOYED") parts.push("तुम्ही स्वयंरोजगारात आहात");

    if (persona.geographic?.state) parts.push(`तुम्ही ${persona.geographic.state} मधून आहात`);
    if (persona.demographics?.age) parts.push(`तुमचे वय ${persona.demographics.age} आहे`);
    if (persona.demographics?.category) parts.push(`तुम्ही ${persona.demographics.category} प्रवर्गातील आहात`);
  } else if (language === "ta-IN") {
    if (persona.occupation?.type === "FARMER") parts.push("நீங்கள் ஒரு விவசாயி");
    if (persona.occupation?.type === "STUDENT") parts.push("நீங்கள் ஒரு மாணவர்");
    if (persona.occupation?.type === "WORKER") parts.push("நீங்கள் ஒரு தொழிலாளர்");
    if (persona.occupation?.type === "SELF_EMPLOYED") parts.push("நீங்கள் சுயதொழில் செய்கிறீர்கள்");

    if (persona.geographic?.state) parts.push(`நீங்கள் ${persona.geographic.state} மாநிலத்தைச் சேர்ந்தவர்`);
    if (persona.demographics?.age) parts.push(`உங்கள் வயது ${persona.demographics.age}`);
    if (persona.demographics?.category) parts.push(`நீங்கள் ${persona.demographics.category} பிரிவைச் சேர்ந்தவர்`);
  } else {
    if (persona.occupation?.type) {
      parts.push(`you're a ${persona.occupation.type.toLowerCase().replaceAll("_", " ")}`);
    }
    if (persona.geographic?.state) {
      parts.push(`from ${persona.geographic.state}`);
    }
    if (persona.demographics?.age) {
      parts.push(`aged ${persona.demographics.age}`);
    }
    if (persona.demographics?.category) {
      parts.push(`${persona.demographics.category} category`);
    }
  }

  return parts;
}

export function buildResponse(persona, nextQ, language = "en-IN") {
  const langText = getLanguageText(language);
  const summaryParts = buildSummaryParts(persona, language);

  if (summaryParts.length === 0) {
    return nextQ;
  }

  if (language === "hi-IN") {
    return `${langText.gotIt} ${summaryParts.join(langText.and)}. ${nextQ}`;
  }

  if (language === "mr-IN") {
    return `${langText.gotIt} ${summaryParts.join(langText.and)}. ${nextQ}`;
  }

  if (language === "ta-IN") {
    return `${langText.gotIt} ${summaryParts.join(langText.and)}. ${nextQ}`;
  }

  return `${langText.gotIt} ${summaryParts.join(langText.and)}. ${nextQ}`;
}