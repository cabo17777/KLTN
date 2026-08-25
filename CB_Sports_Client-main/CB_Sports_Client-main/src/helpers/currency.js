import i18n from "../i18n"; // import i18n để lấy ngôn ngữ hiện tại

export const convertPrice = (price) => {
  const lang = i18n.language; // ví dụ: "en" | "vi"
  const rate = 25000; // tỷ giá tạm fix cứng

  if (lang === "vi") {
    const convertedPrice = price * rate;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(convertedPrice);
  }

  // Default: USD
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};
