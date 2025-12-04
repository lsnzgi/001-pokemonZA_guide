import json
import os
import re

def translate_location(loc):
    if loc.startswith("Wild Zone"):
        num = loc.replace("Wild Zone", "").strip()
        return {
            "cn": f"野生区 {num}",
            "jp": f"ワイルドエリア {num}"
        }
    return { "cn": loc, "jp": loc }

def main():
    base_dir = os.path.dirname(__file__)
    raw_file = os.path.join(base_dir, 'game8_raw.txt')
    json_file = os.path.join(base_dir, 'pokemon.json')
    
    # Parse Raw Data
    capture_map = {} # Name -> List of Zones
    alpha_map = {}   # Name -> List of Zones
    
    current_zone = None
    is_alpha = False
    
    with open(raw_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for Header
        match = re.search(r'### Wild Zone (\d+)( Alpha)? Pokemon', line)
        if match:
            current_zone = f"Wild Zone {match.group(1)}"
            is_alpha = bool(match.group(2))
            continue
            
        # Check for Pokemon
        if current_zone and line.startswith('[') and line.endswith(']'):
            name = line[1:-1]
            # Clean name (remove form info like "(Average)")
            clean_name = re.sub(r'\s*\(.*?\)', '', name)
            
            if is_alpha:
                if clean_name not in alpha_map:
                    alpha_map[clean_name] = []
                if current_zone not in alpha_map[clean_name]:
                    alpha_map[clean_name].append(current_zone)
            else:
                if clean_name not in capture_map:
                    capture_map[clean_name] = []
                if current_zone not in capture_map[clean_name]:
                    capture_map[clean_name].append(current_zone)

    # Update JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        pokemon_list = json.load(f)
        
    updated_count = 0
    
    for p in pokemon_list:
        name_en = p['names']['en']
        
        # Update Capture Location
        if name_en in capture_map:
            zones = capture_map[name_en]
            # Join multiple zones
            loc_en = ", ".join(zones)
            
            # Localize
            loc_cn_parts = []
            loc_jp_parts = []
            for z in zones:
                trans = translate_location(z)
                loc_cn_parts.append(trans['cn'])
                loc_jp_parts.append(trans['jp'])
            
            p['capture_location'] = {
                "en": loc_en,
                "cn": ", ".join(loc_cn_parts),
                "jp": ", ".join(loc_jp_parts)
            }
            updated_count += 1
            
        # Update Alpha Location (Merge with existing if any, or overwrite)
        # Game8 data is likely more comprehensive for zones, but might miss specific conditions like "Night"
        # We'll append Game8 data if it's new
        if name_en in alpha_map:
            zones = alpha_map[name_en]
            
            # Existing data might be "Lumiose City - Wild Zone 6 (Night)"
            # We want to keep that detail if possible.
            # Simple approach: If existing is "Unknown", overwrite. If exists, append if different.
            
            existing_en = p['alpha_location']['en']
            
            if existing_en == "Unknown":
                loc_en = ", ".join(zones)
                loc_cn_parts = []
                loc_jp_parts = []
                for z in zones:
                    trans = translate_location(z)
                    loc_cn_parts.append(trans['cn'])
                    loc_jp_parts.append(trans['jp'])
                
                p['alpha_location'] = {
                    "en": loc_en,
                    "cn": ", ".join(loc_cn_parts),
                    "jp": ", ".join(loc_jp_parts)
                }
            else:
                # Check if new zones are already in existing string
                new_zones = [z for z in zones if z not in existing_en]
                if new_zones:
                    # Append
                    p['alpha_location']['en'] += ", " + ", ".join(new_zones)
                    
                    loc_cn_parts = []
                    loc_jp_parts = []
                    for z in new_zones:
                        trans = translate_location(z)
                        loc_cn_parts.append(trans['cn'])
                        loc_jp_parts.append(trans['jp'])
                        
                    p['alpha_location']['cn'] += ", " + ", ".join(loc_cn_parts)
                    p['alpha_location']['jp'] += ", " + ", ".join(loc_jp_parts)

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(pokemon_list, f, indent=2, ensure_ascii=False)
        
    print(f"Updated locations for {updated_count} Pokemon.")

if __name__ == "__main__":
    main()
