import json
import os

# Alpha Data (Embedded from alpha_locations.js)
alpha_data = {
    "Pikachu": {
        "region": "Lumiose City",
        "location": "Wild Zone 6",
        "level": 35,
        "condition": "Night"
    },
    "Raichu": {
        "region": "Lumiose City",
        "location": "Wild Zone 20",
        "level": 52,
        "condition": "Chance Spawn"
    },
    "Clefable": {
        "region": "Lumiose City",
        "location": "Wild Zone 19",
        "level": 55,
        "condition": "Night"
    },
    "Salamence": {
        "region": "Lumiose City",
        "location": "Wild Zone 18",
        "level": 60
    },
    "Gourgeist": {
        "region": "Lumiose City",
        "location": "Wild Zone 15",
        "level": 45
    },
    "Abomasnow": {
        "region": "Lumiose City",
        "location": "Wild Zone 12",
        "level": 50
    },
    "Garchomp": {
        "region": "Lumiose City",
        "location": "Wild Zone 18",
        "level": 65
    },
    "Snorlax": {
        "region": "Lumiose City",
        "location": "Wild Zone 8",
        "level": 45
    },
    "Gyarados": {
        "region": "Lumiose City",
        "location": "Seine River (Zone 4)",
        "level": 40
    },
    "Sylveon": {
        "region": "Lumiose City",
        "location": "Wild Zone 10",
        "level": 42,
        "condition": "Day"
    },
    "Aegislash": {
        "region": "Lumiose City",
        "location": "Wild Zone 16",
        "level": 55
    },
    "Goodra": {
        "region": "Lumiose City",
        "location": "Wild Zone 14",
        "level": 58,
        "condition": "Rain"
    },
    "Lucario": {
        "region": "Lumiose City",
        "location": "Wild Zone 11",
        "level": 50
    },
    "Charizard": {
        "region": "Lumiose City",
        "location": "Wild Zone 17",
        "level": 60
    },
    "Greninja": {
        "region": "Lumiose City",
        "location": "Wild Zone 13",
        "level": 58
    },
    "Gardevoir": {
        "region": "Lumiose City",
        "location": "Wild Zone 9",
        "level": 48
    },
    "Gengar": {
        "region": "Lumiose City",
        "location": "Wild Zone 7",
        "level": 45,
        "condition": "Night"
    },
    "Dragonite": {
        "region": "Lumiose City",
        "location": "Wild Zone 18",
        "level": 62
    },
    "Metagross": {
        "region": "Lumiose City",
        "location": "Wild Zone 16",
        "level": 58
    },
    "Tyranitar": {
        "region": "Lumiose City",
        "location": "Wild Zone 17",
        "level": 60
    }
}

type_map = {
    "一般": "Normal",
    "火": "Fire",
    "水": "Water",
    "草": "Grass",
    "电": "Electric",
    "冰": "Ice",
    "格斗": "Fighting",
    "毒": "Poison",
    "地面": "Ground",
    "飞行": "Flying",
    "超能力": "Psychic",
    "虫": "Bug",
    "岩石": "Rock",
    "幽灵": "Ghost",
    "龙": "Dragon",
    "恶": "Dark",
    "钢": "Steel",
    "妖精": "Fairy"
}

REGION_TRANS = {
    "Lumiose City": { "cn": "密阿雷市", "jp": "ミアレシティ" }
}

def translate_location(loc):
    if loc.startswith("Wild Zone"):
        num = loc.replace("Wild Zone", "").strip()
        return {
            "cn": f"野生区 {num}",
            "jp": f"ワイルドエリア {num}"
        }
    if "Seine River" in loc:
        return {
            "cn": "塞纳河 (区域 4)",
            "jp": "セーヌ川 (エリア 4)"
        }
    return { "cn": loc, "jp": loc }

def main():
    file_path = os.path.join(os.path.dirname(__file__), 'pokemon.json')
    
    with open(file_path, 'r', encoding='utf-8') as f:
        pokemon_list = json.load(f)
    
    new_pokemon_list = []
    
    for p in pokemon_list:
        # 1. Construct names object
        if 'names' in p and isinstance(p['names'], dict) and p['names'].get('cn'):
            names = p['names']
        else:
            names = {
                "cn": p.get('name'),
                "en": p.get('name_en') or p.get('name'),
                "jp": p.get('name_jp') or p.get('name')
            }
        
        # 2. Map types
        raw_types = p.get('types', [])
        # Check if types need mapping (if first element is in type_map keys)
        if raw_types and raw_types[0] in type_map:
            types = [type_map.get(t, t) for t in raw_types]
        else:
            types = raw_types
        
        # 3. Add new fields
        alpha_loc = { "cn": "未知", "en": "Unknown", "jp": "不明" }
        # Use English name for lookup
        lookup_name = names.get('en')
        alpha_info = alpha_data.get(lookup_name)
        
        if alpha_info:
            region = alpha_info['region']
            sub_loc = alpha_info['location']
            
            region_cn = REGION_TRANS.get(region, {}).get('cn', region)
            region_jp = REGION_TRANS.get(region, {}).get('jp', region)
            
            sub_loc_trans = translate_location(sub_loc)
            
            cond = alpha_info.get('condition')
            cond_en = f" ({cond})" if cond else ""
            
            if cond == "Night":
                cond_cn = " (夜晚)"
                cond_jp = " (夜)"
            elif cond == "Day":
                cond_cn = " (白天)"
                cond_jp = " (日中)"
            elif cond:
                cond_cn = f" ({cond})"
                cond_jp = f" ({cond})"
            else:
                cond_cn = ""
                cond_jp = ""
                
            alpha_loc = {
                "en": f"{region} - {sub_loc}{cond_en}",
                "cn": f"{region_cn} - {sub_loc_trans['cn']}{cond_cn}",
                "jp": f"{region_jp} - {sub_loc_trans['jp']}{cond_jp}"
            }
            
        capture_loc = { "cn": "未知", "en": "Unknown", "jp": "不明" }
        evolution = { "cn": "未知", "en": "Unknown", "jp": "不明" }
        
        new_p = {
            "id": p.get('id'),
            "national_id": p.get('national_id'),
            "names": names,
            "types": types,
            "image": p.get('image'),
            "capture_location": capture_loc,
            "alpha_location": alpha_loc,
            "evolution": evolution
        }
        new_pokemon_list.append(new_p)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(new_pokemon_list, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully transformed {len(new_pokemon_list)} pokemon entries.")

if __name__ == "__main__":
    main()
