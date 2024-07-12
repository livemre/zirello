import { Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Board from "./components/Board";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Boards from "./pages/Boards";

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
      path: "/board",
      element: <Board />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
