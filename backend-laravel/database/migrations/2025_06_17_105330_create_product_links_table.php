<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('product_links', function (Blueprint $table) {
        $table->id();
        $table->text('link'); // Menggunakan TEXT untuk URL yang mungkin sangat panjang
        $table->string('commission')->nullable(); // Kolom komisi, boleh kosong (nullable) pada awalnya
        $table->string('status')->default('Menunggu Analisa'); // Kolom status, dengan nilai default
        $table->timestamps(); // Kolom created_at dan updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_links');
    }
};
