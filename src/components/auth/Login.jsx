import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await login(email, password);
      // NO navigate("/") here, AuthContext handles all redirects
    } catch {
      setErrorMessage("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await googleLogin(response.credential);
      // No manual redirect, AuthContext handles it
    } catch {
      setErrorMessage("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-slate-800 border border-slate-700 rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm font-medium text-center">
            {errorMessage}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-600 text-white rounded-md"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMessage("Google sign-in failed")}
          />
        </div>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
