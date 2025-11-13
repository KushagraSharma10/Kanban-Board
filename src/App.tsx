import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/store/hooks";
import { selectAuthUser } from "./app/slices/auth.slice";
import { restoreSession } from "./app/thunks/auth.thunks";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (authUser) {
        setIsCheckingSession(false);
        return;
      }

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

  if (isCheckingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-[#6ca0ff] rounded-full animate-spin" />
          <p className="text-white text-lg font-medium">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }
  return <Dashboard />;
};


export default App;