<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting; // <-- 1. Import Model Setting
use Illuminate\Http\Request; // <-- 2. Import class Request

class SettingController extends Controller
{
    /**
     * Menampilkan semua data settings.
     */
    public function index()
    {
        // 3. Ambil semua data dari tabel 'settings'
        $settings = Setting::all();

        // 4. Ubah data menjadi format yang mudah dibaca (key => value)
        $formattedSettings = $settings->pluck('value', 'key');

        // 5. Kembalikan data dalam format JSON
        return response()->json($formattedSettings);
    }

    /**
     * Menyimpan nilai threshold.
     */
    public function storeThreshold(Request $request)
    {
        // 6. Validasi request: pastikan 'threshold' ada dan merupakan angka
        $request->validate([
            'threshold' => 'required|integer',
        ]);

        // 7. Simpan atau update data di database
        // Dia akan mencari baris dengan 'key' = 'threshold'.
        // Jika ada, value-nya di-update. Jika tidak ada, baris baru akan dibuat.
        Setting::updateOrCreate(
            ['key' => 'threshold'],
            ['value' => $request->threshold]
        );

        // 8. Kembalikan pesan sukses
        return response()->json([
            'message' => 'Threshold berhasil disimpan.'
        ], 200); // 200 artinya OK
    }
}