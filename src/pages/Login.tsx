import AuthPage from "./Auth";
import { AuthMode } from "../utils/constants/auth";

const Login = () => {
  return <AuthPage mode={AuthMode.Login} />;
};

export default Login;
