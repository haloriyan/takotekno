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
        Schema::create('stock_movement_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('store_id')->unsigned()->index();
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->bigInteger('movement_id')->unsigned()->index();
            $table->foreign('movement_id')->references('id')->on('stock_movements')->onDelete('cascade');
            $table->bigInteger('product_id')->unsigned()->index();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->bigInteger('stock_id')->unsigned()->index();
            $table->foreign('stock_id')->references('id')->on('product_stocks')->onDelete('cascade');

            $table->bigInteger('price');
            $table->integer('quantity');
            $table->bigInteger('total_price');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movement_items');
    }
};
