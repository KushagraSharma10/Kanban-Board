import { AuthMode } from "../utils/constants/auth";
import AuthPage from "./Auth";

const Login = () => {
  return <AuthPage mode={AuthMode.Login}/>;
};

export default Login;
