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

  // Fallback products if API is awakening or empty
  const fallbackProducts = [
    {
      _id: "fb_1",
      name: "Giày Đá Bóng Nike Air Zoom Mercurial Vapor 15",
      description: "Mẫu giày đá bóng siêu nhẹ trợ tốc đến đến từ Nike, đế đinh TF bám sân cực tốt.",
      price: 98,
      discountedPercentage: 15,
      category: "Bóng đá",
      brand: "Nike",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
      bestseller: true,
      ratings: 4.8
    },
    {
      _id: "fb_2",
      name: "Giày Đá Bóng Adidas Predator Accuracy",
      description: "Dòng sản phẩm kiểm soát bóng tối ưu của Adidas với bề mặt gai bám xoáy.",
      price: 78,
      discountedPercentage: 10,
      category: "Bóng đá",
      brand: "Adidas",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
      images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"],
      bestseller: true,
      ratings: 4.7
    },
    {
      _id: "fb_3",
      name: "Giày Chạy Bộ Puma Velocity Nitro 2",
      description: "Giày chạy bộ êm ái trang bị bọt Nitro tiên tiến giúp phản hồi lực vượt trội.",
      price: 108,
      discountedPercentage: 12,
      category: "Chạy bộ",
      brand: "Puma",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
      images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"],
      bestseller: false,
      ratings: 4.6
    },
    {
      _id: "fb_4",
      name: "Giày Đá Bóng Mizuno Morelia Neo III Beta Pro",
      description: "Giày đá bóng da thật K-Leather siêu mềm từ Mizuno Nhật Bản.",
      price: 124,
      discountedPercentage: 8,
      category: "Bóng đá",
      brand: "Mizuno",
      image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600",
      images: ["https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600"],
      bestseller: true,
      ratings: 4.9
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
          <Title className="mb-3 text-2xl font-bold">
            {t("newArrivals.title")}
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
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-${products?.length < 4 ? products?.length : 4}`}>
          {products?.map((item) => (
            <ProductCard item={item} key={item?._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
