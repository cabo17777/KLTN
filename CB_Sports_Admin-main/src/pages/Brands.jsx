import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Container from "../components/Container";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaSearch,
  FaExternalLinkAlt,
  FaSync,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Brands = () => {
  const { token } = useSelector((state) => state.auth);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch brands
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/brand`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setBrands(data.brands);
      } else {
        toast.error(data.message || "Failed to fetch brands");
      }
    } catch (error) {
      console.error("Fetch brands error:", error);
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    if (!formData.image && !editingBrand) {
      toast.error("Brand image is required");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("website", formData.website.trim());
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const url = editingBrand
        ? `${import.meta.env.VITE_BACKEND_URL}/api/brand/${editingBrand._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/brand`;

      const response = await fetch(url, {
        method: editingBrand ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingBrand
            ? "Brand updated successfully"
            : "Brand created successfully"
        );
        fetchBrands();
        closeModal();
      } else {
        toast.error(data.message || "Failed to save brand");
      }
    } catch (error) {
      console.error("Submit brand error:", error);
      toast.error("Failed to save brand");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete brand
  const handleDelete = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/brand/${brandId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Brand deleted successfully");
        fetchBrands();
      } else {
        toast.error(data.message || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Delete brand error:", error);
      toast.error("Failed to delete brand");
    }
  };

  // Open modal for create/edit
  const openModal = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || "",
        website: brand.website || "",
        image: null,
      });
      setImagePreview(brand.image);
    } else {
      setEditingBrand(null);
      setFormData({
        name: "",
        description: "",
        website: "",
        image: null,
      });
      setImagePreview("");
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({
      name: "",
      description: "",
      website: "",
      image: null,
    });
    setImagePreview("");
  };

  // Filter brands based on search
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Brands
            </h1>
            <p className="mt-1 text-gray-600">Manage product brands</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBrands}
              className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              title="Refresh Brands"
            >
              <FaSync className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
            >
              <FaPlus />
              Add Brand
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <>
            {/* Skeleton for table view on large screens */}
            <div className="hidden overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full h-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="w-full h-[30px] px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Logo
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Brand Name
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Website
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(8)].map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32 h-4 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <div className="w-16 h-8 bg-gray-200 rounded"></div>
                            <div className="w-16 h-8 bg-gray-200 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Skeleton for card view on small screens */}
            <div className="grid grid-cols-1 gap-6 lg:hidden sm:grid-cols-2">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : filteredBrands.length === 0 ? (
          <div className="py-12 text-center">
            <FaImage className="mx-auto mb-4 text-6xl text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              {searchTerm ? "No brands found" : "No brands yet"}
            </h3>
            <p className="mb-6 text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by creating your first brand"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openModal()}
                className="px-6 py-3 text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
              >
                Create Brand
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table view for large screens */}
            <div className="hidden overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Logo
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Brand Name
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Website
                      </th>
                      <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBrands.map((brand) => (
                      <tr
                        key={brand._id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={brand.image}
                            alt={brand.name}
                            className="w-[100px] h-[100px] object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {brand.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs text-sm text-gray-600 truncate">
                            {brand.description || "No description"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {brand.website ? (
                            <a
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            >
                              <FaExternalLinkAlt className="text-xs" />
                              Visit
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No website
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(brand)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <FaEdit className="text-xs" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(brand._id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                            >
                              <FaTrash className="text-xs" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card view for small screens */}
            <div className="grid grid-cols-1 gap-6 lg:hidden sm:grid-cols-2">
              {filteredBrands.map((brand) => (
                <div
                  key={brand._id}
                  className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                >
                  <div className="relative">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="object-cover w-full h-48"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                        {brand.description}
                      </p>
                    )}
                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 mb-3 text-sm text-blue-600 hover:underline"
                      >
                        <FaExternalLinkAlt />
                        Visit Website
                      </a>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(brand)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(brand._id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {editingBrand ? "Edit Brand" : "Add Brand"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoMdClose size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter brand name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter brand description"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://brand-website.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Brand Logo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-32 h-32 border rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 text-white transition-colors bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingBrand
                      ? "Update"
                      : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Brands;
