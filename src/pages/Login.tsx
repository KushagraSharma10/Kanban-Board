import { AuthMode } from "../utils/enum/auth";
import AuthPage from "./Auth";

const Login = () => {
  return <AuthPage mode={AuthMode.Login} />;
};

export default Login;
