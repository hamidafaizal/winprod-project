<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductLink;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use Exception;

class ProductLinkController extends Controller
{
    public function index()
    {
        return response()->json(ProductLink::orderBy('id')->get());
    }

    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rank' => 'required|integer|min:1',
            'threshold_komisi' => 'required|numeric|min:0',
            'files' => 'required|array',
            'files.*' => 'required|file|mimes:csv,txt',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            ProductLink::query()->delete();
            Setting::updateOrCreate(['key' => 'threshold_komisi'], ['value' => $request->threshold_komisi]);

            $rank = (int)$request->input('rank');
            $allFilteredLinks = [];

            foreach ($request->file('files') as $file) {
                $csv = Reader::createFromPath($file->getRealPath(), 'r');
                $csv->setHeaderOffset(0);
                $records = $csv->getRecords();

                $lolosLangsung = [];
                $kandidatRank = [];

                foreach ($records as $record) {
                    if (strtoupper($record['Tren']) === 'TURUN') continue;
                    if (strtoupper($record['Tren']) === 'NAIK' && strtoupper($record['isAd']) === 'YES') {
                        $lolosLangsung[] = $record['productLink'];
                        continue;
                    }
                    if (strtoupper($record['Tren']) === 'NAIK' && strtoupper($record['isAd']) === 'NO') {
                        $kandidatRank[] = $record;
                    }
                }
                
                $collection = collect($kandidatRank);
                $rankedLinks = $collection
                    ->sortByDesc('Penjualan 30 Hari')
                    ->take($rank)
                    ->pluck('productLink')
                    ->all();
                
                $allFilteredLinks = array_merge($allFilteredLinks, $lolosLangsung, $rankedLinks);
            }

            $finalLinks = collect($allFilteredLinks)->unique()->shuffle()->map(function ($link) {
                return ['link' => $link, 'created_at' => now(), 'updated_at' => now()];
            })->all();
            
            ProductLink::insert($finalLinks);
            DB::commit();

            return response()->json([
                'message' => 'File berhasil diproses, ' . count($finalLinks) . ' link unik ditemukan.',
                'total_links_saved' => count($finalLinks)
            ]);

        } catch (Exception $e) {
            if (DB::transactionLevel() > 0) DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan saat memproses file.', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function reset()
    {
        ProductLink::query()->delete();
        // Juga reset status komreg
        Setting::updateOrCreate(['key' => 'threshold_komisi'], ['value' => 10]);
        return response()->json(['message' => 'Semua data riset berhasil di-reset.']);
    }
}