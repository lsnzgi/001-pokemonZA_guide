import json
import urllib.request
import time
import os

def fetch_names():
    print("Loading pokemon.json...")
    try:
        with open('pokemon.json', 'r', encoding='utf-8') as f:
            pokemon_list = json.load(f)
    except FileNotFoundError:
        print("pokemon.json not found!")
        return

    total = len(pokemon_list)
    print(f"Found {total} pokemon. Starting update...")

    updated_count = 0
    
    for i, p in enumerate(pokemon_list):
        if 'name_en' in p and 'name_jp' in p:
            continue

        national_id = p.get('national_id')
        if not national_id:
            continue

        url = f"https://pokeapi.co/api/v2/pokemon-species/{national_id}/"
        
        try:
            print(f"[{i+1}/{total}] Fetching {p['name']}...")
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                
                name_en = ""
                name_jp = ""
                
                for entry in data.get('names', []):
                    lang = entry['language']['name']
                    if lang == 'en':
                        name_en = entry['name']
                    elif lang == 'ja' or lang == 'ja-Hrkt':
                        if not name_jp:
                             name_jp = entry['name']
                
                if name_en: p['name_en'] = name_en
                if name_jp: p['name_jp'] = name_jp
                
                updated_count += 1
                
            time.sleep(0.1)
            
        except Exception as e:
            print(f"Error fetching {p['name']}: {e}")

    print(f"Finished. Updated {updated_count} pokemon.")
    
    with open('pokemon.json', 'w', encoding='utf-8') as f:
        json.dump(pokemon_list, f, ensure_ascii=False, indent=2)
    print("Saved to pokemon.json")

if __name__ == "__main__":
    fetch_names()
