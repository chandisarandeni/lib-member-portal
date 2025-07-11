import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const {sendResetEmail} = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can replace this with actual password reset logic
    alert(`Password reset link sent to ${email}`);
    sendResetEmail(email)
      .then(response => {
        console.log("Reset email sent successfully:", response);
        alert("Password reset link sent to your email.");
      })
      .catch(error => {
        console.error("Error sending reset email:", error);
        alert("Failed to send password reset link. Please try again.");
      });
  };

  return (
    <div className="flex h-screen bg-gray-50 font-courier">
      {/* Left Side */}
      <div className="w-1/2 hidden lg:flex flex-col items-center justify-center bg-white p-12 border-r border-gray-200">
        <img
          src="/sarasavi-logo-black.png"
          alt="Logo"
          className="w-[280px] mb-0 pt-0"
        />
        <h1 className="text-[35px] font-extrabold text-gray-800 mb-3">
          Sarasavi Library
        </h1>
        <p className="text-gray-600 text-center max-w-xs leading-relaxed">
          To create an accessible library management system that connects
          readers with books effortlessly.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Forgot Password
          </h2>
          <hr />

          <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 transition-all text-white font-semibold rounded-lg shadow"
            >
              Send Reset Link
            </button>
          </form>

          <div className="text-sm text-center text-gray-600 mt-6">
            <p>
              Remember your password?
              <Link to="/" className="text-blue-600 hover:underline ml-2">
                Go back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;