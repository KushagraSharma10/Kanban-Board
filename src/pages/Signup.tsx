import AuthPage from "./Auth";
import { SIGNUP_MODE } from "../constants/Auth";
const Signup = () => {
  return <AuthPage mode={SIGNUP_MODE} />;
};

export default Signup;
