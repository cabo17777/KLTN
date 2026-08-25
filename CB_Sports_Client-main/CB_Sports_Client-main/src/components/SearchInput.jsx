import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { getData } from "../helpers";
import { useTranslation } from "react-i18next";

import { config } from "../../config";
const SearchInput = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts([]);
      return;
    }
    const endpoint = `${
      config.baseUrl
    }/api/products?_search=${encodeURIComponent(search)}`;

    //const endpoint = `http://localhost:8000/api/products?_search=${search}`;

    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await getData(endpoint);
        setFilteredProducts(data?.products || []);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsInputFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative flex-1 h-12 max-w-2xl">
      <div className="relative h-full">
        <CiSearch className="absolute text-xl text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
        <input
          type="text"
          placeholder={t("search_placeholder")}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          onFocus={() => setIsInputFocused(true)}
          className="w-full h-full pl-12 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-full outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 bg-gray-50 focus:bg-white"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute p-1 text-gray-400 transition-colors duration-200 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        )}
      </div>

      {isInputFocused && search && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden duration-200 bg-white border border-gray-100 shadow-2xl top-full rounded-xl animate-in slide-in-from-top-2">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
                <span>{t("search_loading")}</span> {}
              </div>
            </div>
          ) : filteredProducts?.length > 0 ? (
            <div className="overflow-y-auto max-h-80">
              <div className="p-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-medium text-gray-600">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length !== 1
                    ? t("search_products_plural")
                    : t("search_products_singular")}{" "}
                  {t("search_found")}
                </p>
              </div>
              {filteredProducts?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSearch("");
                    setIsInputFocused(false);
                    navigate(`/product/${item?._id}`, { state: { item } });
                  }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 border-b cursor-pointer hover:bg-gray-50 border-gray-50 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 rounded-lg">
                    {item?.images?.[0] || item?.image ? (
                      <img
                        src={item?.images?.[0] || item?.image}
                        alt={item?.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <CiSearch className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item?.name}
                    </h4>
                    {item?.price && (
                      <p className="text-sm text-gray-600">${item.price}</p>
                    )}
                  </div>
                  <CiSearch className="flex-shrink-0 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <CiSearch className="text-2xl text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {t("search_no_results")} {}
              </h3>
              <p className="text-gray-600">
                {t("search_no_products")}{" "}
                <span className="font-semibold text-gray-900">
                  &ldquo;{search}&rdquo;
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {t("search_try_again")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
