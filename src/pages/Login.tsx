import AuthPage from "./Auth";
import { LOGIN_MODE } from "../constants/AuthConstants";

const Login = () => {
  return <AuthPage mode = {LOGIN_MODE} />;
};

export default Login;
