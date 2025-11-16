import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Shared Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

// Route Guards
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
import AdminRoute from "./Routes/AdminRoute";

// User Pages
import Home from "./pages/Home";
import Products from "./pages/Products/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProfileDetails from "./pages/ProfileDetails";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Admin Pages
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import AdminProducts from "./admin/Products";
import Reports from "./admin/Reports";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import AdminUserDetails from "./admin/AdminUserDetails";
import AdminOrderManagement from "./admin/AdminOrderManagement";

// -------------------------------------------------------------------
// APP CONTENT (AUTH-READY)
// -------------------------------------------------------------------
const AppContent = () => {
  const { loading, user } = useAuth();

  // Critical fix: Wait until AuthContext finishes fetching /auth/me
  if (loading) return <Loader />;

  const isAdmin = Boolean(user?.is_staff);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">

      {/* Hide navbar/footer for admin */}
      {!isAdmin && <Navbar />}

      <main className="flex-grow">
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<SingleProduct />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* User Protected */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileDetails /></ProtectedRoute>} />

          {/* ---------------- ADMIN ---------------- */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetails /></AdminRoute>} />

          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />

          <Route path="/admin/orders" element={<AdminRoute><AdminOrderManagement /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />

        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
};

// -------------------------------------------------------------------
// ROOT APP
// -------------------------------------------------------------------
const App = () => (
  <Router>
    <AuthProvider>
      <CartProvider>
        <AppContent />

        <ToastContainer
          position="bottom-right"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
          toastClassName="text-xs px-3 py-1 rounded-full min-h-0 h-auto"
          bodyClassName="m-0 p-0"
        />
      </CartProvider>
    </AuthProvider>
  </Router>
);

export default App;
