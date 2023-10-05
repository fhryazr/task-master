import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import HomePage from "./pages/HomaPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
