import { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { personaTemplate } from "./chatbot/personaTemplate";
import { extractFields } from "./chatbot/extractFields";
import { getMissingFields } from "./chatbot/missingFields";
import { nextQuestion } from "./chatbot/questions";
import { buildResponse } from "./chatbot/buildResponse";

function App() {
  const [language, setLanguage] = useState("en-IN");
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [persona, setPersona] = useState(personaTemplate);
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [currentField, setCurrentField] = useState(null);

  const startListening = async () => {
    try {
      setStatus("Fetching speech token...");

      const res = await fetch("http://localhost:7071/api/speechToken");
      if (!res.ok) {
        throw new Error(`Token fetch failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("Speech token response:", data);

      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
        data.token,
        data.region
      );

      speechConfig.speechRecognitionLanguage = language;

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechSDK.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

      setListening(true);
      setStatus("Listening...");

      recognizer.recognizeOnceAsync(
        (result) => {
          console.log("Recognition result:", result);

          if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            const text = result.text;
            setTranscript(text);
            console.log("USER SAID:", text);

            setPersona((prevPersona) => {
              const updatedPersona = extractFields(text, prevPersona, language, currentField);
              console.log("UPDATED PERSONA:", updatedPersona);

              const missing = getMissingFields(updatedPersona);
              console.log("MISSING FIELDS:", missing);

              const nextField = missing.length > 0 ? missing[0] : null;
              setCurrentField(nextField);

              const nextQ = nextQuestion(missing, language);
              const botReply = buildResponse(updatedPersona, nextQ, language);
              console.log("BOT REPLY:", botReply);

              setQuestion(botReply);

              return updatedPersona;
});

          setStatus("Speech recognized successfully");
} else if (result.reason === SpeechSDK.ResultReason.NoMatch) {
            setStatus("No speech could be recognized");
          } else {
            setStatus(`Recognition failed with reason: ${result.reason}`);
          }

          setListening(false);
          recognizer.close();
        },
        (err) => {
          console.error("Speech SDK error:", err);
          setStatus(`Speech SDK error: ${err}`);
          setListening(false);
          recognizer.close();
        }
      );
    } catch (err) {
      console.error("Start listening failed:", err);
      setStatus(`Failed to start speech recognition: ${err.message}`);
      setListening(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Civilens Multilingual STT Demo</h1>

      <label>Select Language: </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginBottom: "1rem", marginLeft: "0.5rem" }}
      >
        <option value="en-IN">English (India)</option>
        <option value="hi-IN">Hindi</option>
        <option value="mr-IN">Marathi</option>
        <option value="ta-IN">Tamil</option>
      </select>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={startListening} disabled={listening}>
          {listening ? "Listening..." : "Start Speaking"}
        </button>
      </div>

      <p style={{ marginTop: "1rem" }}>
        <strong>Status:</strong> {status}
      </p>

      <p>
        <strong>Transcript:</strong> {transcript}
      </p>
      
      <p>
        <strong>Next Question:</strong> {question}
      </p>

      <pre style={{background:"#2E2E2E",padding:"10px"}}>
      {JSON.stringify(persona, null, 2)}
      </pre>

    </div>
  );
}



export default App;