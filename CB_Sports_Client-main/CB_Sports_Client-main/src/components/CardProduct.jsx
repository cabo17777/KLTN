import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { deleteItem } from "../redux/orebiSlice";
import AddToCartButton from "./AddToCartButton";
import PriceFormat from "./PriceFormat";
import PriceContainer from "./PriceContainer";
import toast from "react-hot-toast";

const CartProduct = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="grid w-full grid-cols-5 py-2 mb-4 border">
      <div className="flex items-center col-span-5 gap-4 ml-4 md:col-span-2">
        <ImCross
          onClick={() => {
            dispatch(deleteItem(item._id));
            toast.success(
              `${item?.name.substring(0, 10)}... is deleted successfully!`
            );
          }}
          className="duration-300 cursor-pointer text-primeColor hover:text-red-500"
        />
        <img className="w-32 h-32" src={item.image} alt="productImage" />
        <h1 className="font-semibold font-titleFont">{item.name}</h1>
      </div>
      <div className="flex items-center justify-between col-span-5 gap-6 px-4 py-4 md:col-span-3 md:py-0 md:px-0 md:gap-0">
        <div className="flex items-center w-1/3 text-lg font-semibold">
          <PriceContainer item={item} className="flex-col gap-0" />
        </div>
        <div className="flex items-center w-1/3 gap-6 text-lg">
          <AddToCartButton item={item} className="border-red-500" />
        </div>

        <div className="flex items-center w-1/3 text-lg font-bold font-titleFont">
          <PriceFormat amount={item?.price * item?.quantity} />
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
