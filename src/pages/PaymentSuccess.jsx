import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import useCartStore from "../store/useCartStore";
import Loader from "../components/Loader";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reloadCart = useCartStore((state) => state.loadCart);

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
      // Reload cart from backend (backend already cleared it after order creation)
      try {
        await reloadCart();
      } catch (err) {
        console.error("Error reloading cart:", err);
      }

      // Then verify payment status for display purposes
      try {
        const res = await api.get(`/orders/verify-payment/?session_id=${sessionId}`);
        const { payment_verified, status } = res.data;

        // Display appropriate message based on payment status
        if (status === "processing" || status === "paid") {
          setStatusMessage("Payment successful! Your order is confirmed.");
        } else if (payment_verified) {
          setStatusMessage("Payment successful! Your order is confirmed.");
        } else {
          setStatusMessage("Order created. Payment is being processed...");
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatusMessage("Order created successfully. Check your orders for details.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, reloadCart]);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-20 px-4 flex items-center justify-center">
      <div className="max-w-xl mx-auto bg-slate-800 rounded-xl p-8 shadow-xl text-center space-y-6">

        {loading ? (
          <div className="space-y-6">
            <Loader />
            <h2 className="text-2xl font-semibold">Processing Payment...</h2>
          </div>
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
