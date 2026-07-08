<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplierUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'icon' => 'image|mimes:png,jpg|max:2048',
            'address' => 'nullable',
            'pic_name' => 'nullable',
            'pic_email' => 'nullable|email',
            'pic_phone' => 'nullable',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama supplier tidak boleh kosong',
            'icon.image' => 'Icon harus berupa file gambar',
            'icon.mimes' => 'Format icon harus JPG atau PNG',
            'icon.max' => 'Icon tidak boleh lebih dari 2 MB',
            'pic_email.email' => 'Format email tidak valid',
        ];
    }
}
