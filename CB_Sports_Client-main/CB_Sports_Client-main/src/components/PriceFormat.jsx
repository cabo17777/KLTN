import { cn } from "./ui/cn";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// Map ngôn ngữ -> locale + currency
const currencyMap = {
  en: { locale: "en-US", currency: "USD", rate: 1 },
  vi: { locale: "vi-VN", currency: "VND", rate: 25000 },
};

const PriceFormat = ({ amount, className }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const { locale, currency, rate } = currencyMap[lang] || currencyMap.en;

  // Nếu không có số hoặc NaN thì gán = 0
  const numericAmount =
    typeof amount === "number" && !isNaN(amount) ? amount : 0;

  // Quy đổi theo tỷ giá
  const displayAmount = numericAmount * rate;

  // Format số theo locale + currency
  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(displayAmount);

  return <span className={cn(className)}>{formattedAmount}</span>;
};

PriceFormat.propTypes = {
  amount: PropTypes.number,
  className: PropTypes.string,
};

export default PriceFormat;
