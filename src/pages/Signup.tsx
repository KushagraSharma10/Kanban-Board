import AuthPage from "./Auth";
import { SIGNUP_MODE } from "../constants/auth";
const Signup = () => {
  return <AuthPage mode={SIGNUP_MODE} />;
};

export default Signup;
