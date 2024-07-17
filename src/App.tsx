import { Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Board from "./pages/Board";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Boards from "./pages/Boards";
import Input from "./Input";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/boards",
      element: <Boards />,
    },
    {
      path: "/board/:id",
      element: <Board />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
