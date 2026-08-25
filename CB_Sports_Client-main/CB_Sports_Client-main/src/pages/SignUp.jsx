import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { serverUrl } from "../../config";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import Container from "../components/Container";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // ============= Initial State Start here =============
  const { t } = useTranslation();
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = "user"; // Fixed role as user, not editable

  // ============= Error Messages =================
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  // ============= Event Handlers =============
  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  // ================= Email Validation =============
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!checked) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    // Reset errors
    setErrClientName("");
    setErrEmail("");
    setErrPassword("");

    let hasError = false;

    if (!clientName) {
      setErrClientName("Enter your full name");
      hasError = true;
    }

    if (!email) {
      setErrEmail("Enter your email");
      hasError = true;
    } else if (!EmailValidation(email)) {
      setErrEmail("Enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setErrPassword("Create a password");
      hasError = true;
    } else if (password.length < 6) {
      setErrPassword("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${serverUrl}/api/user/register`, {
        name: clientName,
        email,
        password,
        role, // Always "user"
      });
      const data = response?.data;
      if (data?.success) {
        toast.success(data?.message);
        navigate("/signin");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("User registration error", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100 sm:px-6 lg:px-8">
      <Container>
        <div className="sm:w-[450px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-white shadow-xl rounded-2xl"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full"
              >
                <FaUserPlus className="text-2xl text-white" />
              </motion.div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {t("signup.createAccount")}
              </h1>
              <p className="text-gray-600">{t("signup.joinMessage")}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  {t("signup.fullName")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    value={clientName}
                    onChange={handleName}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errClientName ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors`}
                    placeholder={t("signup.enterFullName")}
                  />
                </div>
                {errClientName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-2 text-sm text-red-600"
                  >
                    <span className="font-bold">!</span>
                    {errClientName}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  {t("signup.email")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmail}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errEmail ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors`}
                    placeholder={t("signup.enterEmail")}
                  />
                </div>
                {errEmail && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-2 text-sm text-red-600"
                  >
                    <span className="font-bold">!</span>
                    {errEmail}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  {t("signup.createPassword")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePassword}
                    className={`block w-full pl-10 pr-12 py-3 border ${
                      errPassword ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors`}
                    placeholder={t("signup.accountType")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 mt-2 text-sm text-red-600"
                  >
                    <span className="font-bold">!</span>
                    {errPassword}
                  </motion.p>
                )}
              </div>

              {/* Role Field (Read-only) */}
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  {t("signup.accountType")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaCheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    value={t("signup.accountType")}
                    readOnly
                    className="block w-full py-3 pl-10 pr-3 text-gray-600 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {t("signup.accountTypeDesc")}
                </p>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    {t("signup.termsAgreement")}{" "}
                    <Link
                      to="#"
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {t("signup.termsOfService")}
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {t("signup.privacyPolicy")}
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: checked ? 1.02 : 1 }}
                whileTap={{ scale: checked ? 0.98 : 1 }}
                type="submit"
                disabled={!checked || isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                  checked
                    ? "bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    : "bg-gray-400 cursor-not-allowed"
                } disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    {t("signup.creatingAccount")}{" "}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t("signup.createAccount")}
                    <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">
                    {t("signup.alreadyHaveAccount")}
                  </span>
                </div>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {t("signup.signIn")}
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default SignUp;
