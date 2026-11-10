#!/usr/bin/env python3
"""HTTP regression tests. Run against a server serving this repository.
Example: python scripts/test-routing.py http://127.0.0.1:8087
Does not follow redirects, so a broken/extra redirect cannot pass unnoticed.
"""
import sys
import urllib.request
import urllib.error
from urllib.parse import urlsplit

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

opener = urllib.request.build_opener(NoRedirect)
base = sys.argv[1].rstrip('/')
cases = [(p, 200, None) for p in [
    '/', '/about', '/privacy-policy', '/privacy-policy/',
    '/terms-and-conditions', '/terms-and-conditions/',
    '/texas/austin-78735/drain-cleaning/', '/state/texas/',
]]
for old, new in [
    ('tx-austin-78735/drain-cleaning', 'texas/austin-78735/drain-cleaning'),
    ('fl-tampa-33609/emergency-plumbing', 'florida/tampa-33609/emergency-plumbing'),
    ('tx-celina-75009/water-heater-repair', 'texas/celina-75009/water-heater-repair'),
]:
    for suffix in ['', '/', '/?utm_source=regression']:
        query = '?utm_source=regression' if '?' in suffix else ''
        cases.append(('/service-areas/' + old + suffix, 301, '/' + new + '/' + query))
cases += [(f'/{state}{slash}', 301, f'/state/{state}/')
          for state in ['alaska', 'texas', 'florida'] for slash in ['', '/']]
cases += [('/colorado/', 200, None)]
cases += [(p, 404, None) for p in [
    '/service-areas/tx-nonexistent-00000/drain-cleaning/',
    '/service-areas/tx-austin-78735/nonexistent-service/',
    '/privacy-policy/not-a-page', '/definitely-not-a-page/',
]]
cases += [
    ('/services/water-heater-installation?city=Miami%20Gardens&state=FL&zip=33056', 301, '/florida/miami-gardens-33056/water-heater-repair/'),
    ('/services/water-line-installation?city=Chignik+Lake&state=AK&zip=99548', 301, '/alaska/chignik-lake-99548/water-line-repair/'),
    ('/services/water-line-repair?city=Chignik%25252520Lake&state=AK&zip=99548', 301, '/alaska/chignik-lake-99548/water-line-repair/'),
    ('/service-detail.html?city=Austin&state=TX&zip=78735&service=drain-cleaning&gclid=test', 301, '/texas/austin-78735/drain-cleaning/?gclid=test'),
    ('/city-zip.html?city=Austin&state=TX&zip=78735', 301, '/texas/austin-78735/'),
    ('/services.html?state=TX', 301, '/state/texas/'),
    ('/Florida/Miami-Gardens-33056/Water-Heater-Repair/', 301, '/florida/miami-gardens-33056/water-heater-repair/'),
    ('/services/drain-cleaning?city=Not-A-City&state=TX&zip=00000', 404, None),
    ('/services/nonexistent-service?city=Austin&state=TX&zip=78735', 404, None),
    ('/service-detail.html?city=Austin&state=TX&zip=78735&service[]=drain-cleaning', 404, None),
]
cases += [
    ('/service-areas/tx-elpaso-79907/water-line-repair/', 301, '/texas/el-paso-79907/water-line-repair/'),
    ('/service-areas/tx-springbranch-78070/gas-line-repair/', 301, '/texas/spring-branch-78070/gas-line-repair/'),
    ('/service-areas/tx-sanantonio-78248/burst-pipe-repair/', 301, '/texas/san-antonio-78248/burst-pipe-repair/'),
    ('/service-areas/tx-sanantonio-78211/', 301, '/texas/san-antonio-78211/'),
    ('/service-areas/tx-sanantonio-78233/', 301, '/texas/san-antonio-78233/'),
    ('/service-areas/ak-holycross-99602/emergency-plumbing/', 301, '/alaska/holy-cross-99602/emergency-plumbing/'),
    ('/texas/sanantonio-78211/', 301, '/texas/san-antonio-78211/'),
    ('/service-areas/tx-sanantonio-00000/drain-cleaning/', 404, None),
]
failed = []
for path, expected, location in cases:
    try:
        response = opener.open(base + path, timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    actual = response.code
    target = urlsplit(response.headers.get('Location', ''))
    target = target.path + ('?' + target.query if target.query else '')
    if actual != expected or (location is not None and target != location):
        failed.append((path, expected, actual, location, target))
    response.close()
for failure in failed:
    print('FAIL', failure)
print(f'{len(cases) - len(failed)}/{len(cases)} routing checks passed')
sys.exit(bool(failed))
