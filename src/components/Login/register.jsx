/* eslint-disable no-unused-vars */
// import { useState } from "react";
import { auth, db, provider } from "../../config/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import "./style.css";

const Register = () => {
  const navigate = useNavigate();
  const {dispatch} = useContext(AuthContext)


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

    createUserWithEmailAndPassword(auth, email, password)
      .then((data) => {
        console.log(data, "authData");

        const slicingEmail = email.match(/^(.+)@/);

        const userData = {
          displayName: slicingEmail[1],
          username: slicingEmail[1],
          email: data.user.email,
          password: password,
          roles: "user",
          img: null
        };

        const userDocRef = doc(db, "users", data.user.uid);

        // Gunakan setDoc untuk menambahkan data ke dokumen
        setDoc(userDocRef, userData)
          .then(() => {
            console.log("berhasil masuk");
          })
          .catch((err) => {
            console.error(err);
          });

        console.log(userData);
        // navigate("/login");
      })
      .catch((err) => {
        console.error(err);
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
        dispatch({type:"LOGIN", payload: result.user})
        const slicingEmail = result.user.email.match(/^(.+)@/);
        const userData = {
          displayName: result.user.displayName,
          username: slicingEmail[1],
          email: result.user.email,
          roles: "user",
          img: result.user.photoURL
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
        console.log(err);
      });
  };

  return (
    <div className="Login">
      <div className="login-container">
        <h1 className="judul font-bold text-xl">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="email-input"
            name="email"
            type="email"
            placeholder="Email"
          />
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
            <span>Sign Up with Google</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
