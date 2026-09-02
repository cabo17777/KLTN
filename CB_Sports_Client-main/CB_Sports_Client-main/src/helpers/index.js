const fallbackProducts = [
  {
    _id: "p1",
    name: "Giày Đá Bóng Nike Air Zoom Mercurial Vapor 15",
    description: "Mẫu giày đá bóng siêu nhẹ trợ tốc đến từ Nike, đế đinh TF bám sân cực tốt.",
    price: 2450000 / 25000,
    oldPrice: 2800000 / 25000,
    category: "Bóng đá",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Đỏ", "Trắng", "Đen"],
    bestseller: true,
    ratings: 5.0,
    stock: 50,
  },
  {
    _id: "p2",
    name: "Giày Đá Bóng Adidas Predator Accuracy",
    description: "Dòng sản phẩm kiểm soát bóng tối ưu của Adidas với bề mặt gai bám xoáy.",
    price: 1950000 / 25000,
    oldPrice: 2200000 / 25000,
    category: "Bóng đá",
    brand: "Adidas",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Đen", "Xanh"],
    bestseller: true,
    ratings: 4.8,
    stock: 35,
  },
  {
    _id: "p3",
    name: "Giày Chạy Bộ Nike Air Zoom Pegasus 40",
    description: "Giày chạy bộ êm ái cho mọi cự ly, trang bị đệm Air Zoom cao cấp.",
    price: 3200000 / 25000,
    oldPrice: 3600000 / 25000,
    category: "Chạy bộ",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    sizes: ["39", "40", "41", "42"],
    colors: ["Đỏ", "Đen"],
    bestseller: true,
    ratings: 4.9,
    stock: 60,
  },
  {
    _id: "p4",
    name: "Giày Đá Bóng Puma Future Ultimate FG/AG",
    description: "Mẫu giày đá bóng cổ cao sáng tạo đến từ Puma, hỗ trợ di chuyển linh hoạt.",
    price: 2850000 / 25000,
    oldPrice: 3200000 / 25000,
    category: "Bóng đá",
    brand: "Puma",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"],
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Xanh lá", "Đen"],
    bestseller: true,
    ratings: 4.7,
    stock: 45,
  },
];

export const getData = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
      return data;
    }
    return { success: true, products: fallbackProducts };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: true, products: fallbackProducts };
  }
};
