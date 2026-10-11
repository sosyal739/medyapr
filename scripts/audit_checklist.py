# -*- coding: utf-8 -*-
import urllib.request
import re
import os
import json

print("=== 1. Checking www to non-www redirect & metadataBase ===")
try:
    req = urllib.request.Request("https://www.medyapr.com/", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("www requested -> Final URL:", resp.geturl(), "Status:", resp.status)
except Exception as e:
    print("Redirect check error:", e)

with open("src/app/[locale]/layout.tsx", "r", encoding="utf-8") as f:
    layout_content = f.read()
    has_mb = "metadataBase: new URL('https://medyapr.com')" in layout_content
    print("layout.tsx has metadataBase:", has_mb)

print("\n=== 2. Checking Canonicals & Hreflang on Live Site ===")
for path in ["/tr/blog", "/tr/trendler", "/tr/sanatcilar", "/en/blog", "/en/trendler"]:
    try:
        req = urllib.request.Request(f"https://medyapr.com{path}", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            canonicals = re.findall(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', html)
            hreflangs = re.findall(r'<link[^>]*hreflang=["\']([^"\']+)["\'][^>]*href=["\']([^"\']+)["\']', html)
            print(path, "-> Canonical:", canonicals, "Hreflangs:", hreflangs)
    except Exception as e:
        print(path, "Error:", e)

print("\n=== 3. Checking Middleware default language ===")
with open("src/middleware.ts", "r", encoding="utf-8") as f:
    mw_content = f.read()
    print("middleware has targetLocale = defaultLocale (tr):", "let targetLocale: Locale = defaultLocale; // 'tr'" in mw_content or "defaultLocale" in mw_content)

print("\n=== 4. Checking /en pages ===")
for path in ["/en", "/en/hizmetler", "/en/fiyatlandirma", "/en/sss"]:
    try:
        req = urllib.request.Request(f"https://medyapr.com{path}", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            # check sample words
            print(path, "-> Status:", resp.status, "Title:", re.findall(r'<title>(.*?)</title>', html))
    except Exception as e:
        print(path, "Error:", e)

print("\n=== 5. Checking logo.png, og-image.jpg, and WhatsApp number ===")
for asset in ["/logo.png", "/og-image.jpg"]:
    try:
        req = urllib.request.Request(f"https://medyapr.com{asset}", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(asset, "Status:", resp.status, "Content-Type:", resp.headers.get("Content-Type"), "Bytes:", len(resp.read()))
    except Exception as e:
        print(asset, "Error:", e)

# check whatsapp number in contact / layout / components
wa_matches = []
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith((".tsx", ".ts")):
            p = os.path.join(root, f)
            with open(p, "r", encoding="utf-8", errors="ignore") as fl:
                c = fl.read()
                if "531" in c or "905312993355" in c:
                    wa_matches.append(p)
print("Files with WhatsApp 0531 299 33 55:", len(wa_matches), wa_matches[:3])

print("\n=== 6. Checking Blog dates & Sitemap lastModified ===")
try:
    req = urllib.request.Request("https://medyapr.com/sitemap.xml", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        sm_xml = resp.read().decode("utf-8", errors="ignore")
        lastmods = re.findall(r'<lastmod>([^<]+)</lastmod>', sm_xml)
        print("Sitemap total URLs:", len(lastmods), "Sample lastmod values:", lastmods[:3])
except Exception as e:
    print("Sitemap check error:", e)

print("\n=== 7. Checking Orders storage (data/orders.json vs KV) ===")
with open("src/lib/store.ts", "r", encoding="utf-8") as f:
    store_content = f.read()
    print("store.ts has memory / KV fallback:", "inMemoryOrders" in store_content or "KV" in store_content or "process.cwd" in store_content)

print("\n=== 8. Checking mp3 & performance assets in public ===")
public_files = os.listdir("public")
print("Public directory files:", public_files)
mp3s = [f for f in public_files if f.endswith(".mp3")]
print("mp3 files in public:", mp3s)
