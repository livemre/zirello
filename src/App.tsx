import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Board from "./pages/Board";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Boards from "./pages/Boards";
import Navbar from "./components/Navbar"; // Navbar bileşenini içe aktarıyoruz

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar bileşenini buraya ekliyoruz */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
