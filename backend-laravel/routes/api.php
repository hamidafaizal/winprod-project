<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductLinkController;
use App\Http\Controllers\Api\KomregController;
use App\Http\Controllers\Api\DistribusiController;

// Rute untuk Riset Produk (Navbar 1)
Route::post('/riset/upload', [ProductLinkController::class, 'upload']);
Route::get('/riset/links', [ProductLinkController::class, 'index']);
Route::post('/riset/reset', [ProductLinkController::class, 'reset']);

// Rute untuk Komreg (Navbar 2)
Route::post('/komreg/analyze', [KomregController::class, 'analyze']);
Route::post('/komreg/approve-and-send', [KomregController::class, 'approveAndSend']);

// Rute untuk Distribusi (Navbar 3)
Route::post('/distribusi/capacity', [DistribusiController::class, 'setCapacity']);
Route::get('/distribusi/status', [DistribusiController::class, 'getStatus']);
Route::post('/distribusi/send', [DistribusiController::class, 'send']);