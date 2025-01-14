<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AgeController extends Controller
{
    public function index() {
        $services = [
            [
                'id' => 1,
                'image' => "ktf-2.jpg",
                'name' => "Event Management",
                'icon' => "calendar-outline",
                'sub' => ["Exhibition", "Music Festival", "Brand Activation", "Product Launching", "Gathering", "Seminar"]
            ],
            [
                'id' => 2,
                'image' => "vwe-3.jpg",
                'name' => "Production",
                'icon' => "cog-outline",
                'sub' => ["Booth Special Design", "Booth Standard Design", "Interior Outlet / Counter", "Office & Home Interior", "Rigging & Stage"]
            ],
            [
                'id' => 3,
                'image' => "photo-video.png",
                'name' => "Advertising",
                'icon' => "volume-high-outline",
                'sub' => ["Photo & Video", "Car Branding", "Billboard / Baliho", "Poster & Flyer", "Spanduk", "Spot Radio", "Vertical Banner"]
            ],
            [
                'id' => 4,
                'image' => "vwe-2.jpg",
                'name' => "Event Equipment",
                'icon' => "hammer-outline",
                'sub' => ["LED Videotron", "Lighting & Sound System", "AC Standing", "Genset", "Internet & Connectivity", "Sarnafil Tent", "Walkie Talkie (HT)"]
            ],
            [
                'id' => 5,
                'image' => "vwe.jpg",
                'name' => "Procurement Goods",
                'icon' => "clipboard-outline",
                'sub' => ["Merchandise", "Office Supply", "Electronic & Furniture"]
            ],
        ];
        return view('age.index', [
            'services' => $services,
        ]);
    }
    public function about() {
        return view('age.about');
    }
    public function client() {
        return view('age.client');
    }
    public function contact() {
        return view('age.contact');
    }

    public function eventManagement() {
        return view('age.eventManagement');
    }
    public function production() {
        return view('age.production');
    }
    public function advertising() {
        return view('age.advertising');
    }
    public function eventEquipment() {
        return view('age.eventEquipment');
    }
    public function procurementGoods() {
        return view('age.procurementGoods');
    }
}
