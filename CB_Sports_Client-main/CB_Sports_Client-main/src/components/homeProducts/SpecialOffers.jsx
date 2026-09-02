import { useEffect, useState } from "react";
import Slider from "react-slick";
import NextArrow from "../NextArrow";
import PreviousArrow from "../PreviousArrow";
import Title from "../ui/title";
import ProductCard from "../ProductCard";
import { getData } from "../../helpers";
import { config } from "../../../config";
import { useTranslation } from "react-i18next";

const SpecialOffers = () => {
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
  const baseUrl = (config?.baseUrl && config.baseUrl !== "undefined" && !config.baseUrl.includes("localhost")) ? config.baseUrl : "https://cabo-sport.onrender.com";
  const endpoint = `${baseUrl}/api/products?_type=special_offers`;
  console.log("Endpoint:", endpoint);

  const fallbackProducts = [
    {
      _id: "so_1",
      name: "Giày Đá Bóng Nike Air Zoom Mercurial Vapor 15",
      description: "Mẫu giày đá bóng siêu nhẹ trợ tốc đến từ Nike.",
      price: 98,
      discountedPercentage: 15,
      category: "Bóng đá",
      brand: "Nike",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
      bestseller: true,
      ratings: 4.9
    },
    {
      _id: "so_2",
      name: "Giày Chạy Bộ Adidas Ultraboost Light",
      description: "Dòng giày chạy bộ huyền thoại trang bị hạt đệm Ultraboost.",
      price: 168,
      discountedPercentage: 20,
      category: "Chạy bộ",
      brand: "Adidas",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600",
      images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"],
      bestseller: true,
      ratings: 4.9
    },
    {
      _id: "so_3",
      name: "Giày Sneaker Nike Air Force 1 07 White",
      description: "Mẫu sneaker kinh điển phong cách đường phố.",
      price: 116,
      discountedPercentage: 10,
      category: "Thời trang",
      brand: "Nike",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
      images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"],
      bestseller: true,
      ratings: 4.8
    },
    {
      _id: "so_4",
      name: "Giày Đá Bóng Puma Future Ultimate FG/AG",
      description: "Mẫu giày đá bóng cổ cao sáng tạo đến từ Puma.",
      price: 114,
      discountedPercentage: 12,
      category: "Bóng đá",
      brand: "Puma",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
      images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"],
      bestseller: true,
      ratings: 4.8
    }
  ];

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await getData(endpoint);
        const list = Array.isArray(data?.products)
          ? data.products
          : (data?.products ? Object.values(data.products) : []);
        setProducts(list.length > 0 ? list : fallbackProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(fallbackProducts);
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
          <Title className="mb-3 text-2xl font-bold">{t("specialOffers.title")}</Title>
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
          {t("specialOffers.title")}
        </Title>
      </div>

      {/* Conditionally render slider or grid based on product count */}
      {products && products.length > 3 ? (
        <Slider {...settings}>
          {products?.map((item) => (
            <div key={item?._id} className="px-2">
              <ProductCard item={item} />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products?.map((item) => (
            <ProductCard item={item} key={item?._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;
