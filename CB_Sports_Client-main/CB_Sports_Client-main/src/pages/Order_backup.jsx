import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../components/Container";
import PriceFormat from "../components/PriceFormat";
import { addToCart, setOrderCount } from "../redux/orebiSlice";
import toast from "react-hot-toast";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaEye,
  FaCreditCard,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaBox,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaShoppingCart,
} from "react-icons/fa";

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const cartProducts = useSelector((state) => state.orebiReducer.products);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [setIsPremiumModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Added state for selected order
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    order: null,
  });
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const fetchUserOrders = useCallback(async () => {
    const BASE_URL =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/order/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        dispatch(setOrderCount(data.orders.length));
      } else {
        setError(data.message || "Failed to fetch orders");
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
      return;
    }
    fetchUserOrders();
  }, [userInfo, navigate, fetchUserOrders]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig !== null) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  const openOrderModal = (order) => {
    // For non-premium users, show the premium modal
    // For premium users, show the order details modal
    // Assuming userInfo has a premium flag; adjust as needed
    if (!userInfo?.isPremium) {
      setIsPremiumModalOpen(true);
    } else {
      setSelectedOrder(order);
    }
  };

  const closeOrderModal = () => {
    setIsPremiumModalOpen(false);
    setSelectedOrder(null);
  };

  const handleAddOrderToCart = async (order, e) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      order: order,
    });
  };

  const confirmAddToCart = async () => {
    const order = confirmModal.order;

    try {
      let addedCount = 0;
      let updatedCount = 0;

      order.items.forEach((item) => {
        const existingCartItem = cartProducts.find(
          (cartItem) => cartItem._id === (item.productId || item._id)
        );

        const cartItem = {
          _id: item.productId || item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          description: item.description,
          category: item.category,
          brand: item.brand,
        };

        if (existingCartItem) {
          updatedCount++;
        } else {
          addedCount++;
        }

        dispatch(addToCart(cartItem));
      });

      let message = "";
      if (addedCount > 0 && updatedCount > 0) {
        message = `${addedCount} new item${
          addedCount !== 1 ? "s" : ""
        } added and ${updatedCount} existing item${
          updatedCount !== 1 ? "s" : ""
        } updated in cart!`;
      } else if (addedCount > 0) {
        message = `${addedCount} item${
          addedCount !== 1 ? "s" : ""
        } added to cart!`;
      } else {
        message = `${updatedCount} item${
          updatedCount !== 1 ? "s" : ""
        } updated in cart!`;
      }

      toast.success(message, {
        duration: 4000,
        icon: "🛒",
      });

      setTimeout(() => {
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <span>View your updated cart?</span>
              <button
                onClick={() => {
                  navigate("/cart");
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 text-sm text-white bg-gray-900 rounded hover:bg-gray-800"
              >
                View Cart
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          ),
          {
            duration: 6000,
            icon: "👀",
          }
        );
      }, 1000);

      setConfirmModal({ isOpen: false, order: null });
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast.error("Failed to add items to cart");
      setConfirmModal({ isOpen: false, order: null });
    }
  };

  const cancelAddToCart = () => {
    setConfirmModal({ isOpen: false, order: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="w-4 h-4" />;
      case "confirmed":
        return <FaCheckCircle className="w-4 h-4" />;
      case "shipped":
        return <FaTruck className="w-4 h-4" />;
      case "delivered":
        return <FaBox className="w-4 h-4" />;
      case "cancelled":
        return <FaTimes className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaTimes className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Error Loading Orders
            </h2>
            <p className="mb-4 text-gray-600">{error}</p>
            <button
              onClick={fetchUserOrders}
              className="px-6 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-8">
          <div className="flex flex-col space-y-2">
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <FaShoppingBag className="w-8 h-8" />
              My Orders
            </h1>
            <nav className="flex text-sm text-gray-500">
              <Link to="/" className="transition-colors hover:text-gray-700">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Orders</span>
            </nav>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {orders.length === 0 ? (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="py-16 text-center"
          >
            <div className="max-w-md mx-auto">
              <FaShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                No Orders Yet
              </h2>
              <p className="mb-8 text-gray-600">
                You haven&apos;t placed any orders yet. Start shopping to see
                your orders here!
              </p>
              <Link to="/shop">
                <button className="px-8 py-3 font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800">
                  Start Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found
              </p>
              <button
                onClick={fetchUserOrders}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Refresh
              </button>
            </div>

            {/* Table View */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        <button
                          onClick={() => handleSort("_id")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Order ID
                          {sortConfig.key === "_id" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Date
                          {sortConfig.key === "date" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Items
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        <button
                          onClick={() => handleSort("amount")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Total
                          {sortConfig.key === "amount" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Status
                          {sortConfig.key === "status" ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedOrders.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => openOrderModal(order)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex mr-3 -space-x-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div
                                  key={index}
                                  className="w-8 h-8 overflow-hidden bg-gray-100 border-2 border-white rounded-full"
                                >
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="object-cover w-full h-full"
                                    />
                                  )}
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 border-2 border-white rounded-full">
                                  <span className="text-xs text-gray-600">
                                    +{order.items.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm text-gray-900">
                                {order.items.length} item
                                {order.items.length !== 1 ? "s" : ""}
                              </div>
                              <div className="max-w-xs text-sm text-gray-500 truncate">
                                {order.items[0]?.name}
                                {order.items.length > 1 &&
                                  `, +${order.items.length - 1} more`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            <PriceFormat amount={order.amount} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentMethod === "cod" ? (
                              <FaMoneyBillWave className="w-3 h-3" />
                            ) : (
                              <FaCreditCard className="w-3 h-3" />
                            )}
                            {order.paymentStatus.charAt(0).toUpperCase() +
                              order.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openOrderModal(order);
                              }}
                              className="text-blue-600 transition-colors hover:text-blue-900"
                              title="View Details"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleAddOrderToCart(order, e)}
                              className="text-green-600 transition-colors hover:text-green-900"
                              title="Add to Cart"
                            >
                              <FaShoppingCart className="w-4 h-4" />
                            </button>
                            <Link
                              to={`/checkout/${order._id}`}
                              className="text-gray-600 transition-colors hover:text-gray-900"
                              title="Order Details"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaShoppingBag className="w-4 h-4" />
                            </Link>
                            {order.paymentStatus === "pending" && (
                              <Link
                                to={`/checkout/${order._id}`}
                                className="text-orange-600 transition-colors hover:text-orange-900"
                                title="Pay Now"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaCreditCard className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={closeOrderModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Details
                    </h2>
                    <p className="text-gray-600">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={closeOrderModal}
                    className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <FaTimes className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">
                            {new Date(selectedOrder.date).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="text-lg font-bold">
                            <PriceFormat amount={selectedOrder.amount} />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium capitalize">
                            {selectedOrder.paymentMethod}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              selectedOrder.status
                            )}`}
                          >
                            {getStatusIcon(selectedOrder.status)}
                            {selectedOrder.status.charAt(0).toUpperCase() +
                              selectedOrder.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span
                            className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                              selectedOrder.paymentStatus
                            )}`}
                          >
                            {selectedOrder.paymentMethod === "cod" ? (
                              <FaMoneyBillWave className="w-3 h-3" />
                            ) : (
                              <FaCreditCard className="w-3 h-3" />
                            )}
                            {selectedOrder.paymentStatus
                              .charAt(0)
                              .toUpperCase() +
                              selectedOrder.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {selectedOrder.address && (
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                          <FaMapMarkerAlt className="w-5 h-5" />
                          Delivery Address
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4 text-gray-500" />
                            <span>
                              {selectedOrder.address.firstName}{" "}
                              {selectedOrder.address.lastName}
                            </span>
                          </div>
                          {selectedOrder.address.email && (
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="w-4 h-4 text-gray-500" />
                              <span>{selectedOrder.address.email}</span>
                            </div>
                          )}
                          {selectedOrder.address.phone && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="w-4 h-4 text-gray-500" />
                              <span>{selectedOrder.address.phone}</span>
                            </div>
                          )}
                          <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                              <p>{selectedOrder.address.street}</p>
                              <p>
                                {selectedOrder.address.city},{" "}
                                {selectedOrder.address.state}{" "}
                                {selectedOrder.address.zipcode}
                              </p>
                              <p>{selectedOrder.address.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order Items
                    </h3>
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 flex items-center space-x-4 ${
                            index > 0 ? "border-t border-gray-200" : ""
                          }`}
                        >
                          <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Unit Price: <PriceFormat amount={item.price} />
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              <PriceFormat
                                amount={item.price * item.quantity}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-lg font-bold text-gray-900">
                    Total: <PriceFormat amount={selectedOrder.amount} />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeOrderModal}
                      className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
                    >
                      Close
                    </button>
                    <button
                      onClick={(e) => {
                        handleAddOrderToCart(selectedOrder, e);
                        closeOrderModal();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <Link
                      to={`/checkout/${selectedOrder._id}`}
                      className="px-4 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
                      onClick={closeOrderModal}
                    >
                      View Full Details
                    </Link>
                    {selectedOrder.paymentStatus === "pending" && (
                      <Link
                        to={`/checkout/${selectedOrder._id}`}
                        className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                        onClick={closeOrderModal}
                      >
                        Pay Now
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add to Cart Confirmation Modal */}
        <AnimatePresence>
          {confirmModal.isOpen && confirmModal.order && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={cancelAddToCart}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md p-6 bg-white rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
                    <FaShoppingCart className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Add Order to Cart
                  </h3>
                  <p className="mb-6 text-sm text-gray-500">
                    Are you sure you want to move all items from order{" "}
                    <span className="font-semibold">
                      #{confirmModal.order._id.slice(-8).toUpperCase()}
                    </span>{" "}
                    to your cart? This will add{" "}
                    {confirmModal.order.items.length} item
                    {confirmModal.order.items.length !== 1 ? "s" : ""} to your
                    cart.
                  </p>

                  {/* Order Items Preview */}
                  <div className="p-3 mb-6 overflow-y-auto rounded-lg bg-gray-50 max-h-40">
                    <div className="flex justify-between mb-2 text-xs font-medium text-gray-500">
                      <span>Items to add:</span>
                      <span>Qty × Price</span>
                    </div>
                    {confirmModal.order.items.map((item, index) => {
                      const isInCart = cartProducts.find(
                        (cartItem) =>
                          cartItem._id === (item.productId || item._id)
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between py-1 text-sm border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="flex-shrink-0 object-cover w-8 h-8 mr-2 rounded"
                              />
                            )}
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-gray-700 truncate">
                                {item.name}
                              </span>
                              {isInCart && (
                                <span className="text-xs text-blue-600">
                                  Already in cart (qty: {isInCart.quantity}) -
                                  will be updated
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-2 text-gray-500">
                            <span className="text-xs">x{item.quantity}</span>
                            <span className="text-xs">×</span>
                            <PriceFormat amount={item.price} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total Value:</span>
                        <PriceFormat amount={confirmModal.order.amount} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={cancelAddToCart}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAddToCart}
                      className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Order;
