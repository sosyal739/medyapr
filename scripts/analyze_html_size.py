import urllib.request
import re

import os
import re

local_path = ".next/server/app/tr.html"
if os.path.exists(local_path):
    with open(local_path, "r", encoding="utf-8") as f:
        data = f.read()
    print(f"Reading from local file: {local_path}")
else:
    url = "https://medyapr.com/tr"
    data = urllib.request.urlopen(url).read().decode('utf-8')
    print(f"Reading from URL: {url}")
print(f"Total HTML: {len(data):,} bytes ({len(data)/1024:.2f} KB)")

# Find all section tags
sections = re.findall(r'(<section[^>]*id="([^"]+)"[^>]*>.*?</section>)', data, re.DOTALL)
for sec_html, sec_id in sections:
    svg_count = len(re.findall(r'<svg', sec_html))
    print(f"  Section '{sec_id}': {len(sec_html):,} bytes ({len(sec_html)/1024:.1f} KB), SVGs: {svg_count}")

# Check Next.js script payload (__NEXT_DATA__ or RSC payloads)
scripts = re.findall(r'<script[^>]*>(.*?)</script>', data, re.DOTALL)
print(f"Total <script> tags: {len(scripts)}")
for i, s in enumerate(scripts):
    if len(s) > 1000:
        print(f"  Large Script #{i}: {len(s):,} bytes ({len(s)/1024:.1f} KB) - starts with: {s[:60]!r}")

# Check SVGs
svgs = re.findall(r'<svg[^>]*>.*?</svg>', data, re.DOTALL)
print(f"Total SVGs: {len(svgs)}, total SVG size: {sum(len(s) for s in svgs):,} bytes ({sum(len(s) for s in svgs)/1024:.1f} KB)")

