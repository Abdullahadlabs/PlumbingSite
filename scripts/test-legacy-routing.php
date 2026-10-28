<?php
// Use a fixture containing the committed static HTML paths (not a live site).
define('HPU_ROUTING_TEST', true);
require __DIR__ . '/../legacy-route.php';
$root = $argv[1] ?? dirname(__DIR__);
$cases = [
 ['/services/water-heater-installation', 'city=Miami%20Gardens&state=FL&zip=33056', '/florida/miami-gardens-33056/water-heater-repair/'],
 ['/services/water-line-installation', 'city=Chignik+Lake&state=AK&zip=99548', '/alaska/chignik-lake-99548/water-line-repair/'],
 ['/services/water-line-repair', 'city=Chignik%25252520Lake&state=AK&zip=99548', '/alaska/chignik-lake-99548/water-line-repair/'],
 ['/service-detail.html', 'city=Austin&state=TX&zip=78735&service=drain-cleaning', '/texas/austin-78735/drain-cleaning/'],
 ['/service-detail', 'city=Austin&state=TX&zip=78735&service=hydro-jetting&utm_source=google&gclid=abc', '/texas/austin-78735/drain-cleaning/?utm_source=google&gclid=abc'],
 ['/city-zip.html', 'city=Miami+Gardens&state=FL&zip=33056', '/florida/miami-gardens-33056/'],
 ['/services.html', 'state=TX', '/state/texas/'],
 ['/state.html', 'state=CO', '/colorado/'],
 ['/Florida/Miami-Gardens-33056/Water-Heater-Repair/', '', '/florida/miami-gardens-33056/water-heater-repair/'],
 ['/TEXAS', '', '/state/texas/'],
 ['/legacy-route.php', 'city=Austin&state=TX&zip=78735&service=drain-cleaning', '/texas/austin-78735/drain-cleaning/'],
 ['/services/water-line-repair', 'city=Not-A-City&state=AK&zip=00000', null],
 ['/services/nonexistent-service', 'city=Austin&state=TX&zip=78735', null],
 ['/service-detail.html', 'city=Austin&state=TX&zip=78735&service[]=drain-cleaning', null],
 ['/services/drain-cleaning', 'city[]=Austin&state=TX&zip=78735', null],
 ['/services/drain-cleaning', 'city=Austin&state=TX&zip=78735/../../etc', null],
 ['/services/drain-cleaning', 'city=Austin&state=XX&zip=78735', null],
 ['/services/drain-cleaning', 'state=TX&city=Austin', null],
 ['/services/drain-cleaning', 'city=Austin%0D%0ALocation%3Ahttps%3A%2F%2Fevil.test&state=TX&zip=78735', null],
 ['/Unrecognised/', '', null],
 ['/services/drain-cleaning', 'city=Austin&state=TX&zip=78735&redirect=https://evil.test', '/texas/austin-78735/drain-cleaning/'],
];
$failed = 0;
foreach ($cases as [$uri, $raw, $expected]) {
 parse_str($raw, $query);
 $actual = hpu_legacy_destination($uri, $query, $root);
 if ($actual !== $expected) { $failed++; echo "FAIL $uri $raw: " . var_export($actual, true) . "\n"; }
}
echo (count($cases) - $failed) . '/' . count($cases) . " legacy routing cases passed\n";
exit($failed ? 1 : 0);
