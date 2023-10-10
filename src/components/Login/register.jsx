import { useState } from "react";
import { database, provider } from "./FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Register() {
  const [setRegister] = useState(false);
  const history = useNavigate();
  const [user, setUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value; // Tambahkan ini

    // Periksa apakah password dan konfirmasi password cocok
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    createUserWithEmailAndPassword(database, email, password)
      .then((data) => {
        console.log(data, "authData");
        history("/login");
      })
      .catch((err) => {
        alert(err.code);
        setRegister(true);
      });
  };

  const handleLogin = () => {
    history("/login");
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
        <h1 className="judul font-bold text-xl">Sign Up</h1>
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
          {/* Tambahkan input untuk konfirmasi password */}
          <input
            className="conf-input"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <br />
          <br />
          <button className="submit-button">Signup</button>
          <p>
            Already have an account?{" "}
            <a className="login-link" onClick={handleLogin}>
              Login
            </a>
          </p>
          <p className="or">Or</p>
          <div className="google-login" onClick={handleGoogleLogin}>
            <img
              src="/src/assets/g-logo.png"
              className="g-logo"
              alt="Google Logo"
            />
            <span>Login with Google</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
