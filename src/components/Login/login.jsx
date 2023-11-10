import { useState, useContext } from "react";
import { auth, provider, db } from "../../config/FirebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { AuthContext } from "../../context/AuthContext";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  // eslint-disable-next-line no-unused-vars
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const notifyFailed = (message) => {
    toast.warn(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

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

      if (userCredential.user) {
        dispatch({ type: "LOGIN", payload: userCredential.user });

        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const userData = userDoc.data();
        if (userData && userData.roles === "admin") {
          navigate("/admin");
        } else if (userCredential.user.emailVerified) {
          navigate("/");
        }
      } else {
        notifyFailed("Please verify your email before logging in.");
      }
    } catch (error) {
      notifyError("Invalid email or passord");
      console.error(error);
      setLogin(true);
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
            status: "free",
            createdAt: new Date(),
          };

          const userDocRef = doc(db, "users", result.user.uid);

          try {
            await setDoc(userDocRef, userData);
          } catch (error) {
            console.log(error);
          }
        }

        // Periksa peran pengguna di Firestore
        const userDoc = await getDoc(doc(db, "users", result.user.uid));
        const userData = userDoc.data();
        if (userData && userData.roles === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
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
      <ToastContainer />
    </div>
  );
}

export default Login;
