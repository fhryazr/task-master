import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import "./reset.css";

function ForgotPassword() {
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    try {
      await sendPasswordResetEmail(auth, emailVal);
      alert("Check your email for password reset instructions.");
    } catch (error) {
      alert("Password reset failed. Please check your email and try again.");
      console.error("Error sending password reset email:", error);
    }
  };

  const handleLogin = () => {
    history("/login");
  };

  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="judul font-bold text-4xl text-white pt-12">
          Task Master
        </h1>{" "}
        <div className="Reset">
          <div className="reset-container">
            <h2 className="judul font-bold text-xl">Reset Password</h2>{" "}
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md mb-4"
              />
              <button
                type="submit"
                className="submit-button bg-indigo-600 text-white rounded-md py-2"
              >
                Reset
              </button>
              <p>
                Back to{" "}
                <a className="login-link" onClick={handleLogin}>
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
