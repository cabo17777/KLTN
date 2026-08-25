import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import StripePayment from "../components/StripePayment";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBillWave,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Checkout = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState("selection"); // 'selection', 'stripe', 'processing'

  const fetchOrderDetails = useCallback(async () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/order/user/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error("Order not found");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, fetchOrderDetails]);

  const handlePayment = async (paymentMethod) => {
    if (paymentMethod === "stripe") {
      setPaymentStep("stripe");
    } else if (paymentMethod === "cod") {
      toast.success("Order confirmed with Cash on Delivery");
    }
  };

  const handleStripeSuccess = (paymentIntentId) => {
    // Redirect to success page with payment details
    navigate(
      `/payment-success?order_id=${orderId}&payment_intent=${paymentIntentId}`
    );
  };

  const handleStripeCancel = () => {
    setPaymentStep("selection");
  };

  const handlePayOnline = () => {
    setPaymentStep("stripe");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Loading order details...</p>
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
            The requested order could not be found.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-8">
          <div className="flex items-center gap-3 mb-4">
            <FaCheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("OrderConfirmation.Title")}
              </h1>
              <p className="text-gray-600">
                {t("OrderConfirmation.OrderID")}
                {order._id}
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Order Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Status */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {t("OrderConfirmation.OrderStatus")}
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t("OrderConfirmation.OrderStatus")}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t("OrderConfirmation.Payment")}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {t("OrderConfirmation.PlacedOn")}{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("OrderConfirmation.OrderItems")}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center p-6 space-x-4">
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
                        {t("OrderConfirmation.Q")} {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        <PriceFormat amount={item.price} />
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("OrderConfirmation.Total")}{" "}
                        <PriceFormat amount={item.price * item.quantity} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-900">
                <FaMapMarkerAlt className="w-5 h-5" />
                {t("OrderConfirmation.DeliveryAddress")}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">
                    {order.address.firstName} {order.address.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{order.address.email}</span>
                </div>
                {order.address.phone && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{order.address.phone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="text-gray-600">
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state}{" "}
                      {order.address.zipcode}
                    </p>
                    <p>{order.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white border border-gray-200 rounded-lg top-8">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {t("OrderConfirmation.PaymentTitle")}
              </h2>

              {/* Order Summary */}
              <div className="pb-6 mb-6 space-y-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("OrderConfirmation.Subtt")} ({order.items.length}{" "}
                    {t("OrderConfirmation.items")})
                  </span>
                  <span className="font-medium">
                    <PriceFormat amount={order.amount} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("OrderConfirmation.ship")}
                  </span>
                  <span className="font-medium text-green-600">
                    {t("OrderConfirmation.free")}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">
                    {t("OrderConfirmation.tal")}
                  </span>
                  <span className="text-gray-900">
                    <PriceFormat amount={order.amount} />
                  </span>
                </div>
              </div>

              {/* Payment Options */}
              {order.paymentStatus === "pending" && (
                <div className="space-y-4">
                  {paymentStep === "selection" && (
                    <>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">
                        {t("OrderConfirmation.choose")}
                      </h3>

                      {order.paymentMethod === "cod" ? (
                        <div className="space-y-3">
                          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex items-center gap-3">
                              <FaMoneyBillWave className="w-6 h-6 text-green-600" />
                              <div>
                                <h4 className="font-semibold text-green-800">
                                  {t("OrderConfirmation.cash")}
                                </h4>
                                <p className="text-sm text-green-700">
                                  {t("OrderConfirmation.pay")}
                                </p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handlePayOnline}
                            className="flex items-center justify-center w-full gap-3 px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            <FaCreditCard className="w-5 h-5" />
                            {t("OrderConfirmation.payOnline")}
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePayment("stripe")}
                            className="flex items-center justify-center w-full gap-3 px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            <FaCreditCard className="w-5 h-5" />
                            {t("OrderConfirmation.paycard")}
                          </button>

                          <button
                            onClick={() => handlePayment("cod")}
                            className="flex items-center justify-center w-full gap-3 px-4 py-3 font-medium text-gray-900 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            <FaMoneyBillWave className="w-5 h-5" />
                            {t("OrderConfirmation.CashOnDelivery")}
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {paymentStep === "stripe" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={handleStripeCancel}
                          className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                        >
                          <FaArrowLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t("OrderConfirmation.PaymentDetails")}
                        </h3>
                      </div>

                      <StripePayment
                        orderId={orderId}
                        amount={order.amount}
                        onSuccess={handleStripeSuccess}
                        onCancel={handleStripeCancel}
                      />
                    </div>
                  )}
                </div>
              )}

              {order.paymentStatus === "paid" && (
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        {t("OrderConfirmation.PaymentCompleted")}
                      </h4>
                      <p className="text-sm text-green-700">
                        {t("OrderConfirmation.PaymentSuccess")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full px-4 py-3 font-medium text-gray-900 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {t("OrderConfirmation.ViewAllOrders")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Checkout;
