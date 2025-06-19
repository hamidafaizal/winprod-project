<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductLink;
use App\Models\Setting;
use Illuminate\Http\Request;

class DistribusiController extends Controller
{
    public function setCapacity(Request $request)
    {
        $request->validate(['capacity' => 'required|integer|min:100']);
        Setting::updateOrCreate(['key' => 'ember_capacity'], ['value' => $request->capacity]);
        return response()->json(['message' => 'Kapasitas ember diatur ke ' . $request->capacity]);
    }

    public function getStatus()
    {
        $capacitySetting = Setting::where('key', 'ember_capacity')->first();
        $capacity = $capacitySetting ? (int) $capacitySetting->value : 0;
        
        $current_count = ProductLink::where('status', 'Di Dalam Ember')->count();
        $links = ProductLink::where('status', 'Di Dalam Ember')->get();
        
        return response()->json([
            'capacity' => $capacity,
            'current_count' => $current_count,
            'links' => $links,
        ]);
    }

    public function send(Request $request)
    {
        // Simulasi pengiriman ke WA
        // Logika sebenarnya akan lebih kompleks
        ProductLink::where('status', 'Di Dalam Ember')->update(['status' => 'Terkirim ke WA']);
        return response()->json(['message' => 'Batch berhasil dikirim (simulasi).']);
    }
}