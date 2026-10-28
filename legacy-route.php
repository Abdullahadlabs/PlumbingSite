<?php
/** Resolve historical location URLs to existing static pages, never the homepage. */
function hpu_slug($value) {
    if (!is_string($value) || strlen($value) > 500) return '';
    for ($i = 0; $i < 16; $i++) {
        $decoded = rawurldecode($value);
        if ($decoded === $value) break;
        $value = $decoded;
    }
    // Remaining percent escapes are malformed or exceed the bounded decoder.
    if (strpos($value, '%') !== false) return '';
    $value = strtolower(str_replace('+', ' ', $value));
    $value = preg_replace('/[^a-z0-9\s_-]/', '', $value);
    return trim(preg_replace('/[\s_-]+/', '-', $value), '-');
}

function hpu_existing_path($root, $candidate) {
    if (!preg_match('~^/[a-z0-9/_.-]+$~D', $candidate) || strpos($candidate, '..') !== false) return false;
    $file = rtrim($root, '/') . $candidate;
    return substr($candidate, -1) === '/' ? is_file($file . 'index.html') : is_file($file) || is_file($file . '.html');
}

function hpu_legacy_destination($uri, $query, $root) {
    $path = parse_url($uri, PHP_URL_PATH);
    if (!is_string($path)) return null;
    $states = ['ak' => 'alaska', 'alaska' => 'alaska', 'tx' => 'texas', 'texas' => 'texas',
        'fl' => 'florida', 'florida' => 'florida', 'co' => 'colorado', 'colorado' => 'colorado'];
    $locationRoute = preg_match('~^/(?:services(?:/[a-z0-9-]+)?|services\.html|service-detail(?:\.html)?|city-zip(?:\.html)?|state(?:\.html)?|legacy-route\.php)/?$~iD', $path);
    if ($locationRoute && (isset($query['city']) || isset($query['state']))) {
        $state = $states[hpu_slug($query['state'] ?? '')] ?? null;
        if ($state === null) return null;
        if (!isset($query['city']) && !isset($query['zip'])) {
            $candidate = $state === 'colorado' ? '/colorado/' : "/state/$state/";
        } else {
            $city = hpu_slug($query['city'] ?? '');
            $zip = $query['zip'] ?? '';
            if ($city === '' || !is_string($zip) || !preg_match('/^[0-9]{5}$/D', $zip)) return null;
            $candidate = "/$state/$city-$zip/";
            $service = '';
            if (preg_match('~^/services/([^/]+)/?$~iD', $path, $match)) $service = hpu_slug($match[1]);
            elseif (isset($query['service'])) {
                $service = hpu_slug($query['service']);
                if ($service === '') return null;
            }
            elseif (preg_match('~^/(?:service-detail(?:\.html)?|legacy-route\.php)/?$~iD', $path)) return null;
            $clusters = [
                'drain-cleaning' => ['clogged-drain-repair', 'hydro-jetting', 'drain-repair', 'rooter-services', 'drain-cleaning-service', 'hydro-jetting-service'],
                'burst-pipe-repair' => ['pipe-repair', 'pipe-leak-repair', 'whole-house-repiping', 'pipe-relining', 'pipe-replacement', 'pipe-insulation'],
                'water-heater-repair' => ['water-heater-installation', 'tankless-water-heater-installation', 'tankless-water-heater-repair'],
                'sewer-line-repair' => ['sewer-line-replacement', 'drain-line-replacement', 'septic-tank-repair', 'septic-system-installation'],
                'emergency-plumbing' => ['24-hour-emergency-plumbing', 'same-day-plumbing-repair'],
                'leak-detection' => ['slab-leak-repair', 'plumbing-leak-detection', 'leak-detection-service'],
                'gas-line-repair' => ['gas-line-installation', 'gas-leak-detection'],
                'water-line-repair' => ['water-line-installation', 'water-line-trenching']
            ];
            foreach ($clusters as $canonical => $aliases) {
                if (in_array($service, $aliases, true)) { $service = $canonical; break; }
            }
            if (strpos($service, 'toilet-repair') === 0) $service = 'emergency-plumbing';
            if ($service !== '') $candidate .= "$service/";
        }
    } elseif (preg_match('/[A-Z]/', $path)) {
        // LiteSpeed's expression backreferences previously redirected these to /.
        $candidate = strtolower($path);
        if (preg_match('~^/(alaska|texas|florida)/?$~D', $candidate, $match)) $candidate = '/state/' . $match[1] . '/';
        elseif (is_file(rtrim($root, '/') . rtrim($candidate, '/') . '/index.html')) $candidate = rtrim($candidate, '/') . '/';
    } else return null;
    if (!hpu_existing_path($root, $candidate)) return null;
    // Keep attribution, but remove obsolete location parameters and arbitrary input.
    $tracking = [];
    foreach ($query as $key => $value) {
        if (is_string($value) && strlen($value) <= 500 && preg_match('/^(utm_[a-z0-9_]+|gclid|gbraid|wbraid|msclkid)$/D', $key)) $tracking[$key] = $value;
    }
    return $candidate . ($tracking ? '?' . http_build_query($tracking, '', '&', PHP_QUERY_RFC3986) : '');
}

if (!defined('HPU_ROUTING_TEST')) {
    $destination = hpu_legacy_destination($_SERVER['REQUEST_URI'] ?? '', $_GET, __DIR__);
    header('Cache-Control: no-cache');
    if ($destination !== null) {
        header('Location: https://homeplumbingusa.com' . $destination, true, 301);
    } else {
        http_response_code(404);
        header('Content-Type: text/plain; charset=UTF-8');
        echo "Page not found.\n";
    }
    exit;
}
