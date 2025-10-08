import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <Dashboard />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
