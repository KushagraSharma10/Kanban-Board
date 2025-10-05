import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import BoardView from "./pages/BoardView.tsx";
import { seedInitialUsers } from "./utils/seed-users.ts";

seedInitialUsers();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/board/:id",
    element: <BoardView />,
  },
]);

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(<RouterProvider router={router} />);
