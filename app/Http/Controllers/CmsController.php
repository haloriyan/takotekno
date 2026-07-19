<?php

namespace App\Http\Controllers;

use App\Models\CmsCategory;
use App\Models\CmsContent;
use App\Models\CmsContentCategory;
use App\Models\CmsContentSlide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CmsController extends Controller
{
    public function store(Request $request) {
        $data = $request->konten;
        $subjects = $request->subjects;
        $slides = $request->slides;

        $content = CmsContent::create([
            'title' => $data['title'],
            'slug' => Str::slug($data['title']),
            'body' => $data['short_description'],
            'cover' => $data['cover'],
            'photographer' => $data['photographer'],
            'photographer_url' => $data['photographer_url'],
        ]);

        foreach ($data['slides'] as $slide) {
            CmsContentSlide::create([
                'content_id' => $content->id,
                'title' => $slide['title'],
                'body' => $slide['body'],
            ]);
        }

        foreach ($subjects as $subj) {
            $cat = CmsCategory::where('name', 'LIKE', '%'.$subj.'%');
            $category = $cat->first();

            if ($category != null) {
                CmsContentCategory::create([
                    'content_id' => $content->id,
                    'category_id' => $category->id,
                ]);
                $cat->increment('post_count');
            }
        }

        return response()->json([
            'ok'
        ]);
    }
    public function preparation(Request $request) {
        $subjects = $request->subjects;
        $contents = [];
        
        $contentsRaw = CmsContent::whereHas('categories', function ($query) use ($subjects) {
            $query->whereIn('name', $subjects);
        })
        ->orderBy('created_at', 'DESC')
        ->take(100)
        ->get();

        foreach ($contentsRaw as $cont) {
            if (!in_array($cont->title, $contents)) {
                array_push($contents, $cont->title);
            }
        }

        return response()->json([
            'contents' => $contents,
        ]);
    }

    public function process(Request $request)
    {
        $key = $request->key;
        if ($request->method() == "GET") {
            // return view('index');
        }

        $slides = CmsContentSlide::whereNull('cover')->orderBy('created_at', 'DESC')->get();

        foreach ($slides as $slide) {
            $success = $this->dummyRequest($slide, $key);
            Log::info("[DONE]" .$slide->id);
        }

        return response()->json(['ok']);
    }
    private function dummyRequest($slide, $key)
    {
        try {
            $prompt = "Give me 1 to 2 MOST ACCURATE KEYWORD to search on pexels for this slides :\n" .
                    "```" . json_encode($slide) . "```\n" .
                    "I expect this EXACTLY JSON result :\n" .
                    '```{ "keyword": "YOUR_KEYWORD_HERE" }```\n' .
                    "IMPROTANT NOTES :\n" .
                    "- Give me only the json, just don't say anything\n" .
                    "- Don't screw up with the index order";

            $result = $this->gemini($prompt, $key);
            // result berbentuk array jika sukses
            $keyword = $result['keyword'];
            $img = $this->searchPexels($keyword);

            // --- NO RESULTS? Request a broader/generalized keyword ---
            if (empty($img['photos'])) {

                $generalPrompt = "The keyword '{$keyword}' is too specific and no images are found on Pexels.\n".
                    "Give me a more GENERAL keyword (but still relevant), 1-2 words max.\n".
                    "Return ONLY JSON exactly:\n".
                    '```{ \"keyword\": \"YOUR_GENERAL_KEYWORD\" }```';

                $generalResult = $this->gemini($generalPrompt,$key);

                if(!$generalResult) return false;

                $newKeyword = $generalResult['keyword'];
                $img = $this->searchPexels($newKeyword);

                if(empty($img['photos'])) return false; // even general failed
            }

            $photos = $img['photos'];
            $photo = $photos[0];
            CmsContentSlide::where('id',$slide->id)->update([
                'cover' => $photo['src']['large'],
            ]);

            // foreach ($photos as $pict) {
            //     ContentSlideImage::create([
            //         'slide_id' => $slide->id,
            //         'url' => $pict['src']['large'],
            //         'photographer' => $pict['photographer'],
            //         'photographer_url' => $pict['photographer_url'],
            //     ]);
            // }

            return true;

            return false;

        } catch (\Exception $e) {
            // Semua API key & model gagal → ulangi halaman ini
            return false;
        }
    }
    private function gemini($prompt, $key = null, $capability = 'text')
    {
        // MODEL LIST
        $MODELS = [];
        $payload = [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $prompt]
                    ]
                ]
            ]
        ];

        if ($capability === "text") {
            $MODELS = [
                'gemma-4-31b-it'
            ];
        }

        if ($capability === "image") {
            $MODELS = ['gemini-2.5-flash-image', 'gemini-2.0-flash-preview-image-generation'];
            $payload['generationConfig'] = [
                "responseModalities" => ["IMAGE", "TEXT"]
            ];
        }

        // Log::info("[GEMINI] All Models : ". json_encode($MODELS));

        if ($key == null) {
            $KEYS = config('services.gemini.keys'); 

            foreach ($KEYS as $keyIndex => $apiKey) {

                foreach ($MODELS as $modelIndex => $model) {

                    try {
                        $response = Http::withHeaders([
                            'Content-Type' => 'application/json',
                            'x-goog-api-key' => $apiKey,
                        ])->post(
                            "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent",
                            $payload
                        );

                        if (!$response->successful()) {
                            continue; // try next model
                        }

                        $rawText = data_get($response->json(), 'candidates.0.content.parts.0.text');

                        if (!$rawText) {
                            continue; // no text → next model
                        }

                        // CLEAN RAW TEXT LIKE JS VERSION
                        $clean = preg_replace('/```(json)?/i', '', $rawText);
                        $clean = preg_replace('/```/', '', $clean);

                        // Remove leading junk before JSON
                        $clean = preg_replace('/^[^{\[]+/', '', $clean);
                        // Remove trailing junk after JSON
                        $clean = preg_replace('/[^}\]]+$/', '', $clean);

                        $clean = trim($clean);
                        // Log::info("[GEMINI] clean response : ". $clean);

                        // PARSE JSON
                        try {
                            $realResponse = json_decode($clean, true);

                            if (json_last_error() !== JSON_ERROR_NONE) {
                                continue;
                            }

                            return $realResponse;

                        } catch (\Exception $e) {
                            continue;
                        }

                    } catch (\Exception $e) {
                        // Error → next model
                        continue;
                    }
                }

                // All models failed → next key
            }
        } else {
            foreach ($MODELS as $modelIndex => $model) {
                try {
                    Log::info("KEY : " . $key);
                    $response = Http::withHeaders([
                        'Content-Type' => 'application/json',
                        'x-goog-api-key' => $key,
                    ])->post(
                        "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent",
                        $payload
                    );

                    if (!$response->successful()) {
                        Log::info($response->body());
                        continue; // try next model
                    }

                    $rawText = data_get($response->json(), 'candidates.0.content.parts.0.text');

                    if (!$rawText) {
                        continue; // no text → next model
                    }

                    // CLEAN RAW TEXT LIKE JS VERSION
                    $clean = preg_replace('/```(json)?/i', '', $rawText);
                    $clean = preg_replace('/```/', '', $clean);

                    // Remove leading junk before JSON
                    $clean = preg_replace('/^[^{\[]+/', '', $clean);
                    // Remove trailing junk after JSON
                    $clean = preg_replace('/[^}\]]+$/', '', $clean);

                    $clean = trim($clean);

                    // PARSE JSON
                    try {
                        $realResponse = json_decode($clean, true);

                        if (json_last_error() !== JSON_ERROR_NONE) {
                            continue;
                        }

                        return $realResponse;

                    } catch (\Exception $e) {
                        continue;
                    }

                } catch (\Exception $e) {
                    // Error → next model
                    continue;
                }
            }
        }
        

        // Log::info("[GEMINI] All API keys and models failed.");
        throw new \Exception("All API keys and models failed.");
    }
    private function searchPexels($keyword)
    {
        return Http::withHeader('Authorization', config('services.pexels.key'))
            ->get("https://api.pexels.com/v1/search?query=".$keyword."&per_page=1")
            ->json();
    }
}
