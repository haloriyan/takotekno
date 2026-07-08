<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'nullable|email',
            'whatsapp' => 'nullable',
            'point' => 'nullable|integer',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama customer tidak boleh kosong',
            'email.email' => 'Format email tidak valid',
            'point.integer' => 'Point harus berupa angka',
        ];
    }
}
