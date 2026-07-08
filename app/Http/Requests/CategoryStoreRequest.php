<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CategoryStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'icon' => 'image|mimes:png,jpg|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama kategori tidak boleh kosong',
            'icon.image' => 'Icon harus berupa file gambar',
            'icon.mimes' => 'Format icon harus JPG atau PNG',
            'icon.max' => 'Icon tidak boleh lebih dari 2 MB',
        ];
    }
}
