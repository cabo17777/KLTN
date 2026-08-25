import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../redux/orebiSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { cn } from "./ui/cn";

const AddToCartButton = ({ item, className }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.orebiReducer);
  const [existingProduct, setExistingProduct] = useState(null);
  useEffect(() => {
    const availableItem = products.find(
      (product) => product?._id === item?._id
    );

    setExistingProduct(availableItem || null);
  }, [products, item]);

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    toast.success(`${item?.name.substring(0, 10)}... is added successfully!`);
  };

  return (
    <>
      {existingProduct ? (
        <div
          className={cn(
            "flex self-start items-center justify-center gap-3 py-2",
            className
          )}
        >
          <button
            disabled={existingProduct?.quantity <= 1}
            onClick={() => {
              dispatch(decreaseQuantity(item?._id));
              toast.success("Quantity decreased successfully!");
            }}
            className="p-2 text-sm text-gray-700 transition-all duration-200 border border-gray-300 rounded-md cursor-pointer hover:border-black hover:text-black disabled:text-gray-300 disabled:border-gray-200 disabled:hover:border-gray-200 disabled:hover:text-gray-300"
          >
            <FaMinus />
          </button>
          <p className="w-8 text-sm font-medium text-center">
            {existingProduct?.quantity || 0}
          </p>
          <button
            onClick={() => {
              dispatch(increaseQuantity(item?._id));
              toast.success("Quantity increased successfully!");
            }}
            className="p-2 text-sm text-gray-700 transition-all duration-200 border border-gray-300 rounded-md cursor-pointer hover:border-black hover:text-black"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full px-6 py-3 text-xs font-medium tracking-wide text-black uppercase transition-all duration-200 border border-black hover:bg-black hover:text-white"
        >
          {t("Addtocabutton.button")}
        </button>
      )}
    </>
  );
};

AddToCartButton.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default AddToCartButton;
