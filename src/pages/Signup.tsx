import AuthPage from "./Auth";
import { AuthMode } from "../utils/constants/auth";

const Signup = () => {
  return <AuthPage mode={AuthMode.SignUP} />;
};

export default Signup;
