import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {
  bannerImgOne,
  bannerImgThree,
  bannerImgTwo,
} from "../assets/images/index";
import "slick-carousel/slick/slick.css";
import Container from "./Container";
import PriceFormat from "./PriceFormat";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const bannerData = [
  {
    id: "nike",
    title: "banner.nike.title",
    subtitle: "banner.nike.subtitle",
    description: "banner.nike.description",
    discount: "banner.nike.discount",
    from: 249.99,
    sale: "banner.nike.sale",
    image: bannerImgOne,
    buttonText: "banner.button.buyNow",
  },
  {
    id: "adidas",
    title: "banner.adidas.title",
    subtitle: "banner.adidas.subtitle",
    description: "banner.adidas.description",
    discount: "banner.adidas.discount",
    from: 299.99,
    sale: "banner.adidas.sale",
    image: bannerImgTwo,
    buttonText: "banner.button.buyNow",
  },
  {
    id: "mizuno",
    title: "banner.mizuno.title",
    subtitle: "banner.mizuno.subtitle",
    description: "banner.mizuno.description",
    discount: "banner.mizuno.discount",
    from: 279.99,
    sale: "banner.mizuno.sale",
    image: bannerImgThree,
    buttonText: "banner.button.buyNow",
  },
];

const Banner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dotActive, setDocActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    cssEase: "linear",
    beforeChange: (prev, next) => {
      setDocActive(next);
    },
    appendDots: (dots) => (
      <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2">
        <ul className="flex items-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={`cursor-pointer transition-all duration-300 ${
          i === dotActive
            ? "w-8 h-2 bg-gray-800 rounded-full"
            : "w-2 h-2 bg-gray-600/50 rounded-full hover:bg-gray-600/75"
        }`}
      />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          fade: false,
          appendDots: (dots) => (
            <div className="absolute transform -translate-x-1/2 bottom-6 left-1/2">
              <ul className="flex items-center gap-2">{dots}</ul>
            </div>
          ),
          customPaging: (i) => (
            <div
              className={`cursor-pointer transition-all duration-300 ${
                i === dotActive
                  ? "w-6 h-1.5 bg-gray-800 rounded-full"
                  : "w-1.5 h-1.5 bg-gray-600/50 rounded-full hover:bg-gray-600/75"
              }`}
            />
          ),
        },
      },
    ],
  };

  return (
    <div
      className="w-full h-[70vh] min-h-[500px] max-h-[700px] relative overflow-hidden group bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Slider ref={sliderRef} {...settings}>
        {bannerData?.map((item, index) => (
          <div
            key={index}
            className="relative h-[70vh] min-h-[500px] max-h-[700px]"
          >
            <div className="relative z-10 h-full bg-[#F3F3F3]">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10"></div>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>

              <Container className="relative z-10 h-full py-8 md:py-0">
                <div className="flex flex-col h-full gap-8 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-center">
                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="order-2 space-y-4 text-center text-gray-800 lg:space-y-5 lg:order-1 lg:text-left"
                  >
                    {/* Sale Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-block"
                    >
                      <span className="inline-flex items-center px-6 py-3 text-sm font-bold tracking-wider text-white uppercase rounded-full shadow-lg bg-gradient-to-r from-red-600 to-red-500">
                        <span className="w-2 h-2 mr-2 bg-white rounded-full animate-pulse"></span>
                        {t(item.sale)}
                      </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="py-2 text-3xl font-black leading-tight text-transparent sm:text-4xl md:text-6xl lg:leading-none bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text"
                    >
                      {t(item.title)}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-lg font-medium leading-relaxed text-gray-600 sm:text-xl"
                    >
                      {t(item.subtitle)}
                    </motion.p>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="max-w-2xl mx-auto text-base leading-relaxed text-gray-500 sm:text-lg md:text-xl lg:mx-0"
                    >
                      {t(item.description)}
                    </motion.p>

                    {/* Discount & Price */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col justify-center gap-4 py-2 sm:flex-row sm:items-center lg:justify-start lg:gap-6 lg:py-4"
                    >
                      <div className="flex items-center justify-center lg:justify-start">
                        <div className="text-2xl font-black text-transparent sm:text-3xl md:text-4xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text">
                          {t(item.discount)}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 lg:justify-start">
                        <span className="text-base font-medium text-gray-600 sm:text-lg"></span>
                        <PriceFormat
                          amount={item?.from}
                          className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl"
                        />
                      </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="flex justify-center pt-2 lg:pt-4 lg:justify-start"
                    >
                      <button
                        onClick={() => navigate("/shop")}
                        className="relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden text-sm font-bold tracking-wider text-white uppercase transition-all duration-300 transform bg-black group lg:gap-4 lg:px-10 lg:py-5 lg:text-base hover:scale-105 hover:shadow-2xl"
                      >
                        <span className="absolute inset-0 transition-transform duration-300 origin-left transform scale-x-0 bg-gradient-to-r from-gray-800 to-black group-hover:scale-x-100"></span>
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                          {t(item.buttonText)}
                        </span>
                        <svg
                          className="relative z-10 w-4 h-4 transition-all duration-300 lg:w-5 lg:h-5 group-hover:translate-x-2 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  </motion.div>

                  {/* Right Image */}
                  <motion.div
                    initial={{ opacity: 0, x: 60, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="relative flex items-center justify-center order-1 h-64 lg:order-2 sm:h-80 lg:h-full"
                  >
                    <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-lg">
                      {/* Glowing Background */}
                      <div className="absolute inset-0 transform bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl rotate-6"></div>

                      {/* Image Container */}
                      <div className="relative p-4 border bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl sm:p-6 lg:p-8 border-gray-200/30">
                        <img
                          src={item?.image}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-auto max-h-48 sm:max-h-64 lg:max-h-[450px] object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Floating Elements */}
                      <div className="absolute w-12 h-12 rounded-full -top-2 -right-2 lg:-top-4 lg:-right-4 lg:w-20 lg:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-10 animate-pulse"></div>
                      <div className="absolute w-10 h-10 delay-1000 rounded-full -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 animate-pulse"></div>
                    </div>
                  </motion.div>
                </div>
              </Container>
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation Arrows */}
      <div
        className={`absolute inset-y-0 left-0 flex items-center z-20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="p-3 ml-4 text-white transition-all duration-200 rounded-full shadow-lg bg-gray-800/80 backdrop-blur-sm hover:bg-gray-900 group"
          aria-label="Previous slide"
        >
          <HiChevronLeft className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>

      <div
        className={`absolute inset-y-0 right-0 flex items-center z-20 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="p-3 mr-4 text-white transition-all duration-200 rounded-full shadow-lg bg-gray-800/80 backdrop-blur-sm hover:bg-gray-900 group"
          aria-label="Next slide"
        >
          <HiChevronRight className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
};

export default Banner;
