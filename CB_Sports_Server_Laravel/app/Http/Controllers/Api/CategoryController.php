<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function list()
    {
        $categories = Category::all()->map(function ($cat) {
            $data = $cat->toArray();
            $data['_id'] = (string) $cat->id;
            $data['image'] = (!empty($cat->image) && !str_contains($cat->image, 'placeholder'))
                ? $cat->image
                : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
            return $data;
        });

        return response()->json([
            'success' => true,
            'categories' => array_values($categories->toArray())
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
            return response()->json(['success' => false, 'message' => 'Tên danh mục không được để trống'], 400);
        }

        $imagePath = '';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $imagePath = asset('storage/' . $path);
        } else {
            $imagePath = $data['image'] ?? 'https://via.placeholder.com/150';
        }

        $category = Category::create([
            'name' => $name,
            'slug' => Str::slug($name),
            'image' => $imagePath,
            'description' => $data['description'] ?? $request->input('description', ''),
        ]);

        $categoryData = $category->toArray();
        $categoryData['_id'] = (string) $category->id;

        return response()->json([
            'success' => true,
            'message' => 'Thêm danh mục thành công',
            'category' => $categoryData
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

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        if (isset($data['name'])) {
            $category->name = $data['name'];
            $category->slug = Str::slug($data['name']);
        }
        if (isset($data['description'])) {
            $category->description = $data['description'];
        }

        if ($request && $request->hasFile('image')) {
            $path = $request->file('image')->store('categories', 'public');
            $category->image = asset('storage/' . $path);
        } elseif (isset($data['image']) && !empty($data['image'])) {
            $category->image = $data['image'];
        }

        $category->save();

        $categoryData = $category->toArray();
        $categoryData['_id'] = (string) $category->id;

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công',
            'category' => $categoryData
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

        $category = Category::find($id);
        if ($category) {
            $category->delete();
            return response()->json(['success' => true, 'message' => 'Đã xóa danh mục']);
        }
        return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
    }
}
