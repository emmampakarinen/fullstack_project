import FrontPage from "./pages/FrontPage";
import Registration from "./pages/Registration";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} /> 
        <Route path="/register" element={<Registration />} /> 
        <Route path="/login" element={<Registration />} /> 
      </Routes>
    </Router>
  )
}

export default App;
