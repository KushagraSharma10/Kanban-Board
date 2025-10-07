import { AuthMode } from "../utils/constants/auth";
import AuthPage from "./Auth";

const Signup = () => {
  return <AuthPage mode={AuthMode.SignUP} />;
};

export default Signup;
