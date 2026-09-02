<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;

// User Auth Routes
Route::prefix('user')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/admin', [UserController::class, 'adminLogin']);
    Route::post('/admin-login', [UserController::class, 'adminLogin']);
    Route::get('/addresses', [UserController::class, 'getAddresses']);
    Route::post('/addresses', [UserController::class, 'addAddress']);
    Route::get('/{userId}/addresses', [UserController::class, 'getAddresses']);
    Route::post('/{userId}/addresses', [UserController::class, 'addAddress']);
    Route::put('/{userId}/addresses/{addressId}', [UserController::class, 'updateAddress']);
    Route::delete('/{userId}/addresses/{addressId}', [UserController::class, 'deleteAddress']);
    Route::put('/{userId}/addresses/{addressId}/default', [UserController::class, 'setDefaultAddress']);
    Route::get('/users', [UserController::class, 'getUsers']);
    Route::get('/list', [UserController::class, 'getUsers']);
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::post('/remove', [UserController::class, 'removeUser']);
    Route::post('/delete', [UserController::class, 'removeUser']);
});

// Product Routes (Singular & Plural Aliases)
Route::get('/products', [ProductController::class, 'list']);
Route::prefix('product')->group(function () {
    Route::get('/list', [ProductController::class, 'list']);
    Route::post('/add', [ProductController::class, 'add']);
    Route::post('/remove', [ProductController::class, 'remove']);
    Route::post('/delete', [ProductController::class, 'remove']);
    Route::put('/update/{id}', [ProductController::class, 'update']);
    Route::post('/update/{id}', [ProductController::class, 'update']);
    Route::post('/update', [ProductController::class, 'update']);
    Route::post('/single', [ProductController::class, 'single']);
    Route::get('/single/{id}', [ProductController::class, 'single']);
});
Route::prefix('products')->group(function () {
    Route::get('/list', [ProductController::class, 'list']);
    Route::post('/add', [ProductController::class, 'add']);
    Route::post('/remove', [ProductController::class, 'remove']);
    Route::post('/delete', [ProductController::class, 'remove']);
    Route::put('/update/{id}', [ProductController::class, 'update']);
    Route::post('/update/{id}', [ProductController::class, 'update']);
    Route::post('/single', [ProductController::class, 'single']);
    Route::get('/single/{id}', [ProductController::class, 'single']);
});

// Category Routes
Route::get('/categories', [CategoryController::class, 'list']);
Route::get('/category', [CategoryController::class, 'list']);
Route::post('/category', [CategoryController::class, 'add']);
Route::put('/category/{id}', [CategoryController::class, 'update']);
Route::post('/category/{id}', [CategoryController::class, 'update']);
Route::delete('/category/{id}', [CategoryController::class, 'remove']);
Route::prefix('category')->group(function () {
    Route::get('/', [CategoryController::class, 'list']);
    Route::get('/list', [CategoryController::class, 'list']);
    Route::post('/add', [CategoryController::class, 'add']);
    Route::post('/remove', [CategoryController::class, 'remove']);
    Route::post('/delete', [CategoryController::class, 'remove']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'remove']);
});
Route::prefix('categories')->group(function () {
    Route::get('/list', [CategoryController::class, 'list']);
    Route::post('/add', [CategoryController::class, 'add']);
    Route::post('/remove', [CategoryController::class, 'remove']);
});

// Brand Routes
Route::get('/brands', [BrandController::class, 'list']);
Route::get('/brand', [BrandController::class, 'list']);
Route::post('/brand', [BrandController::class, 'add']);
Route::put('/brand/{id}', [BrandController::class, 'update']);
Route::post('/brand/{id}', [BrandController::class, 'update']);
Route::delete('/brand/{id}', [BrandController::class, 'remove']);
Route::prefix('brand')->group(function () {
    Route::get('/', [BrandController::class, 'list']);
    Route::get('/list', [BrandController::class, 'list']);
    Route::post('/add', [BrandController::class, 'add']);
    Route::post('/remove', [BrandController::class, 'remove']);
    Route::post('/delete', [BrandController::class, 'remove']);
    Route::put('/{id}', [BrandController::class, 'update']);
    Route::delete('/{id}', [BrandController::class, 'remove']);
});

// Cart Routes
Route::prefix('cart')->group(function () {
    Route::post('/get', [CartController::class, 'getCart']);
    Route::post('/add', [CartController::class, 'addToCart']);
    Route::post('/update', [CartController::class, 'updateCart']);
});

// Order Routes
Route::prefix('order')->group(function () {
    Route::post('/place', [OrderController::class, 'placeOrder']);
    Route::post('/create', [OrderController::class, 'placeOrder']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::post('/my-orders', [OrderController::class, 'myOrders']);
    Route::post('/userorders', [OrderController::class, 'userOrders']);
    Route::get('/userorders', [OrderController::class, 'userOrders']);
    Route::post('/list', [OrderController::class, 'allOrders']);
    Route::get('/list', [OrderController::class, 'allOrders']);
    Route::post('/status', [OrderController::class, 'updateStatus']);
    Route::post('/update-status', [OrderController::class, 'updateStatus']);
    Route::post('/delete', [OrderController::class, 'deleteOrder']);
    Route::post('/remove', [OrderController::class, 'deleteOrder']);
});

// Contact Routes
Route::prefix('contact')->group(function () {
    Route::post('/create', [ContactController::class, 'create']);
    Route::get('/list', [ContactController::class, 'list']);
});

// Dashboard Stats
Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'getStats']);
});

// Global OPTIONS fallback handler for CORS preflight
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN, token')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');
