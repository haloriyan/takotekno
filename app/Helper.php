<?php

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

function me($guard = 'admin') {
    $user = Auth::guard($guard)->user();
	return $user;
}
function wasap() {
	// 
}
function nullify($value) {
	return $value === "null" ? null : $value;
}
function Substring($text, $count) {
    $toReturn = substr($text, 0, $count);
    $rest = explode($toReturn, $text);
    if ($rest[1] != "") {
        $toReturn .= "...";
    }
    return $toReturn;
}

function RandomInt($length = 4) {
    $pattern = [0,1,2,3,4,5,6,7,8,9];
    $code = "";

    for ($i = 0; $i < $length; $i++) {
        $code .= $pattern[rand(0, count($pattern) - 1)];
    }

    return $code;
}

function like($needle, $haystack, $reversed = false) {
    if ($reversed) {
        $cond = strpos($needle, $haystack);
    } else {
        $cond = strpos($haystack, $needle);
    }
    return $cond === false ? false : true;
}

function changeConfig($name, $key, $value) {
    $filePath = config_path("$name.php");
    $config = include $filePath;
    $config[$key] = $value;
    $content = "<?php\n\nreturn " . var_export($config, true) . ";\n";

    File::put($filePath, $content);
    return "ok";
}
function changeEnv($key, $newValue) {
    $path = base_path('.env');
    if (!file_exists($path)) return;

    $content = file_get_contents($path);
    $pattern = "/^{$key}=.*$/m";

    if (preg_match('/\s/', $newValue)) {
        $newValue = '"' . $newValue . '"';
    }

    if (preg_match($pattern, $content)) {
        $content = preg_replace($pattern, "{$key}={$newValue}", $content);
    } else {
        // If key doesn't exist, append
        $content .= PHP_EOL."{$key}={$newValue}";
    }

    file_put_contents($path, $content);
}
function initial($name) {
    $names = explode(" ", $name);
    $toReturn = $names[0][0];
    if (count($names) > 1) {
        $toReturn .= $names[count($names) - 1][0];
    }

    return strtoupper($toReturn);
}

function currency_encode($amount, $currencyPrefix = 'Rp', $thousandSeparator = '.', $decimalSeparator = ',', $zeroLabel = null) {
	$zeroDecimalCurrencies = [
		'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 
		'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 
		'xaf', 'xof', 'xpf', 'idr'
	];

	$currency = strtolower(config('app.currency', 'idr'));
	$isZeroDecimal = in_array($currency, $zeroDecimalCurrencies);

	if ($currencyPrefix === null) {
		$currencyPrefix = config('app.currency_symbol');
	}

	if (!$amount && $zeroLabel != null) {
		return $zeroLabel;
	}

	// Convert from Stripe's unit_amount to display amount
	$displayAmount = $isZeroDecimal ? $amount : $amount / 100;

	// Format number
	$formatted = number_format(
		$displayAmount,
		$isZeroDecimal ? 0 : 2,
		$decimalSeparator,
		$thousandSeparator
	);

	return $currencyPrefix . ' ' . $formatted;
}

function currency_decode($formattedAmount) {
	// Remove all non-numeric except decimal point
	$cleaned = preg_replace('/[^0-9.]/', '', $formattedAmount);

	$currency = strtolower(config('app.currency'));
	$zeroDecimalCurrencies = [
		'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 
		'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 
		'xaf', 'xof', 'xpf', 'idr'
	];
	$isZeroDecimal = in_array($currency, $zeroDecimalCurrencies);

	// Convert back to unit_amount
	return $isZeroDecimal ? (int)$cleaned : (int)round($cleaned * 100);
}


function html_attr($html, ...$attributes) {
    $results = count($attributes) > 1 ? [] : null;

    foreach ($attributes as $attr) {
 	   if (preg_match('/\b' . preg_quote($attr, '/') . '="([^"]*)"/', $html, $matches)) {
 		   if (count($attributes) > 1) {
 			   $results[$attr] = $matches[1];
 		   } else {
 			   $results = $matches[1];
 		   }
 	   } else {
 		   if (count($attributes) > 1) {
 			   $results[$attr] = null;
 		   }
 	   }
    }

    return $results;
}

function getGoogleMapsLinkFromIframe(string $iframeHtml): ?string
{
	$dom = new DOMDocument();
	libxml_use_internal_errors(true);
	$dom->loadHTML($iframeHtml);
	libxml_clear_errors();

	$iframe = $dom->getElementsByTagName('iframe')->item(0);
	if (!$iframe) {
		return null;
	}

	$src = $iframe->getAttribute('src');

	// Match the place ID (cid format)
	if (preg_match('/!1s([^!]+)/', $src, $match)) {
		$placeId = $match[1];
		return "https://www.google.com/maps?cid={$placeId}";
	}

	return null;
}

function escapeWhatsappNumber(string $number, string $countryCode = '62'): string {
	// Remove spaces, dashes, parentheses, etc.
	$number = preg_replace('/[^\d+]/', '', $number);

	if (str_starts_with($number, '+')) {
		// Remove leading '+' if present
		$number = ltrim($number, '+');
	} elseif (str_starts_with($number, '0')) {
		// Replace leading '0' with country code
		$number = $countryCode . substr($number, 1);
	}

	// If it already starts with country code, leave it
	return $number;
}

function RandomColor($prefix = 'text', $suffix = '600') {
	$colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate'];
	$i = rand(0, count($colors) - 1);
	return $prefix."-".$colors[$i]."-".$suffix;
}

function isEmail($email)
{
	$pattern = '/^[\w\.\-]+@([\w\-]+\.)+[a-zA-Z]{2,}$/';
	return preg_match($pattern, $email) === 1;
}
function sendGmail($user, $props) {
	$clientId = config('services.google.client_id');
	$clientSecret = config('services.google.client_secret');
	$refreshToken = $user->google_refresh_token;

	// Step 1: Get new access token
	$tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
		'client_id' => $clientId,
		'client_secret' => $clientSecret,
		'refresh_token' => $refreshToken,
		'grant_type' => 'refresh_token',
	]);

	if (!$tokenResponse->successful()) {
		return 'Failed to refresh token: ' . $tokenResponse->body();
	}

	$newAccessToken = $tokenResponse['access_token'];
	$user->google_access_token = $newAccessToken;
	$user->save();

	// Step 2: Build MIME email
	$boundary = uniqid();

	$senderName = $user->name;
	$senderEmail = $user->email;

	$mimeMessage = "From: \"$senderName\" <$senderEmail>\r\n";
	$mimeMessage .= "To: {$props['to']}\r\n";
	$mimeMessage .= "Subject: {$props['subject']}\r\n";
	$mimeMessage .= "MIME-Version: 1.0\r\n";
	$mimeMessage .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n\r\n";

	// Email body part
	$mimeMessage .= "--$boundary\r\n";
	$mimeMessage .= "Content-Type: text/html; charset=utf-8\r\n";
	$mimeMessage .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
	$mimeMessage .= $props['body'] . "\r\n\r\n";

	// Optional attachment from image URI
	if (!empty($props['image'])) {
        $imagePath = $props['image']; // e.g. 'uploads/example.jpg'
    
        if (file_exists($imagePath)) {
            $imageContent = file_get_contents($imagePath);
            $imageMime = mime_content_type($imagePath);
            $imageName = basename($imagePath);
            $encodedImage = chunk_split(base64_encode($imageContent));
    
            $mimeMessage .= "--$boundary\r\n";
            $mimeMessage .= "Content-Type: $imageMime; name=\"$imageName\"\r\n";
            $mimeMessage .= "Content-Disposition: attachment; filename=\"$imageName\"\r\n";
            $mimeMessage .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $mimeMessage .= $encodedImage . "\r\n\r\n";
        }
    }

	$mimeMessage .= "--$boundary--";

	$raw = rtrim(strtr(base64_encode($mimeMessage), '+/', '-_'), '=');

	// Step 3: Send email
	$response = Http::withToken($newAccessToken)
		->post('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', [
			'raw' => $raw,
		]);

	if ($response->successful()) {
		return 'Email sent!';
	}

	return 'Failed to send email: ' . $response->body();
}

function compressImage($sourcePath, $quality = 75) {
	$info = getimagesize($sourcePath);

	if (!$info) {
		throw new Exception("Invalid image file.");
	}

	switch ($info['mime']) {
		case 'image/jpeg':
			$image = imagecreatefromjpeg($sourcePath);
			// JPEG quality is directly supported (0 = worst, 100 = best)
			imagejpeg($image, $sourcePath, $quality);
			break;

		case 'image/png':
			$image = imagecreatefrompng($sourcePath);
			// Convert JPEG-like quality (0–100) to PNG compression level (0–9, where 0 is no compression)
			$compressionLevel = (int)((100 - $quality) / 10);
			$compressionLevel = max(0, min(9, $compressionLevel)); // Clamp to 0–9
			imagepng($image, $sourcePath, $compressionLevel);
			break;

		case 'image/webp':
			if (!function_exists('imagecreatefromwebp')) {
				throw new Exception("WebP not supported on this server.");
			}
			$image = imagecreatefromwebp($sourcePath);
			// WebP quality is similar to JPEG
			imagewebp($image, $sourcePath, $quality);
			break;

		default:
			throw new Exception("Unsupported image type: " . $info['mime']);
	}

	imagedestroy($image);
	return true;
}
