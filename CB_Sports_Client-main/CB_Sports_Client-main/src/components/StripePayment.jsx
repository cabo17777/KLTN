import { useState } from "react";
import PropTypes from "prop-types";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaCreditCard, FaLock, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
// Initialize Stripe
// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ orderId, amount, onSuccess, onCancel }) => {
  const { t, i18n } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      // Lấy base URL từ biến môi trường Vite
      const baseUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const url = `${baseUrl}/api/payment/stripe/create-payment-intent`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const { clientSecret, success, message } = await response.json();

      if (!success) {
        setCardError(message || "Payment setup failed");
        setIsProcessing(false);
        return;
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setCardError(error.message);
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        // Redirect to success page
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError("Payment processing failed. Please try again.");
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "18px",
        color: "#ffffff",
        fontWeight: "500",
        fontFamily: "'Courier New', monospace",
        "::placeholder": {
          color: "#ffffff80",
        },
      },
      invalid: {
        color: "#ff6b6b",
        iconColor: "#ff6b6b",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Credit Card Design */}
      <div className="relative">
        <label className="block mb-3 text-sm font-medium text-gray-700">
          {t("paymentForm.cardInformation")}
        </label>

        {/* Credit Card Container */}
        <div className="relative w-full max-w-sm mx-auto">
          {/* Card Background with Gradient */}
          <div className="relative p-6 transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl hover:scale-105">
            {/* Card Pattern/Texture */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl"></div>

            {/* Chip */}
            <div className="relative mb-8">
              <div className="flex items-center justify-center w-12 h-8 rounded-md shadow-md bg-gradient-to-br from-yellow-300 to-yellow-500">
                <div className="w-8 h-6 rounded-sm bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
              </div>
            </div>

            {/* Card Number Area */}
            <div className="relative mb-6">
              <div className="mb-2 text-xs font-medium text-white opacity-80">
                {t("paymentForm.cardNumber")}
              </div>
              <div className="p-3 border rounded-lg bg-white/20 backdrop-blur-sm border-white/30">
                <CardElement
                  options={cardStyle}
                  onChange={(event) => {
                    setCardError(event.error ? event.error.message : null);
                  }}
                />
              </div>
            </div>

            {/* Card Holder & Expiry */}
            <div className="relative flex items-end justify-between">
              <div>
                <div className="mb-1 text-xs font-medium text-white opacity-80">
                  {t("paymentForm.cardHolder")}
                </div>
                <div className="text-sm font-semibold tracking-wider text-white">
                  {t("paymentForm.yourName")}
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1 text-xs font-medium text-white opacity-80">
                  {t("paymentForm.validThru")}
                </div>
                <div className="text-sm font-semibold text-white">
                  {t("paymentForm.mmYY")}
                </div>
              </div>
            </div>

            {/* Card Brand Logo Area */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center justify-center w-12 h-8 rounded-md bg-white/20">
                <FaCreditCard className="w-6 h-6 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {cardError && (
          <p className="mt-3 text-sm text-center text-red-600">{cardError}</p>
        )}
      </div>
      <div className="p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("paymentForm.amountToPay")}
          </span>
          <span className="text-lg font-bold text-gray-900">
            {i18n.language === "vi"
              ? new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(amount * 25000)
              : `$${amount.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FaLock className="w-3 h-3" />
          <span> {t("paymentForm.secureInfo")}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <FaSpinner className="w-4 h-4 animate-spin" />
              {t("paymentForm.processing")}
            </>
          ) : (
            <>
              <FaCreditCard className="w-4 h-4" />
              {t("paymentForm.pay")}{" "}
              {i18n.language === "vi"
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(amount * 25000)
                : `$${amount.toFixed(2)}`}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-6 py-3 font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <img
            src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
            alt="Visa"
            className="h-6"
          />
          <img
            src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
            alt="Mastercard"
            className="h-6"
          />
        </div>
      </div>
    </form>
  );
};

const StripePayment = ({ orderId, amount, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <FaCreditCard className="w-6 h-6 text-blue-600" />
          {t("paymentForm.paywithCard")}
          <h3 className="text-xl font-semibold text-gray-900"></h3>
        </div>
        <CheckoutForm
          orderId={orderId}
          amount={amount}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </Elements>
  );
};

StripePayment.propTypes = {
  orderId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

CheckoutForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default StripePayment;
