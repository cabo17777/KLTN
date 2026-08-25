import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import AddToCartButton from "./AddToCartButton";
import PriceContainer from "./PriceContainer";

const ProductCard = ({
  item,
  lang = "en",
  viewMode = "grid",
  className = "",
}) => {
  const navigate = useNavigate();
  const [setIsHovered] = useState(false);

  const handleProductDetails = () => {
    navigate(`/product/${item?._id}`, { state: { item } });
  };

  const getText = (field) => {
    if (!field) return "";
    return typeof field === "object" ? field[lang] || field.en : field;
  };

  if (viewMode === "list") {
    return (
      <div
        className={`w-full bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden ${className}`}
      >
        <div className="flex">
          {/* Image */}
          <div
            className="relative flex-shrink-0 w-48 h-48 overflow-hidden cursor-pointer bg-gray-50"
            onClick={handleProductDetails}
          >
            <img
              className="object-cover w-full h-full transition-transform duration-500 ease-out hover:scale-105"
              src={item?.images?.[0] || item?.image}
              alt={getText(item.name)}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between flex-1 p-6">
            <div className="mb-3">
              <h3
                className="text-lg font-semibold tracking-wide text-gray-900 uppercase cursor-pointer hover:text-gray-600"
                onClick={handleProductDetails}
              >
                {getText(item.name)}
              </h3>
              {item?._type && (
                <span className="block mt-1 text-xs font-medium text-gray-500 uppercase">
                  {getText(item._type)}
                </span>
              )}
              {item?.description && (
                <p className="mt-2 text-xs text-gray-600 line-clamp-3">
                  {getText(item.description)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto">
              <PriceContainer item={item} />
              <div className="transition-opacity duration-300 opacity-100 group-hover:opacity-100">
                <AddToCartButton item={item} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className={`w-full relative group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 ease-out ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden cursor-pointer bg-gray-50"
        onClick={handleProductDetails}
      >
        <img
          className="object-cover w-full h-full aspect-[4/4] transition-transform duration-500 ease-out group-hover:scale-105"
          src={item?.images?.[0] || item?.image}
          alt={getText(item.name)}
        />

        {/* Badges */}
        {item?.offer && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium tracking-wide text-white uppercase bg-black">
              -{item.discountedPercentage}%
            </span>
          </div>
        )}
        {item?.badge && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium tracking-wide text-white uppercase bg-green-600">
              New
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 pt-4 pb-4 text-center">
        <h3
          className="mb-2 text-sm font-medium tracking-wide text-gray-900 uppercase cursor-pointer hover:text-gray-600"
          onClick={handleProductDetails}
        >
          {getText(item.name)}
        </h3>

        {/* Product type */}
        {item?._type && (
          <span className="block mb-1 text-xs font-medium text-gray-500 uppercase">
            {getText(item._type)}
          </span>
        )}

        {/* Price */}
        <div className="mb-3">
          <PriceContainer item={item} />
        </div>

        {/* Add to Cart */}
        <div className="transition-opacity duration-300 opacity-100 group-hover:opacity-100">
          <AddToCartButton item={item} />
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  item: PropTypes.object.isRequired,
  lang: PropTypes.oneOf(["vi", "en"]),
  viewMode: PropTypes.oneOf(["grid", "list"]),
  className: PropTypes.string,
};

export default ProductCard;
