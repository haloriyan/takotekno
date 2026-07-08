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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('store_id')->unsigned()->index();
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');

            $table->string('name');
            $table->string('icon')->nullable();
            $table->text('address')->nullable();

            $table->string('pic_name')->nullable();
            $table->string('pic_email')->nullable();
            $table->string('pic_phone')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
