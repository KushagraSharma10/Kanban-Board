import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import BoardView from "./pages/BoardView.tsx";
import { seedInitialUsers } from "./utils/seed-users.ts";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

createRoot(root).render(
   <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} theme="dark" />
  </Provider>
  );
