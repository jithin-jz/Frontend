import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Redirect handled inside AuthContext
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400 || status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (response) => {
    setGoogleLoading(true);
    setError("");

    try {
      await googleLogin(response.credential);
      // Redirect handled inside AuthContext
    } catch {
      setError("Google login failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl border border-slate-700">
        <h2 className="text-3xl text-white font-bold text-center mb-4">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={submit}>
          <input
            type="email"
            required
            className="w-full bg-slate-700 text-white p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            className="w-full bg-slate-700 text-white p-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading || googleLoading}
            className={`w-full p-2 rounded text-white transition 
              ${
                loading || googleLoading
                  ? "bg-red-800 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          {googleLoading ? (
            <div className="text-gray-300 text-sm">Connecting to Google…</div>
          ) : (
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          )}
        </div>

        <p className="text-gray-400 text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-400 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
