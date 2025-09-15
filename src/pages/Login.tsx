import AuthPage from "./Auth";
import { LOGIN_MODE } from "../constants/AuthConstants";

const LoginPage = () => {
  return <AuthPage mode = {LOGIN_MODE} />;
};

export default LoginPage;
