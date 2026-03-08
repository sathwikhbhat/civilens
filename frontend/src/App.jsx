import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PersonaBuilder from "./pages/PersonaBuilder";
import Results from "./pages/Results";
import STTDemo from "./pages/STTDemo";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<PersonaBuilder />} />
          <Route path="/results" element={<Results />} />
          <Route path="/stt" element={<STTDemo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;