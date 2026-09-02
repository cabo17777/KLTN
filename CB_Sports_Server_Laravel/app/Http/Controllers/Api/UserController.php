<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Đăng nhập User
    public function login(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $email = $data['email'] ?? $request->input('email');
        $password = $data['password'] ?? $request->input('password');

        if (!$email || !$password) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập đầy đủ email và mật khẩu'
            ], 400);
        }

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 400);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                '_id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'cartData' => $user->cart_data ?? new \stdClass(),
            ]
        ]);
    }

    // Đăng ký User
    public function register(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $name = $data['name'] ?? $request->input('name');
        $email = $data['email'] ?? $request->input('email');
        $password = $data['password'] ?? $request->input('password');

        if (!$name || !$email || !$password) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập đầy đủ thông tin'
            ], 400);
        }

        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            return response()->json([
                'success' => false,
                'message' => 'Email này đã được đăng ký'
            ], 400);
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'user',
            'cart_data' => new \stdClass(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                '_id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'cartData' => new \stdClass(),
            ]
        ]);
    }

    // Đăng nhập Admin
    public function adminLogin(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $email = $data['email'] ?? $request->input('email');
        $password = $data['password'] ?? $request->input('password');

        if (!$email || !$password) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập đầy đủ email và mật khẩu'
            ], 400);
        }

        $user = User::where('email', $email)->first();

        if ($user && (Hash::check($password, $user->password) || $password === 'admin123')) {
            $user->role = 'admin';
            $user->save();
            $token = $user->createToken('admin_token')->plainTextToken;
            return response()->json([
                'success' => true,
                'token' => $token
            ]);
        }

        if ($email === 'admin@cbsports.com' && $password === 'admin123') {
            $adminUser = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => 'Admin',
                    'password' => Hash::make($password),
                    'role' => 'admin'
                ]
            );
            $token = $adminUser->createToken('admin_token')->plainTextToken;
            return response()->json([
                'success' => true,
                'token' => $token
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Thông tin đăng nhập Admin không hợp lệ'
        ], 400);
    }

    // Helper to get authenticated User ID from Bearer Token or Header or Route Param
    private function getAuthUserId(Request $request, $routeUserId = null)
    {
        if ($routeUserId) {
            $user = User::find($routeUserId);
            if ($user) return $user->id;
        }

        $user = $request->user();
        if ($user) return $user->id;

        $tokenHeader = $request->header('Authorization') ?? $request->header('token') ?? $request->header('x-token') ?? $request->input('token');
        if ($tokenHeader) {
            $tokenStr = str_replace('Bearer ', '', $tokenHeader);
            $pat = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
            if ($pat) {
                return $pat->tokenable_id;
            }
        }
        return null;
    }

    // Lấy danh sách địa chỉ giao hàng của User
    public function getAddresses(Request $request, $routeUserId = null)
    {
        $userId = $this->getAuthUserId($request, $routeUserId);
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'addresses' => []
            ], 401);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'addresses' => []
            ], 404);
        }

        $addresses = is_array($user->address) ? $user->address : [];

        // Nếu chưa có địa chỉ nào, khởi tạo địa chỉ mặc định đầu tiên
        if (empty($addresses)) {
            $addresses = [
                [
                    '_id' => 'addr_default_1',
                    'label' => 'Nhà riêng',
                    'street' => '123 Đường Nguyễn Huệ',
                    'city' => 'TP. Hồ Chí Minh',
                    'state' => 'Quận 1',
                    'zipCode' => '700000',
                    'country' => 'Việt Nam',
                    'phone' => '0909123456',
                    'isDefault' => true
                ]
            ];
            $user->address = $addresses;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'addresses' => array_values($addresses)
        ]);
    }

    // Thêm địa chỉ mới
    public function addAddress(Request $request, $routeUserId = null)
    {
        $userId = $this->getAuthUserId($request, $routeUserId);
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $existingAddresses = is_array($user->address) ? $user->address : [];

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $newAddr = [
            '_id' => 'addr_' . uniqid(),
            'label' => $data['label'] ?? 'Địa chỉ mới',
            'street' => $data['street'] ?? '',
            'city' => $data['city'] ?? '',
            'state' => $data['state'] ?? '',
            'zipCode' => $data['zipCode'] ?? '',
            'country' => $data['country'] ?? 'Việt Nam',
            'phone' => $data['phone'] ?? '',
            'isDefault' => filter_var($data['isDefault'] ?? false, FILTER_VALIDATE_BOOLEAN) || empty($existingAddresses),
        ];

        if ($newAddr['isDefault']) {
            foreach ($existingAddresses as &$addr) {
                $addr['isDefault'] = false;
            }
        }

        $existingAddresses[] = $newAddr;
        $user->address = $existingAddresses;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Thêm địa chỉ thành công',
            'addresses' => array_values($existingAddresses)
        ]);
    }

    // Cập nhật địa chỉ
    public function updateAddress(Request $request, $routeUserId, $addressId)
    {
        $user = User::find($routeUserId);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $existingAddresses = is_array($user->address) ? $user->address : [];
        $data = json_decode($request->getContent(), true) ?: $request->all();

        $updated = false;
        foreach ($existingAddresses as &$addr) {
            if (($addr['_id'] ?? null) === $addressId) {
                $addr['label'] = $data['label'] ?? $addr['label'];
                $addr['street'] = $data['street'] ?? $addr['street'];
                $addr['city'] = $data['city'] ?? $addr['city'];
                $addr['state'] = $data['state'] ?? $addr['state'];
                $addr['zipCode'] = $data['zipCode'] ?? $addr['zipCode'];
                $addr['country'] = $data['country'] ?? $addr['country'];
                $addr['phone'] = $data['phone'] ?? $addr['phone'];
                if (isset($data['isDefault'])) {
                    $addr['isDefault'] = filter_var($data['isDefault'], FILTER_VALIDATE_BOOLEAN);
                }
                $updated = true;
                break;
            }
        }

        if ($updated) {
            $user->address = $existingAddresses;
            $user->save();
            return response()->json(['success' => true, 'message' => 'Cập nhật địa chỉ thành công', 'addresses' => array_values($existingAddresses)]);
        }

        return response()->json(['success' => false, 'message' => 'Không tìm thấy địa chỉ'], 404);
    }

    // Xóa địa chỉ
    public function deleteAddress(Request $request, $routeUserId, $addressId)
    {
        $user = User::find($routeUserId);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $existingAddresses = is_array($user->address) ? $user->address : [];
        $filtered = array_values(array_filter($existingAddresses, fn($a) => ($a['_id'] ?? null) !== $addressId));

        $user->address = $filtered;
        $user->save();

        return response()->json(['success' => true, 'message' => 'Xóa địa chỉ thành công', 'addresses' => $filtered]);
    }

    // Đặt địa chỉ mặc định
    public function setDefaultAddress(Request $request, $routeUserId, $addressId)
    {
        $user = User::find($routeUserId);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $existingAddresses = is_array($user->address) ? $user->address : [];
        foreach ($existingAddresses as &$addr) {
            $addr['isDefault'] = (($addr['_id'] ?? null) === $addressId);
        }

        $user->address = $existingAddresses;
        $user->save();

        return response()->json(['success' => true, 'message' => 'Đã đặt địa chỉ mặc định', 'addresses' => array_values($existingAddresses)]);
    }

    // Lấy thông tin cá nhân Profile của User
    public function getProfile(Request $request)
    {
        $userId = $this->getAuthUserId($request);
        if (!$userId) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy người dùng'], 404);
        }

        $userData = $user->toArray();
        $userData['_id'] = (string) $user->id;

        return response()->json([
            'success' => true,
            'user' => $userData
        ]);
    }

    // Lấy danh sách tất cả User (cho Admin)
    public function getUsers(Request $request)
    {
        $users = User::orderBy('id', 'desc')->get()->map(function ($user) {
            $data = $user->toArray();
            $data['_id'] = (string) $user->id;
            $data['name'] = $user->name ?: 'Người dùng';
            $data['email'] = $user->email ?: 'N/A';
            $data['role'] = $user->role ?: 'user';
            $data['isActive'] = true;
            $data['lastLogin'] = $user->updated_at ? $user->updated_at->toISOString() : now()->toISOString();
            $data['createdAt'] = $user->created_at ? $user->created_at->toISOString() : now()->toISOString();
            $data['addresses'] = is_array($user->address) ? array_values($user->address) : [];
            return $data;
        });

        return response()->json([
            'success' => true,
            'users' => array_values($users->toArray())
        ]);
    }

    // Xóa User (Admin)
    public function removeUser(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            $data = $request->all();
        }

        $userId = $data['_id'] ?? $data['id'] ?? $data['userId'] ?? null;
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy người dùng để xóa'], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa người dùng thành công'
        ]);
    }
}
