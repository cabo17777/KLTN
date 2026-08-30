<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // Đặt hàng COD / Online
    public function placeOrder(Request $request)
    {
        $userId = $request->userId ?? $request->user()?->id;

        $items = is_array($request->items) ? $request->items : json_decode($request->items, true);
        $address = is_array($request->address) ? $request->address : json_decode($request->address, true);

        $order = Order::create([
            'order_code' => 'ORD-' . strtoupper(Str::random(8)),
            'user_id' => $userId,
            'items' => $items ?? [],
            'amount' => $request->amount,
            'address' => $address ?? [],
            'status' => 'Order Placed',
            'payment_method' => $request->paymentMethod ?? $request->payment_method ?? 'COD',
            'payment' => filter_var($request->payment, FILTER_VALIDATE_BOOLEAN),
            'date' => now()->timestamp * 1000,
        ]);

        // Clear user cart
        if ($userId) {
            $user = User::find($userId);
            if ($user) {
                $user->cart_data = new \stdClass();
                $user->save();
            }
        }

        $orderData = $order->toArray();
        $orderData['_id'] = (string) $order->id;

        return response()->json([
            'success' => true,
            'message' => 'Đặt hàng thành công',
            'orderId' => (string) $order->id,
            'order' => $orderData
        ]);
    }

    // Danh sách đơn hàng của User
    public function userOrders(Request $request)
    {
        return $this->myOrders($request);
    }

    // API /api/order/my-orders
    public function myOrders(Request $request)
    {
        $userId = $request->user()?->id ?? $request->userId;

        if (!$userId) {
            $tokenHeader = $request->header('Authorization');
            if ($tokenHeader && str_contains($tokenHeader, 'Bearer ')) {
                $tokenStr = str_replace('Bearer ', '', $tokenHeader);
                $pat = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
                if ($pat) {
                    $userId = $pat->tokenable_id;
                }
            }
        }

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'orders' => []
            ], 401);
        }

        $orders = Order::where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($order) {
                $data = $order->toArray();
                $data['_id'] = (string) $order->id;
                return $data;
            });

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    // Danh sách tất cả đơn hàng cho Admin
    public function allOrders(Request $request)
    {
        $orders = Order::with('user')->orderBy('id', 'desc')
            ->get()
            ->map(function ($order) {
                $data = $order->toArray();
                $data['_id'] = (string) $order->id;
                $data['paymentStatus'] = $order->payment ? 'paid' : 'pending';
                $data['paymentMethod'] = strtolower($order->payment_method ?? 'cod');
                $data['status'] = strtolower($order->status ?? 'pending');
                $data['userId'] = $order->user ? [
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                ] : [
                    'name' => is_array($order->address) ? ($order->address['name'] ?? 'Khách hàng') : 'Khách hàng',
                    'email' => is_array($order->address) ? ($order->address['email'] ?? 'N/A') : 'N/A',
                ];
                return $data;
            });

        return response()->json([
            'success' => true,
            'orders' => array_values($orders->toArray())
        ]);
    }

    // Cập nhật trạng thái đơn hàng (Admin)
    public function updateStatus(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $orderId = $data['orderId'] ?? $data['id'] ?? $data['_id'] ?? null;
        $status = $data['status'] ?? null;
        $paymentStatus = $data['paymentStatus'] ?? null;

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng'], 404);
        }

        if ($status) {
            $order->status = $status;
        }

        if ($paymentStatus !== null) {
            $order->payment = ($paymentStatus === 'paid' || $paymentStatus === true || $paymentStatus === '1');
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Đã cập nhật trạng thái đơn hàng'
        ]);
    }

    // Xóa đơn hàng (Admin)
    public function deleteOrder(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $orderId = $data['orderId'] ?? $data['id'] ?? $data['_id'] ?? null;

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng để xóa'], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa đơn hàng thành công'
        ]);
    }
}
