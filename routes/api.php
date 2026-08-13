<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LogAnalyzerController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::post('/parse', [LogAnalyzerController::class, 'parse']);
Route::post('/explain', [LogAnalyzerController::class, 'explain']);
Route::post('/report', [LogAnalyzerController::class, 'report']);
