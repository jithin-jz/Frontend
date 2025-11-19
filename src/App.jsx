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
import OrderSuccess from "./pages/OrderSuccess";
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


/* -------------------------------------------------------------------
   NAVBAR + FOOTER WRAPPERS (Prevent rerender loops)
-------------------------------------------------------------------- */
const NavbarWrapper = () => {
  const { user } = useAuth();
  if (user?.is_staff) return null;        // hide on admin pages
  return <Navbar />;
};

const FooterWrapper = () => {
  const { user } = useAuth();
  if (user?.is_staff) return null;
  return <Footer />;
};


/* -------------------------------------------------------------------
   MAIN ROUTE WRAPPER (Stable, no re-mounts)
-------------------------------------------------------------------- */
const MainRoutes = () => {
  const { loading } = useAuth();

  if (loading) return <Loader />;        // waits for /auth/me once

  return (
    <Routes>

      {/* ---------------- PUBLIC ---------------- */}
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

      {/* ---------------- USER PROTECTED ---------------- */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      {/* COD success page */}
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileDetails />
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <AdminRoute>
            <AdminUserDetails />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products/add"
        element={
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products/edit/:id"
        element={
          <AdminRoute>
            <EditProduct />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrderManagement />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <Reports />
          </AdminRoute>
        }
      />

    </Routes>
  );
};


/* -------------------------------------------------------------------
   ROOT APP (Correct placement, no more re-renders)
-------------------------------------------------------------------- */
const App = () => (
  <Router>
    <AuthProvider>
      <CartProvider>

        <NavbarWrapper />

        <main className="min-h-screen bg-gray-900 text-white">
          <MainRoutes />
        </main>

        <FooterWrapper />

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
