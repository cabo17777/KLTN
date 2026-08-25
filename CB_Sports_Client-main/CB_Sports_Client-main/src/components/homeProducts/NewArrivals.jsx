import { useEffect, useState } from "react";
import Slider from "react-slick";
import NextArrow from "../NextArrow";
import PreviousArrow from "../PreviousArrow";
import Title from "../ui/title";
import ProductCard from "../ProductCard";
import { getData } from "../../helpers";
import { config } from "../../../config";
import { useTranslation } from "react-i18next";

const NewArrivals = () => {
  const { t } = useTranslation();
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `${config?.baseUrl}/api/products?_type=new_arrivals`;

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await getData(endpoint);
        // Handle the new API response format that includes success field
        setProducts(data?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Render skeleton loading state
  if (loading) {
    return (
      <div className="w-full py-10">
        <div className="flex items-center justify-between">
          <Title className="mb-3 text-2xl font-bold">
            {t("newArrivals.empty")}
          </Title>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
            >
              <div className="bg-gray-200 aspect-square"></div>
              <div className="p-4">
                <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-3 mb-2 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10">
      <div className="flex items-center justify-between">
        <Title className="mb-3 text-2xl font-bold">
          {t("newArrivals.title")}
        </Title>
        {/* <Link to={"/shop"}>See all</Link> */}
      </div>

      {/* Conditionally render slider or grid based on product count */}
      {products && products.length > 3 ? (
        // Use slider when more than 3 products
        <Slider {...settings}>
          {products?.map((item) => (
            <div key={item?._id} className="px-2">
              <ProductCard item={item} />
            </div>
          ))}
        </Slider>
      ) : (
        // Use simple grid when 3 or fewer products
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products?.map((item) => (
            <ProductCard item={item} key={item?._id} />
          ))}
        </div>
      )}

      {/* Show message when no products */}
      {(!products || products.length === 0) && (
        <div className="py-8 text-center text-gray-500">
          <p>{t("newArrivals.empty")}</p>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
