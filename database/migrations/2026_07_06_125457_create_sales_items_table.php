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
        Schema::create('sales_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('store_id')->unsigned()->index();
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->bigInteger('sales_id')->unsigned()->index();
            $table->foreign('sales_id')->references('id')->on('sales')->onDelete('cascade');
            $table->bigInteger('product_id')->unsigned()->index()->nullable();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->bigInteger('stock_id')->unsigned()->index();
            $table->foreign('stock_id')->references('id')->on('product_stocks')->onDelete('cascade');
            $table->bigInteger('movement_item_id')->unsigned()->index()->nullable();
            $table->foreign('movement_item_id')->references('id')->on('stock_movement_items')->onDelete('set null');

            $table->bigInteger('price');
            $table->integer('quantity');
            $table->bigInteger('total_price');
            $table->bigInteger('margin');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_items');
    }
};
