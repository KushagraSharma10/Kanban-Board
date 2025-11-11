import { AuthMode } from "../utils/enum/auth";
import AuthPage from "./Auth";

const Signup = () => {
  return <AuthPage mode={AuthMode.SignUp} />;
};

export default Signup;
