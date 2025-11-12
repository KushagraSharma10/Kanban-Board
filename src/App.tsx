import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/store/hooks";
import { selectAuthUser } from "./app/slices/auth.slice";
import { restoreSession } from "./app/thunks/auth.thunks";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  
  const [_isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (authUser) {
      setIsCheckingSession(false);
      return;
    }
    const checkSession = async () => {
      try {
        await dispatch(restoreSession()).unwrap();
      } catch (_error) {
        localStorage.removeItem("auth");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
    
  }, [dispatch, authUser]); 

  return <Dashboard />;
};

export default App;