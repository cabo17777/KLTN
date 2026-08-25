import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaListAlt,
  FaPrint,
  FaShare,
  FaTruck,
  FaCalendarAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id");
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    const confirmPaymentAndFetchOrder = async () => {
      if (!orderId || !paymentIntentId) {
        toast.error("Invalid payment confirmation");
        navigate("/orders");
        return;
      }

      const BASE_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

      try {
        const token = localStorage.getItem("token");

        // Confirm payment with backend
        const confirmResponse = await fetch(
          `${BASE_URL}/api/payment/stripe/confirm-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              paymentIntentId,
              orderId,
            }),
          }
        );

        const confirmData = await confirmResponse.json();
        if (confirmData.success) {
          setOrder(confirmData.order);
          toast.success("Payment confirmed successfully!");
        } else {
          toast.error(confirmData.message || "Payment confirmation failed");
          navigate("/orders");
        }
      } catch (error) {
        console.error("Payment confirmation error:", error);
        toast.error("Failed to confirm payment");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    confirmPaymentAndFetchOrder();
  }, [orderId, paymentIntentId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order Confirmation - ${order._id}`,
          text: `My order for $${order.amount} has been confirmed!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Order Not Found
          </h2>
          <p className="mb-4 text-gray-600">
            Unable to confirm your payment. Please contact support.
          </p>
          <Link
            to="/orders"
            className="px-6 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="text-white bg-gradient-to-r from-green-500 to-green-600">
        <Container className="py-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-white rounded-full"
            >
              <FaCheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold">Payment Successful!</h1>
            <p className="mb-2 text-xl opacity-90">
              Thank you for your purchase
            </p>
            <p className="text-lg opacity-80">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4"
          >
            <Link
              to="/"
              className="p-4 transition-all bg-white border border-gray-200 rounded-lg hover:shadow-md group"
            >
              <div className="text-center">
                <FaHome className="w-6 h-6 mx-auto mb-2 text-gray-600 transition-colors group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Home</span>
              </div>
            </Link>

            <Link
              to="/shop"
              className="p-4 transition-all bg-white border border-gray-200 rounded-lg hover:shadow-md group"
            >
              <div className="text-center">
                <FaShoppingBag className="w-6 h-6 mx-auto mb-2 text-gray-600 transition-colors group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Shop More
                </span>
              </div>
            </Link>

            <Link
              to="/orders"
              className="p-4 transition-all bg-white border border-gray-200 rounded-lg hover:shadow-md group"
            >
              <div className="text-center">
                <FaListAlt className="w-6 h-6 mx-auto mb-2 text-gray-600 transition-colors group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  My Orders
                </span>
              </div>
            </Link>

            <button
              onClick={handlePrint}
              className="p-4 transition-all bg-white border border-gray-200 rounded-lg hover:shadow-md group"
            >
              <div className="text-center">
                <FaPrint className="w-6 h-6 mx-auto mb-2 text-gray-600 transition-colors group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Print</span>
              </div>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Order Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Payment Confirmation */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="p-6 bg-white border border-gray-200 rounded-lg"
              >
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-green-800">
                          Payment Status
                        </div>
                        <div className="text-lg font-bold text-green-900">
                          PAID
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <FaTruck className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">
                          Order Status
                        </div>
                        <div className="text-lg font-bold text-blue-900">
                          CONFIRMED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Paid on {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="overflow-hidden bg-white border border-gray-200 rounded-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center p-6 space-x-4"
                    >
                      <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          <PriceFormat amount={item.price * item.quantity} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="p-6 border border-blue-200 rounded-lg bg-blue-50"
              >
                <h2 className="mb-4 text-xl font-semibold text-blue-900">
                  What&apos;s Next?
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">
                        Order Confirmation
                      </p>
                      <p className="text-sm text-blue-700">
                        You&apos;ll receive a confirmation email shortly with
                        your order details.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Processing</p>
                      <p className="text-sm text-blue-700">
                        We&apos;ll start processing your order within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Shipping</p>
                      <p className="text-sm text-blue-700">
                        Track your order status in the &quot;My Orders&quot;
                        section.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="sticky p-6 bg-white border border-gray-200 rounded-lg top-8">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="pb-6 mb-6 space-y-3 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({order.items.length} items)
                    </span>
                    <span className="font-medium">
                      <PriceFormat amount={order.amount} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total Paid</span>
                    <span className="text-green-600">
                      <PriceFormat amount={order.amount} />
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-gray-900 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <FaShare className="w-4 h-4" />
                    Share Order
                  </button>

                  <Link
                    to="/shop"
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <FaShoppingBag className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentSuccess;
