<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductLink;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
// Menggunakan Facade dan Content dari Gemini
use Gemini\Laravel\Facades\Gemini;
use Gemini\Data\Content;

class KomregController extends Controller
{
    /**
     * Menganalisa gambar menggunakan AI Gemini dan mengembalikan hasil komisi.
     */
    public function analyze(Request $request)
    {
        $request->validate([ 'images.*' => 'required|image' ]);

        $prompt = "Anda adalah asisten data ekstraksi yang sangat akurat. Tugas Anda adalah menganalisa gambar screenshot dari sebuah aplikasi e-commerce dan mengekstrak nilai persentase komisi untuk setiap produk berdasarkan aturan ketat berikut, lalu mengembalikan hasilnya dalam format JSON array. ATURAN EKSTRAKSI: 1. Satu unit produk diidentifikasi oleh adanya ikon \"centang oranye\" di sisi paling kiri. Proses dari atas ke bawah. 2. Untuk setiap produk yang memiliki centang oranye, pastikan produk tersebut valid dengan cara menemukan teks harga (contoh: Rp21.500) yang berwarna oranye pekat di baris yang sama. 3. Jika produk valid, cari teks \"Komisi hingga [angka]%\" yang berada di dekat harga. Ekstrak HANYA ANGKA numeriknya saja. 4. Jika sebuah produk valid (memiliki centang oranye dan harga oranye) tetapi teks \"Komisi hingga [angka]%\" tidak ditemukan, maka nilai komisi untuk produk tersebut adalah 0. 5. Urutan angka dalam hasil akhir HARUS sesuai dengan urutan produk dari atas ke bawah di dalam gambar. FORMAT OUTPUT: Hanya berikan jawaban dalam format JSON array berisi angka (integer). Jangan menyertakan teks, penjelasan, atau format markdown apa pun selain JSON array itu sendiri. Contoh output yang diharapkan: [15, 5, 17, 12, 3]";
        $allCommissions = [];

        foreach ($request->file('images') as $image) {
            try {
                // =================================================================
                // === PERBAIKAN FINAL PEMANGGILAN AI SESUAI VERSI PAKET ANDA ===
                // =================================================================
                $result = Gemini::generateContent(
                    model: 'gemini-pro-vision', // <-- Menyebutkan model secara eksplisit
                    contents: [
                        $prompt,
                        Content::blob(
                            mimeType: $image->getMimeType(),
                            data: base64_encode($image->getContent())
                        )
                    ]
                );

                $responseText = $result->text();
                $jsonText = preg_replace('/```json\s*|\s*```/', '', $responseText);
                $commissions = json_decode($jsonText, true);

                if (is_array($commissions)) {
                    $allCommissions = array_merge($allCommissions, $commissions);
                }
            } catch (\Exception $e) {
                return response()->json(['message' => 'Gagal menganalisa gambar.', 'error' => $e->getMessage()], 500);
            }
        }
        return response()->json($allCommissions);
    }

    /**
     * Menyetujui komisi, memperbarui status link, mengisi ember,
     * dan mengembalikan daftar link terbaru.
     */
    public function approveAndSend(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'commissions' => 'required|array',
            'commissions.*' => 'required|numeric',
        ]);
        if ($validator->fails()) { return response()->json(['errors' => $validator->errors()], 422); }

        DB::beginTransaction();
        try {
            $linksToProcess = ProductLink::where('status', 'Menunggu Analisa')->orderBy('id')->get();
            $commissions = $request->input('commissions');
            $commissionThreshold = (float) Setting::where('key', 'threshold_komisi')->first()->value ?? 0;
            $approvedLinks = [];

            foreach ($linksToProcess as $index => $link) {
                if (!isset($commissions[$index])) continue;
                $link->commission = $commissions[$index];
                if ($link->commission >= $commissionThreshold) {
                    $link->status = 'Terkirim ke Batch';
                    $approvedLinks[] = $link;
                } else {
                    $link->status = 'Ditolak';
                }
                $link->save();
            }

            $emberCapacitySetting = Setting::firstOrCreate(['key' => 'ember_capacity'], ['value' => '200']);
            $emberCapacity = (int) $emberCapacitySetting->value;
            $linksInEmber = ProductLink::where('status', 'Di Dalam Ember')->count();
            $spaceAvailable = $emberCapacity - $linksInEmber;

            if ($spaceAvailable > 0 && count($approvedLinks) > 0) {
                $linksToPutInEmber = array_slice($approvedLinks, 0, $spaceAvailable);
                $linkIds = array_map(function($link) { return $link->id; }, $linksToPutInEmber);
                ProductLink::whereIn('id', $linkIds)->update(['status' => 'Di Dalam Ember']);
            }

            DB::commit();
            $updatedLinks = ProductLink::orderBy('id')->get();
            return response()->json([
                'message' => 'Proses approve berhasil. Ember distribusi telah diperbarui.',
                'links' => $updatedLinks
            ]);
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat proses approve.', 'error' => $e->getMessage()], 500);
        }
    }
}