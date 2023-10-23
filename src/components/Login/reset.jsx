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

  const handleCancel = () => {
    history("/login"); // Redirect to the login page on cancel
  };

  return (
    <div className="Reset">
      <div className="reset-box">
        <h1>Forgot Password</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input name="email" placeholder="Enter your email" />
          <button type="reset-submit">Reset</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
