import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Mannager from "./pages/Mannager";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#000428] via-[#004e92] to-[#000428] text-white">
        <Navbar />

        {/* Content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mannager" element={<Mannager />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
