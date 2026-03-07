import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

/*
--------------------------------
GEMINI EMBEDDING FUNCTION
--------------------------------
*/

async function embedText(text) {

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=" +
    process.env.GEMINI_API_KEY;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "models/gemini-embedding-001",
      taskType: "RETRIEVAL_DOCUMENT",
      content: {
        parts: [{ text }]
      }
    })
  });

  const data = await response.json();

  if (!data.embedding) {
    throw new Error("Embedding failed");
  }

  return data.embedding.values;
}

/*
--------------------------------
LOAD SCHEMES
--------------------------------
*/

const schemesFolder = path.join(__dirname, "../../../data/schemes");

const schemeFiles = fs.readdirSync(schemesFolder);

const schemes = schemeFiles.map((file) => {
  const filePath = path.join(schemesFolder, file);
  const fileData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileData);
});

/*
--------------------------------
COSINE SIMILARITY
--------------------------------
*/

function cosineSimilarity(vecA, vecB) {

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {

    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];

  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  return dotProduct / (normA * normB);
}

/*
--------------------------------
GENERATE SCHEME EMBEDDINGS
--------------------------------
*/

async function generateSchemeEmbeddings() {

  for (let scheme of schemes) {

    const text = `
${scheme.title}
${scheme.summary}
${scheme.semanticContent}
`;

    scheme.embedding = await embedText(text);

  }

}

/*
--------------------------------
API ROUTES
--------------------------------
*/

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/vector-search", async (req, res) => {

  const persona = req.body;

  /*
  --------------------------------
  NORMALIZE USER INPUT
  --------------------------------
  */

  if (persona.occupation) {

    const occ = persona.occupation.toLowerCase();

    const occupationMap = {
      "farmer": "farmer",
      "student": "student",
      "shop owner": "self_employed",
      "business": "self_employed",
      "self employed": "self_employed",
      "labour": "worker",
      "labor": "worker",
      "worker": "worker"
    };

    persona.occupation = occupationMap[occ] || occ;
  }

  if (persona.incomeBracket) {

    const inc = persona.incomeBracket.toLowerCase();

    const incomeMap = {
      "low": "UPTO_1L",
      "low income": "UPTO_1L",
      "middle": "ONE_TO_3L",
      "middle income": "THREE_TO_5L",
      "high": "FIVE_TO_8L",
      "poor": "UPTO_1L"
    };

    persona.incomeBracket = incomeMap[inc] || persona.incomeBracket;
  }

  /*
  --------------------------------
  RULE FILTER
  --------------------------------
  */

  const eligibleSchemes = schemes.filter((scheme) => {

    const eligibility = scheme.eligibility;

    if (persona.occupation) {

      const allowed = eligibility.occupation.allowedTypes
        .map(x => x.toLowerCase());

      if (!allowed.includes(persona.occupation.toLowerCase())) {
        return false;
      }

    }

    if (persona.incomeBracket) {

      const allowed = eligibility.economic.allowedIncomeBrackets;

      if (!allowed.includes("ANY")) {

        const allowedNormalized = allowed.map(x => x.toUpperCase());
        const userIncome = persona.incomeBracket.toUpperCase();

        if (!allowedNormalized.includes(userIncome)) {
          return false;
        }

      }

    }

    if (persona.state) {

      const allowed = eligibility.geographic.allowedStates
        .map(x => x.toLowerCase());

      if (!allowed.includes("any") &&
        !allowed.includes(persona.state.toLowerCase())) {
        return false;
      }

    }

    if (persona.age !== undefined) {

      const minAge = eligibility.demographics.minAge;
      const maxAge = eligibility.demographics.maxAge;

      if (persona.age < minAge || persona.age > maxAge) {
        return false;
      }

    }

    return true;

  });

  /*
  --------------------------------
  EMBED USER QUERY (IMPROVED)
  --------------------------------
  */

  const userText = `
Person profile:
Occupation: ${persona.occupation || "unknown"}
State: ${persona.state || "unknown"}
Age: ${persona.age || "unknown"}
Income group: ${persona.incomeBracket || "unknown"}
`;

  const userEmbedding = await embedText(userText);

  /*
  --------------------------------
  VECTOR RANKING
  --------------------------------
  */

  const ranked = eligibleSchemes
    .map((scheme) => {

      const similarity = cosineSimilarity(
        userEmbedding,
        scheme.embedding
      );

      return { scheme, similarity };

    })
    .sort((a, b) => b.similarity - a.similarity);

  /*
  --------------------------------
  CLEAN RESPONSE
  --------------------------------
  */

  const response = ranked.map((item) => ({
    id: item.scheme.schemeId,
    title: item.scheme.title,
    category: item.scheme.category,
    summary: item.scheme.summary,
    benefits: item.scheme.benefits.description,
    applicationMode: item.scheme.applicationMode,
    officialLink: item.scheme.officialLink
  }));

  const topResults = response.slice(0, 5);

  res.json({
    count: topResults.length,
    schemes: topResults
  });

});

/*
--------------------------------
START SERVER
--------------------------------
*/

async function startServer() {

  await generateSchemeEmbeddings();

  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });

}

startServer();