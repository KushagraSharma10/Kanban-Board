import AuthPage from "./Auth";
import { LOGIN_MODE } from "../constants/auth";

const Login = () => {
  return <AuthPage mode={LOGIN_MODE} />;
};

export default Login;
