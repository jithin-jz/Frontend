import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import useCartStore from "../store/useCartStore";
import { Check } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reloadCart = useCartStore((state) => state.loadCart);

  const [statusMessage, setStatusMessage] = useState("Verifying payment...");
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const sessionId = searchParams.get("session_id");
  const executedRef = useRef(false);

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
        await reloadCart();
      } catch (err) {
        console.error("Error reloading cart:", err);
      }

      try {
        const res = await api.get(`/orders/verify-payment/?session_id=${sessionId}`);
        const { payment_verified, status } = res.data;

        if (status === "processing" || status === "paid" || payment_verified) {
          setStatusMessage("Payment successful! Your order is confirmed.");
          setIsSuccess(true);
        } else {
          setStatusMessage("Order created. Payment is being processed...");
          setIsSuccess(false);
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatusMessage("Order created successfully. Check your orders for details.");
        setIsSuccess(true);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, reloadCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-scaleIn shadow-2xl">
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className={`text-3xl font-bold ${
            isSuccess ? "text-green-400" : "text-yellow-400"
          }`}>
            {isSuccess ? "Order Confirmed!" : "Processing..."}
          </h1>
          
          <p className="text-slate-300 text-lg">
            {statusMessage}
          </p>
          
          <p className="text-slate-500 text-sm">
            You'll receive an email confirmation shortly
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate("/orders")}
            className="w-full px-4 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes scaleIn {
          0% { 
            transform: scale(0); 
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% { 
            transform: scale(1); 
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
