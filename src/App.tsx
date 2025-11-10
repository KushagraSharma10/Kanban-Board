import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import { useAppDispatch } from "./app/store/hooks";
import { loadSession } from "./app/thunks/auth.thunks";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return <Dashboard />;
};

export default App;
