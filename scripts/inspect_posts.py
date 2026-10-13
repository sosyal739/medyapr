import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

slugs = [
    'youtube-izlenme-nasil-sayilir-24-agustos-2026-yeni-kural',
    'youtube-reklamindan-gelen-izlenme-sayiya-dahil-mi-studio',
    'youtube-premiere-nasil-yapilir-muzik-klibi-lansman-adimlari',
    'cover-sarki-youtube-telif-content-id-rehberi',
    'youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen'
]

for s in slugs:
    p = next((x for x in posts if x['slug'] == s), None)
    if not p:
        continue
    print(f"=== SLUG: {s} ===")
    print("Title:", p.get('title'))
    print("Summary:", p.get('summary'))
    print("Category:", p.get('category'))
    print("Has quickFact:", bool(p.get('quickFact')))
    print("Has table:", bool(p.get('table')))
    print("Has faqs:", len(p.get('faqs', [])))
    print("Paragraphs count:", len(p.get('paragraphs', [])))
    print("Tags:", p.get('tags', []))
    print()
