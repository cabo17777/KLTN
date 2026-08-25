import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { MdStar, MdFavoriteBorder, MdShare } from "react-icons/md";
import { motion } from "framer-motion";
import { getData } from "../helpers/index";
import { serverUrl } from "../../config";
import AddToCartButton from "../components/AddToCartButton";
import { useTranslation } from "react-i18next";

const SingleProduct = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    setProductInfo(location.state.item);
  }, [location, productInfo]);

  // Fetch related products based on category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (productInfo?.category) {
        setLoadingRelated(true);
        try {
          // Fetch products from the same category
          const response = await getData(
            `${serverUrl}/api/products?category=${productInfo.category}&_perPage=8`
          );

          if (response?.success && response?.products) {
            // Filter out the current product and limit to 4 products
            const filtered = response.products
              .filter((product) => product._id !== productInfo._id)
              .slice(0, 4);
            setRelatedProducts(filtered);
          }
        } catch (error) {
          console.error("Error fetching related products:", error);
        } finally {
          setLoadingRelated(false);
        }
      }
    };

    fetchRelatedProducts();
  }, [productInfo]);

  // Use product images from database if available, otherwise use mock images
  const productImages =
    productInfo?.images && productInfo.images.length > 0
      ? productInfo.images
      : [
          productInfo?.image,
          productInfo?.image,
          productInfo?.image,
          productInfo?.image,
        ].filter((img) => img); // Filter out undefined images

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-8 space-x-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-700">Home</span>
          <span>/</span>
          <span className="capitalize cursor-pointer hover:text-gray-700">
            {productInfo?.category}
          </span>
          <span>/</span>
          <span className="font-medium text-gray-900">{productInfo?.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-12 mb-16 lg:grid-cols-2">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div
              className="relative overflow-hidden rounded-lg aspect-square bg-gray-50 cursor-zoom-in group"
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <img
                src={productImages[selectedImage] || "/placeholder-image.jpg"}
                alt={productInfo?.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isImageZoomed
                    ? "scale-150 cursor-zoom-out"
                    : "hover:scale-105 group-hover:scale-105"
                }`}
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              {!isImageZoomed && (
                <div className="absolute inset-0 flex items-center justify-center transition-colors duration-300 bg-black/0 group-hover:bg-black/5">
                  <div className="px-3 py-1 text-sm font-medium transition-opacity duration-300 rounded-full opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm">
                    Click to zoom
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden bg-gray-50 rounded-lg border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder-image.jpg"}
                    alt={`${productInfo?.name} ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title */}
            <h1 className="text-3xl font-light leading-tight text-gray-900 md:text-4xl">
              {productInfo?.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              {productInfo?.oldPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  {(productInfo.oldPrice * 25000).toLocaleString("vi-VN")} VND
                </span>
              )}
              <span className="text-3xl font-light text-gray-900">
                {(productInfo?.price * 25000).toLocaleString("vi-VN")} VND
              </span>
              {productInfo?.oldPrice && (
                <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                  Tiết kiệm{" "}
                  {(
                    (productInfo.oldPrice - productInfo.price) *
                    25000
                  ).toLocaleString("vi-VN")}{" "}
                  VND
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <MdStar
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(productInfo?.ratings || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Rated {productInfo?.ratings?.toFixed(1) || "0.0"} out of 5 based
                on {productInfo?.reviews?.length || 0} customer reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-lg leading-relaxed text-gray-600">
              {productInfo?.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-900">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="px-3 py-2 text-gray-600 transition-colors hover:text-gray-900"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="px-3 py-2 text-gray-600 transition-colors hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <AddToCartButton item={{ ...productInfo }} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
                <MdFavoriteBorder className="w-5 h-5" />
                Add to Wishlist
              </button>
              <button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
                <MdShare className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Product Meta */}
            <div className="pt-4 space-y-2 text-sm border-t border-gray-200">
              <p>
                <span className="font-medium">SKU:</span>{" "}
                <span className="text-gray-600">
                  {productInfo?._id?.slice(-6) || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                <span className="text-gray-600 capitalize">
                  {productInfo?.category}
                </span>
              </p>
              {productInfo?.tags && (
                <p>
                  <span className="font-medium">Tags:</span>{" "}
                  <span className="text-gray-600">{productInfo.tags}</span>
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-12 border-t border-gray-200"
        >
          {/* Tab Navigation */}
          <div className="flex mb-8 space-x-8 border-b border-gray-200">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors relative ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "reviews"
                  ? `Reviews (${productInfo?.reviews?.length || 0})`
                  : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none">
                <h3 className="mb-4 text-2xl font-light">Description</h3>
                <p className="leading-relaxed text-gray-600">
                  {productInfo?.description || "No description available."}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h3 className="mb-6 text-2xl font-light">Customer Reviews</h3>
                {productInfo?.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {productInfo.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="pb-6 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={review.image}
                            alt={review.reviewerName}
                            className="object-cover w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {review.reviewerName}
                              </h4>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map(
                                  (_, starIndex) => (
                                    <MdStar
                                      key={starIndex}
                                      className={`w-4 h-4 ${
                                        starIndex < review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <p className="leading-relaxed text-gray-600">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No reviews yet. Be the first to leave a review!
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-16 mt-16 border-t border-gray-200"
        >
          <h2 className="mb-12 text-2xl font-light text-center">
            {t("relatedProductsSection.title")}
          </h2>

          {loadingRelated ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="mb-4 bg-gray-200 rounded-lg aspect-square"></div>
                  <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-3 mb-2 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 mb-3 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="cursor-pointer group"
                  onClick={() =>
                    navigate(`/product/${product._id}`, {
                      state: { item: product },
                    })
                  }
                >
                  <div className="mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-square">
                    <img
                      src={
                        product.image ||
                        product.images?.[0] ||
                        "/placeholder-image.jpg"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <h3 className="mb-2 font-medium text-gray-900 truncate transition-colors group-hover:text-gray-600">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <MdStar
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex < Math.floor(product.ratings || 4)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.ratings?.toFixed(1) || "4.0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {product.discountedPercentage > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {(
                          (product.price /
                            (1 - product.discountedPercentage / 100)) *
                          25000
                        ).toLocaleString("vi-VN")}{" "}
                        {t("relatedProductsSection.currency")}
                      </span>
                    )}
                    <span className="text-lg font-light text-gray-900">
                      {(product.price * 25000).toLocaleString("vi-VN")}{" "}
                      {t("relatedProductsSection.currency")}
                    </span>
                    {product.discountedPercentage > 0 && (
                      <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                        {product.discountedPercentage}{" "}
                        {t("relatedProductsSection.discountLabel")}
                      </span>
                    )}
                  </div>
                  <button
                    className="w-full mt-3 py-2 border border-gray-300 text-gray-700 hover:border-black hover:text-black hover:bg-black hover:text-white transition-all duration-300 text-sm font-medium uppercase tracking-wider transform hover:scale-[1.02]"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle add to cart functionality here
                      console.log("Add to cart:", product.name);
                    }}
                  >
                    {t("relatedProductsSection.addToCartButton")}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-500">
                {t("relatedProductsSection.noProductsMessage")}
              </p>
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default SingleProduct;
