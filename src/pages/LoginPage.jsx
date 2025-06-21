import React from "react";
import { Eye, EyeOff } from "lucide-react";

function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.startsWith("./admin")) {
      window.open("http://localhost:5174", "_blank");
    } else if (username.startsWith("./lib")) {
      window.open("http://localhost:5175", "_blank");
    } else {
      alert("Invalid username prefix. Use 'admin' or 'lib'");
    }
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
            Login
          </h2>
          <hr />

          <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 transition-all text-white font-semibold rounded-lg shadow"
            >
              Login
            </button>
          </form>

          <div className="text-sm text-center text-gray-600 mt-6 space-y-1">
            <p>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </p>
            <p>
              Don’t have an account?{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
