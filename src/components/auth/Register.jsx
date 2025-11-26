import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Register = () => {
  const { register, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { firstName, lastName, email, password } = formData;

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(firstName, lastName, email, password);
      toast.success("Account created successfully");
    } catch (err) {
      const data = err?.response?.data;
      let msg = "Registration failed";
      if (data?.email) msg = data.email[0];
      else if (data?.password) msg = data.password[0];
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (response) => {
    setGoogleLoading(true);
    try {
      await googleLogin(response.credential);
      toast.success("Google login successful");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const disabled = loading || googleLoading;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-sm w-full bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl text-white font-bold text-center mb-5">
          Create Account
        </h2>

        <form className="space-y-3" onSubmit={submit}>
          <input
            type="text"
            name="firstName"
            required
            value={firstName}
            onChange={onChange}
            placeholder="First Name"
            className="w-full bg-slate-700 text-white p-2.5 rounded border border-slate-600"
          />

          <input
            type="text"
            name="lastName"
            required
            value={lastName}
            onChange={onChange}
            placeholder="Last Name"
            className="w-full bg-slate-700 text-white p-2.5 rounded border border-slate-600"
          />

          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={onChange}
            placeholder="Email"
            className="w-full bg-slate-700 text-white p-2.5 rounded border border-slate-600"
          />

          <input
            type="password"
            name="password"
            required
            minLength={8}
            value={password}
            onChange={onChange}
            placeholder="Password (min 8 characters)"
            className="w-full bg-slate-700 text-white p-2.5 rounded border border-slate-600"
          />

          <button
            type="submit"
            disabled={disabled}
            className={`w-full p-2.5 rounded text-lg font-semibold text-white transition
            ${disabled ? "bg-red-800 opacity-70 cursor-not-allowed"
                       : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center space-y-2">
          <div className="text-gray-500">OR</div>

          {googleLoading ? (
            <p className="text-gray-300 text-sm">Connecting...</p>
          ) : (
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => toast.error("Google sign-in error")}
              disabled={loading}
            />
          )}
        </div>

        <p className="text-gray-400 text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-400 hover:text-red-300 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
