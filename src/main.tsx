import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <App />
  },
  {
    path: "signup",
    element : <Signup />
  }
]);

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <RouterProvider router={router} />,
);

