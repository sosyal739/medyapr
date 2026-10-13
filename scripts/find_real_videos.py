import urllib.request
import urllib.parse
import re
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

def find_youtube_id(query):
    try:
        encoded = urllib.parse.quote(query)
        url = f'https://www.youtube.com/results?search_query={encoded}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=10) as res:
            html = res.read().decode('utf-8')
            matches = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
            for m in matches:
                t_url = f'https://i.ytimg.com/vi/{m}/hqdefault.jpg'
                try:
                    treq = urllib.request.Request(t_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(treq, timeout=5) as tres:
                        if tres.status == 200:
                            return m
                except:
                    continue
    except Exception as e:
        print(f"Error for {query}: {e}")
    return None

queries = [
    'Kardelen Emanet',
    'Kardelen Cekirdek',
    'Kano trap turkce',
    'Emre Fel Veda Turkusu',
    'Semicenk Canin Sag Olsun'
]

for q in queries:
    vid = find_youtube_id(q)
    print(f"{q} => {vid}")
