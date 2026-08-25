import { Link } from "react-router-dom";
import { productOfTheYear } from "../../assets/images";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const ProductOfTheYear = () => {
  const { t } = useTranslation();

  return (
    <Link to="/shop" className="block group">
      <div className="relative w-full h-[360px] overflow-hidden transition-all duration-500 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 md:bg-transparent rounded-2xl hover:shadow-2xl">
        <img
          src={productOfTheYear}
          alt="productImage"
          className="hidden object-cover w-[300px] h-[330px] transition-transform duration-700 ease-out md:inline-block group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 flex flex-col items-start justify-center w-full gap-8 px-6 md:w-2/3 xl:w-1/2 h-96 md:px-8 bg-gradient-to-r md:bg-gradient-to-l from-white/95 via-white/90 to-transparent backdrop-blur-sm">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl drop-shadow-sm">
              {t("productOfTheYear.title")}
            </h1>
            <p className="text-lg font-medium text-gray-700 max-w-[500px] leading-relaxed">
              {t("productOfTheYear.description")}
            </p>
          </div>
          <Button className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform bg-black rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 hover:-translate-y-1">
            {t("productOfTheYear.button")}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductOfTheYear;
