<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalUsers = User::count();
        $totalRevenue = (float) Order::sum('amount');

        $recentOrders = Order::with('user')->orderBy('id', 'desc')->take(5)->get()->map(function ($o) {
            $data = $o->toArray();
            $data['_id'] = (string) $o->id;
            $data['userId'] = $o->user ? [
                'name' => $o->user->name,
                'email' => $o->user->email,
            ] : [
                'name' => is_array($o->address) ? ($o->address['name'] ?? 'Khách hàng') : 'Khách hàng',
                'email' => is_array($o->address) ? ($o->address['email'] ?? 'N/A') : 'N/A',
            ];
            $data['date'] = $o->created_at ? $o->created_at->toISOString() : now()->toISOString();
            return $data;
        });

        $topProducts = Product::orderBy('id', 'desc')->take(5)->get()->map(function ($p) {
            $data = $p->toArray();
            $data['_id'] = (string) $p->id;
            $data['price'] = (float) $p->price;
            $data['stock'] = (int) ($p->stock ?? 10);
            return $data;
        });

        return response()->json([
            'success' => true,
            'stats' => [
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalUsers' => $totalUsers,
                'totalRevenue' => $totalRevenue,
                'recentOrders' => array_values($recentOrders->toArray()),
                'topProducts' => array_values($topProducts->toArray()),
            ],
            'latestOrders' => array_values($recentOrders->toArray())
        ]);
    }
}
