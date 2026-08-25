import { FaCrown, FaStar, FaRocket, FaGift } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import PropTypes from "prop-types";

const PremiumMessage = ({
  title = "Premium Feature",
  description = "This feature is available in the premium version only.",
  features = [],
  showDemoPreview = false,
}) => {
  const defaultFeatures = [
    "Advanced analytics and reporting",
    "Unlimited orders and invoices",
    "Priority customer support",
    "Custom branding options",
    "API access and integrations",
    "Advanced user management",
  ];

  const featureList = features.length > 0 ? features : defaultFeatures;

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        {/* Premium Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full shadow-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600">
            <FaCrown className="text-4xl text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <HiSparkles className="text-2xl text-purple-600" />
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
              {title}
            </h1>
            <HiSparkles className="text-2xl text-purple-600" />
          </div>

          <p className="max-w-2xl mx-auto text-xl leading-relaxed text-gray-600">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 mb-12 md:grid-cols-2">
          {/* Feature List */}
          <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <FaStar className="text-2xl text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Premium Features
              </h2>
            </div>

            <ul className="space-y-4">
              {featureList.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-white">✓</span>
                  </div>
                  <span className="leading-relaxed text-gray-700">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrade Benefits */}
          <div className="p-8 text-white shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <FaRocket className="text-2xl" />
              <h2 className="text-2xl font-bold">Why Upgrade?</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaGift className="flex-shrink-0 mt-1 text-2xl text-yellow-300" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Full Access</h3>
                  <p className="text-purple-100">
                    Unlock all premium features and capabilities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <HiSparkles className="flex-shrink-0 mt-1 text-2xl text-yellow-300" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Support Development
                  </h3>
                  <p className="text-purple-100">
                    Help us continue improving and adding new features
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaStar className="flex-shrink-0 mt-1 text-2xl text-yellow-300" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Priority Support
                  </h3>
                  <p className="text-purple-100">
                    Get faster responses and dedicated assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Preview */}
        {showDemoPreview && (
          <div className="p-8 mb-12 bg-white border border-gray-100 shadow-xl rounded-2xl">
            <h3 className="mb-6 text-2xl font-bold text-center text-gray-900">
              Preview of Premium Features
            </h3>
            <div className="p-6 border-2 border-gray-300 border-dashed bg-gray-50 rounded-xl">
              <div className="text-center text-gray-500">
                <FaCrown className="mx-auto mb-4 text-4xl text-yellow-500" />
                <p className="text-lg font-medium">
                  Interactive Demo Available in Premium
                </p>
                <p className="mt-2 text-sm">
                  Get instant access to all features and capabilities
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="px-4 py-2 text-sm font-medium text-center text-white shadow-sm bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>📞 0909 123 456</span>
            <span>📍 TP Huế, Việt Nam</span>
            <a href="#">
              <span>✉️ support@yourshop.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

PremiumMessage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  features: PropTypes.array,
  showDemoPreview: PropTypes.bool,
};

export default PremiumMessage;
