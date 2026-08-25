import { useState } from "react";
import { motion } from "framer-motion";
import Container from "./Container";
import { Button } from "./ui/button";
import { paymentCard } from "../assets/images";
import SocialLinks from "./SocialLinks";
import { logoLight } from "../assets/images";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [emailInfo, setEmailInfo] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const emailValidation = () => {
    return String(emailInfo)
      .toLocaleLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleSubscription = () => {
    if (emailInfo === "") {
      setErrMsg("Please provide an Email !");
    } else if (!emailValidation(emailInfo)) {
      setErrMsg("Please give a valid Email!");
    } else {
      setSubscription(true);
      setErrMsg("");
      setEmailInfo("");
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <Container className="py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to={"/"} className="flex-shrink-0 mb-10">
              <img src={logoLight} alt="logo" className="w-auto h-[80px]" />
            </Link>
            <p className="mb-6 leading-relaxed text-gray-600">
              {t("footer.brandDescription")}
            </p>
            <SocialLinks
              className="text-gray-400 hover:text-gray-900"
              iconStyle="w-5 h-5 transition-colors duration-200"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-gray-900">
              {t("footer.quickLinks.title")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.quickLinks.about")}
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.quickLinks.shop")}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.quickLinks.contact")}
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.quickLinks.faq")}
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-gray-900">
              {t("footer.categories.title")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/shop?category=Nike"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.categories.nike")}
                </a>
              </li>
              <li>
                <a
                  href="/shop?category=Adidas"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.categories.adidas")}
                </a>
              </li>
              <li>
                <a
                  href="/shop?category=Mizuno"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.categories.mizuno")}
                </a>
              </li>
              <li>
                <a
                  href="/shop?category=Puma"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("footer.categories.puma")}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-gray-900">
              {t("footer.newsletter.title")}
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              {t("footer.newsletter.description")}
            </p>

            {subscription ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-green-200 rounded-lg bg-green-50"
              >
                <p className="text-sm font-medium text-green-700">
                  ✓ {t("footer.newsletter.success")}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div>
                  <input
                    onChange={(e) => setEmailInfo(e.target.value)}
                    value={emailInfo}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900"
                    type="email"
                    placeholder={t("footer.newsletter.placeholder")}
                  />
                  {errMsg && (
                    <p className="mt-2 text-xs text-red-500 animate-pulse">
                      {errMsg}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSubscription}
                  className="w-full py-3 text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                >
                  {t("footer.newsletter.subscribe")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2025 HL_Sports. {t("footer.copyright")}
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {t("footer.payment")}
              </span>
              <img
                src={paymentCard}
                alt="Payment methods"
                className="object-contain h-8 opacity-60"
              />
            </div>

            {/* Legal Links */}
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                {t("footer.privacy")}
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                {t("footer.terms")}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
