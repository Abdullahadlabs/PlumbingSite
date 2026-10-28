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
cases += [(p, 404, None) for p in [
    '/service-areas/tx-nonexistent-00000/drain-cleaning/',
    '/service-areas/tx-austin-78735/nonexistent-service/',
    '/privacy-policy/not-a-page', '/definitely-not-a-page/',
]]
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
