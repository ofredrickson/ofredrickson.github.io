import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Music from "./pages/Music";

function App() {
  return (
    <Router>
      <ScrollProgress />
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;