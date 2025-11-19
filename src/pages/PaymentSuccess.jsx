import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [statusMessage, setStatusMessage] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const executedRef = useRef(false); // Prevent strict-mode double trigger

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    if (!sessionId) {
      toast.error("Missing payment session ID.");
      navigate("/");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api.get(`/orders/verify-payment/?session_id=${sessionId}`);
        const { payment_verified, status } = res.data;

        // COD handling
        if (status === "processing") {
          setStatusMessage("Order placed successfully (Cash On Delivery)");
          clearCart();
          return;
        }

        // Stripe success
        if (payment_verified) {
          setStatusMessage("Payment successful! Your order is confirmed.");
          clearCart();
        } else {
          setStatusMessage("Payment pending or failed. Please contact support.");
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatusMessage("Error verifying payment. Check your orders.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-4 flex items-center justify-center">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl p-8 shadow-xl text-center space-y-6">

        {loading ? (
          <>
            <svg className="animate-spin h-8 w-8 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-semibold">Processing Payment...</h2>
          </>
        ) : (
          <>
            <h2
              className={`text-2xl font-bold ${
                statusMessage.toLowerCase().includes("successful") ? "text-green-400" : "text-red-400"
              }`}
            >
              {statusMessage}
            </h2>

            <button
              onClick={() => navigate("/orders")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold"
            >
              Go to My Orders
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;
