import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { BiSupport } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const ServicesTag = () => {
  const { t } = useTranslation(); // ✅ khai báo ở đây
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ khai báo services sau khi có t
  const services = [
    {
      title: t("services.freeDelivery.title"),
      subtitle: t("services.freeDelivery.subtitle"),
      icon: <TbTruckDelivery />,
      details: {
        description: t("services.freeDelivery.description"),
        features: t("services.freeDelivery.features", { returnObjects: true }),
      },
    },
    {
      title: t("services.easyReturns.title"),
      subtitle: t("services.easyReturns.subtitle"),
      icon: <HiOutlineCurrencyDollar />,
      details: {
        description: t("services.easyReturns.description"),
        features: t("services.easyReturns.features", { returnObjects: true }),
      },
    },
    {
      title: t("services.support.title"),
      subtitle: t("services.support.subtitle"),
      icon: <BiSupport />,
      details: {
        description: t("services.support.description"),
        features: t("services.support.features", { returnObjects: true }),
      },
    },
    {
      title: t("services.securePayment.title"),
      subtitle: t("services.securePayment.subtitle"),
      icon: <MdOutlinePayment />,
      details: {
        description: t("services.securePayment.description"),
        features: t("services.securePayment.features", { returnObjects: true }),
      },
    },
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <section className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(item)}
              className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer group rounded-2xl hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 transition-transform duration-300 shadow-lg bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl group-hover:scale-110">
                <span className="text-2xl text-white">{item?.icon}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-gray-700">
                  {item?.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
                  {item?.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 bg-white rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute p-2 transition-colors rounded-full top-4 right-4 hover:bg-gray-100"
              >
                <MdClose className="w-5 h-5 text-gray-500" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl">
                  <span className="text-xl text-white">
                    {selectedService.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedService.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedService.subtitle}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="mb-6">
                <p className="mb-4 leading-relaxed text-gray-700">
                  {selectedService.details.description}
                </p>

                <h4 className="mb-3 font-semibold text-gray-900">
                  Key Features:
                </h4>
                <ul className="space-y-2">
                  {selectedService.details.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <Link to="/shop" className="flex-1" onClick={closeModal}>
                  <button className="w-full px-4 py-2 font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800">
                    Shop Now
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesTag;
