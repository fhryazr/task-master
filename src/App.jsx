// import "./App.css";
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

import Login from "./pages/login";
import Register from "./pages/register";

const App = () => {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login />} />
        <Route path="/">
            <Route index element={<HomePage/>}/>
            <Route path="admin/*" element={<AdminPage />}/>
          </Route>
          <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
