import { useState, useEffect } from "react";
import { getData } from "../../helpers";
import { config } from "../../../config";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const ProductsSideNav = ({ onFilterChange, filters, onClearFilters }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    // Fetch categories and brands from products
    const fetchFilterOptions = async () => {
      try {
        const data = await getData(`${config?.baseUrl}/api/products`);
        const products = data?.products || [];

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(products.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);

        // Extract unique brands
        const uniqueBrands = [
          ...new Set(products.map((p) => p.brand).filter(Boolean)),
        ];
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ search: value });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      category: filters?.category === category ? "" : category,
    });
  };

  const handleBrandChange = (brand) => {
    onFilterChange({ brand: filters?.brand === brand ? "" : brand });
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    onFilterChange({ priceRange: `${min}-${max}` });
  };

  return (
    <div className="w-full space-y-6">
      {/* Search */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t("Shop.Search")}
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t("Shop.SearchProduct")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t("Shop.Category")}
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters?.category === category}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
              />
              <span className="ml-3 text-gray-700 capitalize transition-colors group-hover:text-gray-900">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t("Shop.Brand")}
        </h3>
        <div className="space-y-3 overflow-y-auto max-h-60">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters?.brand === brand}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
              />
              <span className="ml-3 text-gray-700 capitalize transition-colors group-hover:text-gray-900">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t("Shop.BrandBrand")}
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm text-gray-600">
                {t("Shop.minPrice")}
              </label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm text-gray-600">
                {t("Shop.maxPrice")}
              </label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => handlePriceChange(priceRange.min, priceRange.max)}
            className="w-full px-4 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
          >
            {t("Shop.ApplyPriceFilter")}
          </button>
        </div>

        {/* Preset Price Ranges */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            {t("Shop.Quick")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              { label: t("Shop.under50"), min: 0, max: 50 },
              { label: t("Shop.50to100"), min: 50, max: 100 },
              { label: t("Shop.100to200"), min: 100, max: 200 },
              { label: t("Shop.over200"), min: 200, max: 1000 },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => handlePriceChange(range.min, range.max)}
                className="px-3 py-1 text-xs transition-colors border border-gray-300 rounded-full hover:bg-gray-50"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {t("Shop.Rating")}
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
              />
              <div className="flex items-center ml-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {t("Shop.ClearFilters")}
        </button>
      </div>
    </div>
  );
};
ProductsSideNav.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    search: PropTypes.string,
    category: PropTypes.string,
    brand: PropTypes.string,
    priceRange: PropTypes.string,
    rating: PropTypes.number,
  }),
};

export default ProductsSideNav;
