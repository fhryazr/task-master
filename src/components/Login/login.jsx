import { useState } from "react";
import { database, provider } from "./FirebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Login() {
  const [setLogin] = useState(false);
  const history = useNavigate();
  const [user, setUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    signInWithEmailAndPassword(database, email, password)
      .then((data) => {
        console.log(data, "authData");
        setLogin(true);
        history("/");
      })
      .catch((err) => {
        alert(err.code);
        setLogin(true);
      });
  };

  const handleReset = () => {
    history("/reset");
  };

  const handleRegister = () => {
    history("/register");
  };

  const handleGoogleLogin = () => {
    signInWithPopup(database, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        history("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="Login">
      <div className="login-container">
        <h1 className="judul font-bold text-xl">Login</h1>
        <form onSubmit={handleSubmit}>
          <input className="email-input" name="email" placeholder="Email" />
          <br />
          <input
            className="pass-input"
            name="password"
            type="password"
            placeholder="Password"
          />
          <br />
          <p className="forgot" onClick={handleReset}>
            Forgot Password?
          </p>
          <br />
          <button className="submit-button">Login</button>
          <p>
            Don't have an account?{" "}
            <a className="signup-link" onClick={handleRegister}>
              Sign Up
            </a>
          </p>
          <p className="or">Or</p>
          <div className="google-login" onClick={handleGoogleLogin}>
            <img src="/src/assets/g-logo.png" className="g-logo" />
            <span>Login with Google</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
