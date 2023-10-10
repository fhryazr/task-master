// import "./App.css";
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";


const App = () => {
  return (
    <>
        <Routes>
          <Route path="/">
            <Route index element={<HomePage/>}/>
            <Route path="admin/*" element={<AdminPage />}/>
          </Route>
        </Routes>
    </>
  );
};

export default App;
