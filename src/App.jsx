/* eslint-disable react/prop-types */
// import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/login";
import Register from "./pages/register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const {currentUser} = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  console.log(currentUser)


  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route
            path="admin/*"
            element={
              <RequireAuth>
                <AdminPage />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
