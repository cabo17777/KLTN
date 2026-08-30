<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        $userId = $request->userId ?? $request->user()?->id;
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User không tồn tại'], 404);
        }

        return response()->json([
            'success' => true,
            'cartData' => $user->cart_data ?? new \stdClass()
        ]);
    }

    public function addToCart(Request $request)
    {
        $userId = $request->userId ?? $request->user()?->id;
        $itemId = $request->itemId;
        $size = $request->size;

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User không tồn tại'], 404);
        }

        $cartData = $user->cart_data ?? [];

        if (!isset($cartData[$itemId])) {
            $cartData[$itemId] = [];
        }

        if (isset($cartData[$itemId][$size])) {
            $cartData[$itemId][$size] += 1;
        } else {
            $cartData[$itemId][$size] = 1;
        }

        $user->cart_data = $cartData;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Đã thêm vào giỏ hàng',
            'cartData' => $cartData
        ]);
    }

    public function updateCart(Request $request)
    {
        $userId = $request->userId ?? $request->user()?->id;
        $itemId = $request->itemId;
        $size = $request->size;
        $quantity = (int) $request->quantity;

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User không tồn tại'], 404);
        }

        $cartData = $user->cart_data ?? [];

        if ($quantity > 0) {
            if (!isset($cartData[$itemId])) {
                $cartData[$itemId] = [];
            }
            $cartData[$itemId][$size] = $quantity;
        } else {
            if (isset($cartData[$itemId][$size])) {
                unset($cartData[$itemId][$size]);
                if (empty($cartData[$itemId])) {
                    unset($cartData[$itemId]);
                }
            }
        }

        $user->cart_data = $cartData;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật giỏ hàng thành công',
            'cartData' => $cartData
        ]);
    }
}
