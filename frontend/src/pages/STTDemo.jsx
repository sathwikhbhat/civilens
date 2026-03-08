import { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { personaTemplate } from "../chatbot/personaTemplate";
import { extractFields } from "../chatbot/extractFields";
import { getMissingFields } from "../chatbot/missingFields";
import { nextQuestion } from "../chatbot/questions";
import { buildResponse } from "../chatbot/buildResponse";

function STTDemo() {
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

            const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
                data.token,
                data.region
            );
            speechConfig.speechRecognitionLanguage = language;

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

            setListening(true);
            setStatus("Listening...");

            recognizer.recognizeOnceAsync(
                (result) => {
                    if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                        const text = result.text;
                        setTranscript(text);

                        setPersona((prevPersona) => {
                            const updatedPersona = extractFields(text, prevPersona, language, currentField);
                            const missing = getMissingFields(updatedPersona);

                            const nextField = missing.length > 0 ? missing[0] : null;
                            setCurrentField(nextField);

                            const nextQ = nextQuestion(missing, language);
                            const botReply = buildResponse(updatedPersona, nextQ, language);
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
                    setStatus(`Speech SDK error: ${err}`);
                    setListening(false);
                    recognizer.close();
                }
            );
        } catch (err) {
            setStatus(`Failed to start speech recognition: ${err.message}`);
            setListening(false);
        }
    };

    return (
        <div className="pt-24 pb-10 min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                    <h1 className="text-2xl font-bold text-slate-900">Civilens Multilingual STT Demo</h1>

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                        <label htmlFor="lang" className="font-medium text-slate-700">Select Language</label>
                        <select
                            id="lang"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2"
                        >
                            <option value="en-IN">English (India)</option>
                            <option value="hi-IN">Hindi</option>
                            <option value="mr-IN">Marathi</option>
                            <option value="ta-IN">Tamil</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={startListening}
                            disabled={listening}
                            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-semibold"
                        >
                            {listening ? "Listening..." : "Start Speaking"}
                        </button>
                    </div>

                    <p className="mt-4 text-slate-700"><strong>Status:</strong> {status}</p>
                    <p className="mt-2 text-slate-700"><strong>Transcript:</strong> {transcript}</p>
                    <p className="mt-2 text-slate-700"><strong>Next Question:</strong> {question}</p>

                    <pre className="mt-4 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(persona, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default STTDemo;
