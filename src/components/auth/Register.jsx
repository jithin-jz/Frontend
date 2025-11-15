import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register: registerUser, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(name, email, password);
      toast.success("Registered successfully");

      // DO NOT redirect manually, AuthContext already does the redirect
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      await googleLogin(res.credential);
      toast.success("Signed in with Google");
      
      // DO NOT redirect manually, AuthContext handles it
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 border border-slate-700 bg-slate-800 rounded-xl shadow-md p-8">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Register</h2>
          <p className="mt-2 text-sm text-gray-400">
            Already a member?
            <Link
              to="/login"
              className="text-red-500 hover:underline font-medium ml-1"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-md"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google sign-in failed")}
          />
        </div>

      </div>
    </div>
  );
};

export default Register;
