<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo Admin & Test User
        User::updateOrCreate(
            ['email' => 'admin@cbsports.com'],
            [
                'name' => 'Admin CB Sports',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'Nguyễn Văn A',
                'password' => Hash::make('123456'),
                'role' => 'user',
            ]
        );

        // 2. Tạo Danh mục sản phẩm
        Category::updateOrCreate(['name' => 'Bóng đá'], ['slug' => 'bong-da', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'description' => 'Giày đá bóng sân cỏ nhân tạo & tự nhiên']);
        Category::updateOrCreate(['name' => 'Bóng rổ'], ['slug' => 'bong-ro', 'image' => 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400', 'description' => 'Giày bóng rổ chuyên nghiệp']);
        Category::updateOrCreate(['name' => 'Chạy bộ'], ['slug' => 'chay-bo', 'image' => 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400', 'description' => 'Giày chạy bộ êm ái, bền bỉ']);
        Category::updateOrCreate(['name' => 'Thời trang'], ['slug' => 'thoi-trang', 'image' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', 'description' => 'Giày sneaker phong cách hàng ngày']);

        // 3. Tạo Thương hiệu
        Brand::updateOrCreate(['name' => 'Nike'], ['logo' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'description' => 'Thương hiệu thể thao hàng đầu']);
        Brand::updateOrCreate(['name' => 'Adidas'], ['logo' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', 'description' => 'Thương hiệu thể thao phong cách']);
        Brand::updateOrCreate(['name' => 'Puma'], ['logo' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', 'description' => 'Thương hiệu tốc độ']);
        Brand::updateOrCreate(['name' => 'Mizuno'], ['logo' => 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400', 'description' => 'Thương hiệu Nhật Bản cao cấp']);

        // 4. Tạo Danh sách 12 Sản phẩm chuẩn hình ảnh giày thể thao
        $products = [
            [
                'name' => 'Giày Đá Bóng Nike Air Zoom Mercurial Vapor 15',
                'description' => 'Mẫu giày đá bóng siêu nhẹ trợ tốc đến từ Nike, đế đinh TF bám sân cực tốt.',
                'price' => 2450000,
                'discount_price' => 2150000,
                'category' => 'Bóng đá',
                'brand' => 'Nike',
                'image' => ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
                'sizes' => ['39', '40', '41', '42', '43'],
                'colors' => ['Đỏ', 'Trắng', 'Đen'],
                'bestseller' => true,
                'stock' => 50,
            ],
            [
                'name' => 'Giày Đá Bóng Adidas Predator Accuracy',
                'description' => 'Dòng sản phẩm kiểm soát bóng tối ưu của Adidas với bề mặt gai bám xoáy.',
                'price' => 1950000,
                'discount_price' => 1750000,
                'category' => 'Bóng đá',
                'brand' => 'Adidas',
                'image' => ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'],
                'sizes' => ['38', '39', '40', '41', '42'],
                'colors' => ['Đen', 'Xanh'],
                'bestseller' => true,
                'stock' => 35,
            ],
            [
                'name' => 'Giày Chạy Bộ Nike Air Zoom Pegasus 40',
                'description' => 'Giày chạy bộ êm ái cho mọi cự ly, trang bị đệm Air Zoom cao cấp.',
                'price' => 3200000,
                'discount_price' => 2890000,
                'category' => 'Chạy bộ',
                'brand' => 'Nike',
                'image' => ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
                'sizes' => ['39', '40', '41', '42'],
                'colors' => ['Đỏ', 'Đen'],
                'bestseller' => false,
                'stock' => 60,
            ],
            [
                'name' => 'Giày Đá Bóng Puma Future Ultimate FG/AG',
                'description' => 'Mẫu giày đá bóng cổ cao sáng tạo đến từ Puma, hỗ trợ di chuyển linh hoạt.',
                'price' => 2850000,
                'discount_price' => 2500000,
                'category' => 'Bóng đá',
                'brand' => 'Puma',
                'image' => ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'],
                'sizes' => ['39', '40', '41', '42', '43'],
                'colors' => ['Xanh lá', 'Đen'],
                'bestseller' => true,
                'stock' => 45,
            ],
            [
                'name' => 'Giày Đá Bóng Mizuno Morelia Neo III Beta Pro',
                'description' => 'Giày đá bóng da thật K-Leather siêu mềm, ôm chân hoản hảo từ Mizuno Nhật Bản.',
                'price' => 3100000,
                'discount_price' => 2850000,
                'category' => 'Bóng đá',
                'brand' => 'Mizuno',
                'image' => ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600'],
                'sizes' => ['39', '40', '41', '42'],
                'colors' => ['Trắng', 'Đỏ'],
                'bestseller' => true,
                'stock' => 30,
            ],
            [
                'name' => 'Giày Chạy Bộ Adidas Ultraboost Light',
                'description' => 'Dòng giày chạy bộ huyền thoại trang bị hạt đệm Ultraboost êm nhất thế giới.',
                'price' => 4200000,
                'discount_price' => 3650000,
                'category' => 'Chạy bộ',
                'brand' => 'Adidas',
                'image' => ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600'],
                'sizes' => ['40', '41', '42', '43'],
                'colors' => ['Đen', 'Trắng'],
                'bestseller' => true,
                'stock' => 40,
            ],
            [
                'name' => 'Giày Bóng Rổ Nike Kyrie Infinity Basketball',
                'description' => 'Mẫu giày bóng rổ cổ cao bảo vệ cổ chân và hỗ trợ bật nhảy tối đa.',
                'price' => 3500000,
                'discount_price' => 3100000,
                'category' => 'Bóng rổ',
                'brand' => 'Nike',
                'image' => ['https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600'],
                'sizes' => ['41', '42', '43', '44'],
                'colors' => ['Xanh dương', 'Vàng'],
                'bestseller' => false,
                'stock' => 25,
            ],
            [
                'name' => 'Giày Sneaker Nike Air Force 1 07 White',
                'description' => 'Mẫu sneaker kinh điển phong cách đường phố không bao giờ lỗi mốt.',
                'price' => 2900000,
                'discount_price' => 2650000,
                'category' => 'Thời trang',
                'brand' => 'Nike',
                'image' => ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'],
                'sizes' => ['36', '37', '38', '39', '40', '41', '42'],
                'colors' => ['Trắng'],
                'bestseller' => true,
                'stock' => 100,
            ],
            [
                'name' => 'Giày Đá Bóng Adidas X Crazyfast.1 TF',
                'description' => 'Tốc độ điên rồ với thân giày siêu mỏng Aerocage và đế cao su bám sân.',
                'price' => 2600000,
                'discount_price' => 2300000,
                'category' => 'Bóng đá',
                'brand' => 'Adidas',
                'image' => ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600'],
                'sizes' => ['39', '40', '41', '42'],
                'colors' => ['Xanh chuối', 'Trắng'],
                'bestseller' => false,
                'stock' => 35,
            ],
            [
                'name' => 'Giày Chạy Bộ Puma Velocity Nitro 2',
                'description' => 'Giày chạy bộ êm ái trang bị bọt Nitro tiên tiến giúp phản hồi lực vượt trội.',
                'price' => 2700000,
                'discount_price' => 2390000,
                'category' => 'Chạy bộ',
                'brand' => 'Puma',
                'image' => ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'],
                'sizes' => ['39', '40', '41', '42'],
                'colors' => ['Cam', 'Đen'],
                'bestseller' => false,
                'stock' => 50,
            ],
            [
                'name' => 'Giày Đá Bóng Nike Phantom GX Pro TF',
                'description' => 'Công nghệ NikeGrip hỗ trợ cảm giác bóng chính xác tuyệt đối trong mọi thời tiết.',
                'price' => 2950000,
                'discount_price' => 2700000,
                'category' => 'Bóng đá',
                'brand' => 'Nike',
                'image' => ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600'],
                'sizes' => ['40', '41', '42', '43'],
                'colors' => ['Xanh ngọc', 'Trắng'],
                'bestseller' => true,
                'stock' => 40,
            ],
            [
                'name' => 'Giày Sneaker Adidas Originals Forum Low',
                'description' => 'Thiết kế quai dán bóng rổ thập niên 80 đậm chất Retro sang trọng.',
                'price' => 2600000,
                'discount_price' => 2250000,
                'category' => 'Thời trang',
                'brand' => 'Adidas',
                'image' => ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600'],
                'sizes' => ['38', '39', '40', '41', '42'],
                'colors' => ['Trắng xanh'],
                'bestseller' => false,
                'stock' => 60,
            ]
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(['name' => $p['name']], $p);
        }
    }
}
