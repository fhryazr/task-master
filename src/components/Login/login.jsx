import { useState } from "react";
import { auth, provider } from "../../config/FirebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

function Login() {
  const [setLogin] = useState(false);
  const navigate = useNavigate();
  const [loginAttempts, setLoginAttempts] = useState(0);

  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user.emailVerified) {
        setLoginAttempts(0);
        // Pengguna telah memverifikasi email
        // Lanjutkan dengan login
        dispatch({ type: "LOGIN", payload: userCredential.user });
        if (userCredential.user.uid === "2AFvQr96kTRjcsjpyThP09WVzkU2") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // Email belum diverifikasi, tampilkan pesan kesalahan
        alert("Please verify your email before logging in.");
      }
    } catch (error) {
      // Handle kesalahan login di sini
      alert("Invalid email or password.");
      console.error(error);
      setLogin(true);

      setLoginAttempts(loginAttempts + 1);
      if (loginAttempts >= 5) {
        navigate("/reset");
      }
    }
  };

  const handleReset = () => {
    navigate("/reset");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const checkIfUserExists = async (user) => {
    const userDocRef = doc(db, "users", user.uid);

    try {
      const docSnapshot = await getDoc(userDocRef);
      return docSnapshot.exists();
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // console.log(result);
        const isUserExist = await checkIfUserExists(result.user);

        dispatch({ type: "LOGIN", payload: result.user });
        if (!isUserExist) {
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
          try {
            await setDoc(userDocRef, userData);
          } catch (error) {
            console.log(error);
          }
        }

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
        <h1 className="judul font-bold text-xl">Login</h1>
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
          <p className="forgot" onClick={handleReset}>
            Forgot Password?
          </p>
          <br />
          <button className="submit-button">Login</button>
          <p>
            Don&apos;t have an account?{" "}
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
