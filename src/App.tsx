import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

const App = () => {
  return (
    <div className="App">
      <Login />
      <Signup/>
      <Dashboard />
    </div>
  )
}

export default App