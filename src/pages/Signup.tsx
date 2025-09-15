import AuthPage from "./Auth";
import { SIGNUP_MODE } from "../constants/AuthConstants";
const  SignupPage = () => {
  return <AuthPage mode={SIGNUP_MODE} />;
}

export default SignupPage;