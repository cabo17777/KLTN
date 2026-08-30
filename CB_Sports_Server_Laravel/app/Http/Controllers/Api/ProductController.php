<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // Lấy danh sách sản phẩm với Cache ngắn hạn (60s) để phản hồi siêu tốc
    public function list(Request $request)
    {
        $type = $request->query('_type', 'all');
        $category = $request->query('category', '');
        $brand = $request->query('brand', '');
        $search = $request->query('search', '');

        $cacheKey = "products_list_{$type}_{$category}_{$brand}_{$search}";

        $products = Cache::remember($cacheKey, 60, function () use ($type, $category, $brand, $search) {
            $query = Product::query();

            if ($type === 'best_sellers' || $type === 'bestsellers') {
                $query->where('bestseller', true);
            } elseif ($type === 'new_arrivals') {
                $query->orderBy('created_at', 'desc');
            } elseif ($type === 'special_offers' || $type === 'on_sale') {
                $query->whereNotNull('discount_price')->where('discount_price', '>', 0);
            }

            if (!empty($category)) {
                $query->where('category', $category);
            }

            if (!empty($brand)) {
                $query->where('brand', $brand);
            }

            if (!empty($search)) {
                $query->where('name', 'like', '%' . $search . '%');
            }

            $results = $query->get()->map(function ($product) {
                $data = $product->toArray();
                $data['_id'] = (string) $product->id;
                $rawImg = $product->image;
                $imgs = is_array($rawImg) ? array_values($rawImg) : ($rawImg ? [$rawImg] : []);
                $validImgs = array_filter($imgs, function ($url) {
                    return !empty($url) && is_string($url) && !str_contains($url, 'placeholder');
                });
                if (empty($validImgs)) {
                    $validImgs = ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'];
                }
                $data['images'] = array_values($validImgs);
                $data['image'] = $validImgs[0];
                return $data;
            });

            // Fallback: Nếu không tìm thấy sản phẩm trùng bộ lọc, trả về tất cả sản phẩm
            if ($results->isEmpty()) {
                $results = Product::all()->map(function ($product) {
                    $data = $product->toArray();
                    $data['_id'] = (string) $product->id;
                    $rawImg = $product->image;
                    $imgs = is_array($rawImg) ? array_values($rawImg) : ($rawImg ? [$rawImg] : []);
                    $validImgs = array_filter($imgs, function ($url) {
                        return !empty($url) && is_string($url) && !str_contains($url, 'placeholder');
                    });
                    if (empty($validImgs)) {
                        $validImgs = ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'];
                    }
                    $data['images'] = array_values($validImgs);
                    $data['image'] = $validImgs[0];
                    return $data;
                });
            }

            return $results->values()->all();
        });

        return response()->json([
            'success' => true,
            'products' => array_values($products)
        ]);
    }

    // Thêm sản phẩm mới
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        $imageUrls = [];
        if ($request->hasFile('image1')) {
            $path = $request->file('image1')->store('products', 'public');
            $imageUrls[] = asset('storage/' . $path);
        }
        if ($request->hasFile('image2')) {
            $path = $request->file('image2')->store('products', 'public');
            $imageUrls[] = asset('storage/' . $path);
        }
        if ($request->hasFile('image3')) {
            $path = $request->file('image3')->store('products', 'public');
            $imageUrls[] = asset('storage/' . $path);
        }
        if ($request->hasFile('image4')) {
            $path = $request->file('image4')->store('products', 'public');
            $imageUrls[] = asset('storage/' . $path);
        }

        if (empty($imageUrls) && $request->has('image')) {
            $raw = $request->image;
            $imageUrls = is_array($raw) ? $raw : (json_decode($raw, true) ?: [$raw]);
        }

        $validImageUrls = array_filter((array)$imageUrls, function ($url) {
            return !empty($url) && is_string($url) && !str_contains($url, 'placeholder');
        });
        if (empty($validImageUrls)) {
            $validImageUrls = ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'];
        }

        $sizes = is_array($request->sizes) ? $request->sizes : json_decode($request->sizes, true);
        if (!$sizes) $sizes = [];

        $colors = is_array($request->colors) ? $request->colors : json_decode($request->colors, true);
        if (!$colors) $colors = [];

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discountPrice ?? $request->discount_price,
            'category' => $request->category,
            'brand' => $request->brand ?? '',
            'image' => $imageUrls ?? [],
            'sizes' => $sizes,
            'colors' => $colors,
            'bestseller' => filter_var($request->bestseller, FILTER_VALIDATE_BOOLEAN),
            'stock' => $request->stock ?? 100,
        ]);

        Cache::flush(); // Xóa cache để cập nhật danh sách mới

        $productData = $product->toArray();
        $productData['_id'] = (string) $product->id;

        return response()->json([
            'success' => true,
            'message' => 'Đã thêm sản phẩm thành công',
            'product' => $productData
        ]);
    }

    // Lấy chi tiết 1 sản phẩm
    public function single(Request $request)
    {
        $id = $request->productId ?? $request->id ?? $request->_id;

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $productData = $product->toArray();
        $productData['_id'] = (string) $product->id;

        return response()->json([
            'success' => true,
            'product' => $productData
        ]);
    }

    // Xóa sản phẩm
    public function remove(Request $request)
    {
        $id = $request->id ?? $request->_id ?? $request->productId;

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm để xóa'
            ], 404);
        }

        $product->delete();

        Cache::flush(); // Xóa cache sau khi xóa

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa sản phẩm thành công'
        ]);
    }
}
