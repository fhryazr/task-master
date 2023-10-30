/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { auth, db, provider } from "../../config/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import "./style.css";

const Register = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleEmailChange = () => {
    // Mengatur emailError menjadi false saat email diubah
    setEmailError(false);
  };

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

    createUserWithEmailAndPassword(auth, email, password)
      .then((data) => {
        // Mengirim email verifikasi
        sendEmailVerification(auth.currentUser)
          .then(() => {
            // Email verifikasi berhasil dikirim
            alert("Email verifikasi dikirim");
          })
          .catch((error) => {
            console.error("Error mengirim email verifikasi:", error);
          });

        console.log(data, "authData");

        const slicingEmail = email.match(/^(.+)@/);

        const userData = {
          displayName: slicingEmail[1],
          username: slicingEmail[1],
          email: data.user.email,
          password: password,
          roles: "user",
          img: "defaulProfilePicture.jpg",
        };

        const userDocRef = doc(db, "users", data.user.uid);

        // Gunakan setDoc untuk menambahkan data ke dokumen
        setDoc(userDocRef, userData)
          .then(() => {
            console.log("berhasil masuk");
          })
          .catch((err) => {
            console.error(err);
            setEmailError(true);
          });

        console.log(userData);
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        setEmailError(true);
        // setRegister(true);
      });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // console.log(result);
        dispatch({ type: "LOGIN", payload: result.user });
        const slicingEmail = result.user.email.match(/^(.+)@/);
        const userData = {
          displayName: result.user.displayName,
          username: slicingEmail[1],
          email: result.user.email,
          roles: "user",
          img: result.user.photoURL,
        };

        const userDocRef = doc(db, "users", result.user.uid);

        // Gunakan setDoc untuk menambahkan data ke dokumen
        setDoc(userDocRef, userData)
          .then(() => {
            console.log("berhasil masuk");
          })
          .catch((err) => {
            console.error(err);
          });

        // console.log(userData)
        navigate("/");
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
            <span>Sign Up with Google</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
