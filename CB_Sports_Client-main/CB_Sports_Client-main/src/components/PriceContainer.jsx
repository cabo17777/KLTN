import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import PriceFormat from "./PriceFormat";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

const PriceContainer = ({ item, className }) => {
  const { products } = useSelector((state) => state.orebiReducer);
  const [existingProduct, setExistingProduct] = useState(null);
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  // map i18n.language -> locale
  const localeMap = {
    en: "en-US",
    vi: "vi-VN",
  };
  const locale = localeMap[lang] || "en-US";

  useEffect(() => {
    const availableItem = products.find(
      (product) => product?._id === item?._id
    );
    setExistingProduct(availableItem || null);
  }, [products, item]);

  const regularPrice = () => {
    if (existingProduct) {
      const price = existingProduct?.price || 0;
      const discountPercentage = existingProduct?.discountedPercentage || 0;
      const quantity = existingProduct?.quantity || 1;
      return (price + (discountPercentage * price) / 100) * quantity;
    } else {
      const price = item?.price || 0;
      const discountPercentage = item?.discountedPercentage || 0;
      return price + (discountPercentage * price) / 100;
    }
  };

  const discountedPrice = () => {
    if (existingProduct) {
      const price = item?.price || 0;
      const quantity = existingProduct?.quantity || 1;
      return price * quantity;
    } else {
      return item?.price || 0;
    }
  };

  return (
    <div
      className={twMerge("flex items-center justify-center gap-2", className)}
    >
      {item?.offer && item?.discountedPercentage ? (
        <>
          <PriceFormat
            amount={regularPrice()}
            className="text-sm text-gray-400 line-through"
            locale={locale}
          />
          <PriceFormat
            amount={discountedPrice()}
            className="text-sm font-medium text-black"
            locale={locale}
          />
        </>
      ) : (
        <PriceFormat
          amount={discountedPrice()}
          className="text-sm font-medium text-black"
          locale={locale}
        />
      )}
    </div>
  );
};

PriceContainer.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    price: PropTypes.number,
    offer: PropTypes.bool,
    discountedPercentage: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
};

export default PriceContainer;
