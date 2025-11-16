import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ProfileDetails = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-slate-900 text-white px-4">
        <div className="bg-slate-800 p-6 rounded-lg shadow max-w-md w-full border border-slate-700">
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-slate-400">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Not provided";

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-700">
      <h2 className="text-3xl font-bold text-red-500 mb-6">My Profile</h2>

      {/* Basic Info */}
      <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>

        <div className="space-y-4 text-slate-300">
          <div>
            <span className="font-semibold text-white">Full Name:</span> {fullName}
          </div>

          <div>
            <span className="font-semibold text-white">Email:</span> {user.email}
          </div>

          <div>
            <span className="font-semibold text-white">Account Type:</span>{" "}
            {user.is_staff ? (
              <span className="text-yellow-400 font-bold">Admin</span>
            ) : (
              <span className="text-green-400 font-bold">Customer</span>
            )}
          </div>

          <div>
            <span className="font-semibold text-white">Joined On:</span>{" "}
            <span>{joinDate}</span>
          </div>
        </div>
      </div>

      {/* Contact Info (placeholder for now) */}
      <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-xl font-semibold mb-4">Contact Details</h3>

        <div className="space-y-3 text-slate-300">
          <div>
            <span className="font-semibold text-white">Phone:</span>{" "}
            <span className="italic text-slate-400">Not added</span>
          </div>

          <div>
            <span className="font-semibold text-white">Address:</span>{" "}
            <span className="italic text-slate-400">No address on file</span>
          </div>
        </div>

        <Link
          to="/profile/edit"
          className="text-red-400 underline hover:text-red-300 text-sm mt-3 inline-block"
        >
          Update contact details
        </Link>
      </div>

      {/* Actions */}
      <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Actions</h3>

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="bg-red-600 hover:bg-red-700 text-center py-2 rounded text-white transition"
          >
            View My Orders
          </Link>

          <Link
            to="/wishlist"
            className="bg-blue-600 hover:bg-blue-700 text-center py-2 rounded text-white transition"
          >
            View Wishlist
          </Link>

          <Link
            to="/profile/edit"
            className="bg-slate-700 hover:bg-slate-600 text-center py-2 rounded text-white transition"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
