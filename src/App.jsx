import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import AdminPage from "./pages/AdminPage";
import Home from "./pages/home";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
      </Router>
    </>
  );
};

export default App;
