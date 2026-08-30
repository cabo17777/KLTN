<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function list()
    {
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

        return response()->json([
            'success' => true,
            'brands' => array_values($brands->toArray())
        ]);
    }

    public function add(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $name = $data['name'] ?? $request->input('name');
        if (!$name) {
            return response()->json(['success' => false, 'message' => 'Tên thương hiệu không được để trống'], 400);
        }

        $imagePath = '';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('brands', 'public');
            $imagePath = asset('storage/' . $path);
        } elseif ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('brands', 'public');
            $imagePath = asset('storage/' . $path);
        } else {
            $imagePath = $data['image'] ?? $data['logo'] ?? 'https://via.placeholder.com/150';
        }

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
    }

    public function update($id = null, Request $request = null)
    {
        if ($id instanceof Request) {
            $request = $id;
            $id = $request->id ?? $request->_id;
        }
        if (!$id && $request) {
            $id = $request->id ?? $request->_id;
        }

        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu'], 404);
        }

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

        if ($request && ($request->hasFile('image') || $request->hasFile('logo'))) {
            $file = $request->file('image') ?: $request->file('logo');
            $path = $file->store('brands', 'public');
            $url = asset('storage/' . $path);
            $brand->logo = $url;
            $brand->image = $url;
        } elseif (isset($data['image']) || isset($data['logo'])) {
            $url = $data['image'] ?? $data['logo'];
            $brand->logo = $url;
            $brand->image = $url;
        }

        $brand->save();

        $brandData = $brand->toArray();
        $brandData['_id'] = (string) $brand->id;
        $brandData['image'] = $brand->image ?: ($brand->logo ?: '');

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thương hiệu thành công',
            'brand' => $brandData
        ]);
    }

    public function remove($id = null, Request $request = null)
    {
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
            return response()->json(['success' => true, 'message' => 'Đã xóa thương hiệu']);
        }
        return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu'], 404);
    }
}
