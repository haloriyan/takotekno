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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('store_id')->unsigned()->index();
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('whatsapp')->nullable();
            $table->bigInteger('point');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
