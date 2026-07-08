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
        Schema::create('product_image_labels', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('image_id')->unsigned()->index();
            $table->foreign('image_id')->references('id')->on('product_images')->onDelete('cascade');
            $table->bigInteger('product_id')->unsigned()->index();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->bigInteger('store_id')->unsigned()->index();
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');

            $table->string('label');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_image_labels');
    }
};
