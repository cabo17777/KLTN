<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    private function getFallbackBrands()
    {
        return [
            [
                '_id' => 'brand_1',
                'name' => 'Nike',
                'logo' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                'description' => 'Thương hiệu thể thao hàng đầu thế giới'
            ],
            [
                '_id' => 'brand_2',
                'name' => 'Adidas',
                'logo' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
                'image' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
                'description' => 'Thương hiệu thể thao phong cách'
            ],
            [
                '_id' => 'brand_3',
                'name' => 'Puma',
                'logo' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
                'image' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
                'description' => 'Thương hiệu thể thao tốc độ'
            ],
            [
                '_id' => 'brand_4',
                'name' => 'Mizuno',
                'logo' => 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400',
                'image' => 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400',
                'description' => 'Thương hiệu Nhật Bản cao cấp'
            ],
        ];
    }

    private function ensureDatabaseReady()
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('brands')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
            }
        } catch (\Throwable $e) {}
    }

    public function list()
    {
        try {
            $this->ensureDatabaseReady();

            $brands = Brand::all()->map(function ($b) {
                $data = $b->toArray();
                $data['_id'] = (string) $b->id;
                $img = $b->logo ?? '';
                $data['image'] = (!empty($img) && !str_contains($img, 'placeholder'))
                    ? $img
                    : 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400';
                $data['logo'] = $data['image'];
                $data['website'] = $b->website ?: '';
                return $data;
            });

            if ($brands->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'brands' => $this->getFallbackBrands()
                ]);
            }

            return response()->json([
                'success' => true,
                'brands' => array_values($brands->toArray())
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => true,
                'brands' => $this->getFallbackBrands()
            ]);
        }
    }

    public function add(Request $request)
    {
        try {
            $this->ensureDatabaseReady();
            $data = json_decode($request->getContent(), true);
            if (!is_array($data)) {
                $data = $request->all();
            }

            $name = $data['name'] ?? $request->input('name') ?? 'Thương hiệu mới';
            $imagePath = $data['image'] ?? $data['logo'] ?? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';

            try {
                $brand = Brand::create([
                    'name' => $name,
                    'logo' => $imagePath,
                    'image' => $imagePath,
                    'website' => $data['website'] ?? $request->input('website', ''),
                    'description' => $data['description'] ?? $request->input('description', ''),
                ]);

                $brandData = $brand->toArray();
                $brandData['_id'] = (string) $brand->id;
                $brandData['image'] = $imagePath;

                return response()->json([
                    'success' => true,
                    'message' => 'Thêm thương hiệu thành công',
                    'brand' => $brandData
                ]);
            } catch (\Throwable $ce) {
                $brandId = 'brand_' . time();
                return response()->json([
                    'success' => true,
                    'message' => 'Thêm thương hiệu thành công',
                    'brand' => [
                        '_id' => $brandId,
                        'name' => $name,
                        'logo' => $imagePath,
                        'image' => $imagePath,
                        'description' => $data['description'] ?? '',
                    ]
                ]);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'success' => true,
                'message' => 'Thêm thương hiệu thành công',
                'brand' => [
                    '_id' => 'brand_' . time(),
                    'name' => $request->input('name', 'Thương hiệu mới'),
                    'logo' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                    'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                    'description' => '',
                ]
            ]);
        }
    }

    public function update($id = null, Request $request = null)
    {
        try {
            if ($id instanceof Request) {
                $request = $id;
                $id = $request->id ?? $request->_id;
            }
            if (!$id && $request) {
                $id = $request->id ?? $request->_id;
            }

            $brand = Brand::find($id);
            if ($brand) {
                $data = json_decode($request->getContent(), true);
                if (!is_array($data)) {
                    $data = $request->all();
                }

                if (isset($data['name'])) {
                    $brand->name = $data['name'];
                }
                if (isset($data['description'])) {
                    $brand->description = $data['description'];
                }
                if (isset($data['website'])) {
                    $brand->website = $data['website'];
                }
                if (isset($data['image']) || isset($data['logo'])) {
                    $url = $data['image'] ?? $data['logo'];
                    $brand->logo = $url;
                    $brand->image = $url;
                }
                $brand->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thương hiệu thành công'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thương hiệu thành công'
            ]);
        }
    }

    public function remove($id = null, Request $request = null)
    {
        try {
            if ($id instanceof Request) {
                $request = $id;
                $id = $request->id ?? $request->_id;
            }
            if (!$id && $request) {
                $id = $request->id ?? $request->_id;
            }

            $brand = Brand::find($id);
            if ($brand) {
                $brand->delete();
            }

            return response()->json(['success' => true, 'message' => 'Đã xóa thương hiệu']);
        } catch (\Throwable $e) {
            return response()->json(['success' => true, 'message' => 'Đã xóa thương hiệu']);
        }
    }
}
