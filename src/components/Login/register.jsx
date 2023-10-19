import { useState } from "react";
import { auth, provider } from "../../config/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [emailError, setEmailError] = useState(false); // Tambahkan state untuk kesalahan email
  const history = useNavigate();
  const setUser = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Periksa apakah password dan confirm password cocok
    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    try {
      setPasswordMatchError(false);
      // Cek apakah email sudah digunakan
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        setEmailError(false); // Reset state jika email valid
        // Email belum digunakan, daftarkan pengguna baru
        await createUserWithEmailAndPassword(auth, email, password);
        setIsRegistered(true);
        history("/login");
      } else {
        setEmailError(true); // Set state jika email telah digunakan
        alert("Email already in use.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else {
        alert("Failed Registration.");
      }
    }
  };

  const handleLogin = () => {
    history("/login");
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        history("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="Login">
      <div className="login-container">
        <h1 className="judul font-bold text-xl">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            className={`email-input ${emailError ? "error" : ""}`} // Terapkan class "error" jika emailError true
            name="email"
            type="email"
            placeholder="Email"
          />
          <br />
          <input
            className={`pass-input ${passwordMatchError ? "error" : ""}`}
            name="password"
            type="password"
            placeholder="Password"
          />
          <br />
          <input
            className={`conf-input ${passwordMatchError ? "error" : ""}`}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <br />
          <br />
          <button className="submit-button">Signup</button>
          {isRegistered && (
            <div className="success-notification">Registration Successful!</div>
          )}
          {passwordMatchError && (
            <div className="error-notification">
              Password and Confirm Password do not match.
            </div>
          )}
          {emailError && (
            <div className="error-notification">Email is already in use.</div>
          )}
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
};

export default Register;
