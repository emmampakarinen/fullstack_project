import FrontPage from "./pages/FrontPage";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} /> 
        <Route path="/register" element={<Registration />} /> 
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}> 
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
