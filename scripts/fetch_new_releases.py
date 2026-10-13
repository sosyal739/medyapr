"""
MedyaPR — Yeni Çıkan Klipler Radar Yöneticisi & YouTube Çekici
netd müzik, DMC, Sony Music TR ve Bağımsız kanalların yeni kliplerini listeler,
data/releases.json dosyasına ekler ve sosyal medya paylaşım taslaklarını üretir.
"""

import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CHANNELS = {
    "netd": {
        "name": "netd müzik",
        "channel_id": "UCuM_jFz_m8n4j-VnO0pC5EQ",
        "type": "netd"
    },
    "dmc": {
        "name": "DMC",
        "channel_id": "UC5pP3B8j2w6bYQ2u_0E4Xrw",
        "type": "dmc"
    },
    "sony": {
        "name": "Sony Music Türkiye",
        "channel_id": "UC1vO_GvMvL5k0L-7r1h0fPA",
        "type": "sony"
    }
}

RELEASES_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'releases.json')

def slugify(text: str) -> str:
    """Türkçe karakterleri dönüştürerek URL dostu slug üretir."""
    tr_map = {
        'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
    }
    for k, v in tr_map.items():
        text = text.replace(k, v)
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    return text.strip('-')

def load_releases():
    if not os.path.exists(RELEASES_FILE):
        return []
    with open(RELEASES_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_releases(releases):
    with open(RELEASES_FILE, 'w', encoding='utf-8') as f:
        json.dump(releases, f, ensure_ascii=False, indent=2)

def extract_video_id(url: str) -> str:
    match = re.search(r'(?:v=|\/|youtu\.be\/)([0-9A-Za-z_-]{11})', url)
    return match.group(1) if match else url

def fetch_rss_feed(channel_id: str):
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read()
            root = ET.fromstring(content)
            ns = {
                'atom': 'http://www.w3.org/2005/Atom',
                'yt': 'http://www.youtube.com/xml/schemas/2015',
                'media': 'http://search.yahoo.com/mrss/'
            }
            entries = []
            for entry in root.findall('atom:entry', ns):
                video_id = entry.find('yt:videoId', ns).text
                title = entry.find('atom:title', ns).text
                published = entry.find('atom:published', ns).text
                entries.append({
                    'video_id': video_id,
                    'title': title,
                    'published': published[:10]
                })
            return entries
    except Exception as e:
        print(f"[!] RSS çekilemedi: {e}")
        return []

def add_release(
    artist: str,
    title: str,
    channel: str,
    channel_type: str,
    video_id: str,
    genre: str,
    genre_slug: str,
    director: str = "Bilinmiyor",
    producer: str = "Bilinmiyor",
    instagram_handle: str = "",
    twitter_handle: str = "",
    summary: str = "",
    review: str = "",
    target_audience: str = "18-35 Yaş Müzikseverler, Türkiye & Avrupa Genç Kitle"
):
    releases = load_releases()
    video_id = extract_video_id(video_id)
    
    # Check duplicate
    for r in releases:
        if r.get('videoId') == video_id:
            print(f"[!] Bu video zaten ekli: {r['artist']} - {r['title']} (Slug: {r['slug']})")
            return False

    slug = slugify(f"{artist} {title}")
    # Ensure unique slug
    base_slug = slug
    counter = 1
    existing_slugs = {r['slug'] for r in releases}
    while slug in existing_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1

    if not summary:
        summary = f"{artist} tarafından {channel} etiketiyle yayınlanan '{title}' klibi, yenilikçi sound'u ve dinamik görsel kurgusuyla dikkat çekiyor."
    
    if not review:
        review = (
            f"{artist}, yeni teklisi '{title}' ile müzikseverlerin karşısına çıkıyor. "
            f"Klipte kullanılan sinematik planlar ve görsel renk uyumu şarkının atmosferini güçlendirirken, "
            f"akılda kalıcı nakarat YouTube algoritmalarında hızla üst sıralara tırmanmasını sağlıyor. "
            f"Özellikle ilk 30 saniyelik kanca (hook) sekansı kitle tutma oranını yüksek tutuyor."
        )

    new_item = {
        "slug": slug,
        "title": title,
        "artist": artist,
        "channel": channel,
        "channelType": channel_type,
        "videoId": video_id,
        "thumbnail": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
        "releaseDate": datetime.now().strftime("%Y-%m-%d"),
        "genre": genre,
        "genreSlug": genre_slug,
        "director": director,
        "producer": producer,
        "instagramHandle": instagram_handle if instagram_handle.startswith("@") else f"@{instagram_handle}" if instagram_handle else "",
        "twitterHandle": twitter_handle if twitter_handle.startswith("@") else f"@{twitter_handle}" if twitter_handle else "",
        "views": "Yeni Yayında",
        "likes": "Yeni Yayında",
        "summary": summary,
        "review": review,
        "targetAudience": target_audience,
        "tags": [artist, title, channel, "Yeni Klip", "Türkçe Müzik", genre]
    }

    releases.insert(0, new_item)
    save_releases(releases)
    print(f"[✓] Başarıyla eklendi: {artist} - {title}")
    print(f"    Canlı URL: https://medyapr.com/tr/klip/{slug}")
    print(f"    Paylaşım X: https://x.com/intent/tweet?text={artist}%20-%20{title}%20yeni%20klibi%20yayında!%20İnceleme:%20https://medyapr.com/tr/klip/{slug}")
    return True

if __name__ == '__main__':
    releases = load_releases()
    print(f"[*] MedyaPR Klip Radarı — Kayıtlı Toplam Klip: {len(releases)}")
    for i, r in enumerate(releases, 1):
        print(f"  {i}. [{r['channelType'].upper()}] {r['artist']} - {r['title']} (/tr/klip/{r['slug']})")
