import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Register = () => {
  const { register, googleLogin } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(fullName, email, password);
      toast.success("Account created");
      // redirect happens inside AuthContext
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) toast.error("Email already in use");
      else toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (res) => {
    setGoogleLoading(true);

    try {
      await googleLogin(res.credential);
      toast.success("Google login success");
      // redirect handled by AuthContext
    } catch {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl border border-slate-700">

        <h2 className="text-3xl text-white font-bold text-center mb-4">Register</h2>

        <form className="space-y-4" onSubmit={submit}>
          <input
            type="text"
            required
            className="w-full bg-slate-700 text-white p-2 rounded"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

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
            }`}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          {googleLoading ? (
            <p className="text-gray-300 text-sm">Connecting to Google…</p>
          ) : (
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => toast.error("Google login error")}
            />
          )}
        </div>

        <p className="text-gray-400 text-center mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-red-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
