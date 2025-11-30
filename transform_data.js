const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pokemon.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const pokemonList = JSON.parse(rawData);

const typeMap = {
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
};

const newPokemonList = pokemonList.map(p => {
    // 1. Construct names object
    const names = {
        cn: p.name,
        en: p.name_en || p.name, // Fallback if missing
        jp: p.name_jp || p.name  // Fallback if missing
    };

    // 2. Map types to English keys
    const types = p.types.map(t => typeMap[t] || t);

    // 3. Add new fields with placeholders
    // We'll use empty strings or "Unknown" for now, user can fill later
    const district = { cn: "未知", en: "Unknown", jp: "不明" };
    const alpha_location = { cn: "未知", en: "Unknown", jp: "不明" };
    const evolution = { cn: "未知", en: "Unknown", jp: "不明" };

    return {
        id: p.id,
        national_id: p.national_id,
        names: names,
        types: types,
        image: p.image,
        district: district,
        alpha_location: alpha_location,
        evolution: evolution
    };
});

fs.writeFileSync(filePath, JSON.stringify(newPokemonList, null, 2), 'utf8');
console.log(`Successfully transformed ${newPokemonList.length} pokemon entries.`);
