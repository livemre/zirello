import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Board from "./pages/Board";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Boards from "./pages/Boards";
import Navbar from "./components/Navbar"; // Navbar bileşenini içe aktarıyoruz
import { useContext } from "react";
import { MainContext } from "./context/Context";

function App() {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No context");
  }

  const { user } = context;

  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar bileşenini buraya ekliyoruz */}
      <Routes>
        {user ? (
          <Route path="/" element={<Boards />} />
        ) : (
          <Route path="/" element={<Home />} />
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
