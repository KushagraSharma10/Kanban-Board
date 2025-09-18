import AuthPage from "./Auth";
import { LOGIN_MODE } from "../constants/Auth";

const Login = () => {
  return <AuthPage mode={LOGIN_MODE} />;
};

export default Login;
