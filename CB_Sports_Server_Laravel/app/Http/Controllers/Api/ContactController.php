<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone ?? '',
            'subject' => $request->subject ?? '',
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gửi tin nhắn liên hệ thành công',
            'contact' => $contact
        ]);
    }

    public function list()
    {
        $contacts = Contact::orderBy('id', 'desc')->get()->map(function ($c) {
            $data = $c->toArray();
            $data['_id'] = (string) $c->id;
            return $data;
        });

        return response()->json([
            'success' => true,
            'contacts' => $contacts
        ]);
    }
}
