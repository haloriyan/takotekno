<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CmsCatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'name' => "Finansial & Pemodalan",
                'slug' => "finansial",
                'post_count' => 0,
            ],
            [
                'name' => "Teknologi & Gadget",
                'slug' => "teknologi",
                'post_count' => 0,
            ],
            [
                'name' => "Kesehatan & Wellness",
                'slug' => "kesehatan",
                'post_count' => 0,
            ],
            [
                'name' => "Hukum & Legalitas",
                'slug' => "hukum-legalitas",
                'post_count' => 0,
            ],
            [
                'name' => "Marketing",
                'slug' => "marketing",
                'post_count' => 0,
            ],
            [
                'name' => "Human Resource",
                'slug' => "human-resource",
                'post_count' => 0,
            ],
        ];
        DB::table('cms_categories')->insert($datas);
    }
}
