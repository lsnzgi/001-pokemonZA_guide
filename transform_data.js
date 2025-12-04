const fs = require('fs');
const path = require('path');
const alphaData = require('./alpha_locations');

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

const REGION_TRANS = {
    "Lumiose City": { cn: "密阿雷市", jp: "ミアレシティ" }
};

// Helper to translate "Wild Zone X"
function translateLocation(loc) {
    if (loc.startsWith("Wild Zone")) {
        const num = loc.replace("Wild Zone", "").trim();
        return {
            cn: `野生区 ${num}`,
            jp: `ワイルドエリア ${num}`
        };
    }
    if (loc.includes("Seine River")) {
        return {
            cn: "塞纳河 (区域 4)",
            jp: "セーヌ川 (エリア 4)"
        };
    }
    // Fallback
    return { cn: loc, jp: loc };
}

const newPokemonList = pokemonList.map(p => {
    // 1. Construct names object
    const names = {
        cn: p.name,
        en: p.name_en || p.name, // Fallback if missing
        jp: p.name_jp || p.name  // Fallback if missing
    };

    // 2. Map types to English keys
    const types = p.types.map(t => typeMap[t] || t);

    // 3. Add new fields
    // Alpha Data
    let alphaLoc = { cn: "未知", en: "Unknown", jp: "不明" };
    const alphaInfo = alphaData[names.en]; // Match by English name

    if (alphaInfo) {
        const region = alphaInfo.region;
        const subLoc = alphaInfo.location;

        const regionCN = REGION_TRANS[region] ? REGION_TRANS[region].cn : region;
        const regionJP = REGION_TRANS[region] ? REGION_TRANS[region].jp : region;

        const subLocTrans = translateLocation(subLoc);

        const condEN = alphaInfo.condition ? ` (${alphaInfo.condition})` : "";
        const condCN = alphaInfo.condition === "Night" ? " (夜晚)" : (alphaInfo.condition === "Day" ? " (白天)" : (alphaInfo.condition ? ` (${alphaInfo.condition})` : ""));
        const condJP = alphaInfo.condition === "Night" ? " (夜)" : (alphaInfo.condition === "Day" ? " (日中)" : (alphaInfo.condition ? ` (${alphaInfo.condition})` : ""));

        alphaLoc = {
            en: `${region} - ${subLoc}${condEN}`,
            cn: `${regionCN} - ${subLocTrans.cn}${condCN}`,
            jp: `${regionJP} - ${subLocTrans.jp}${condJP}`
        };
    }

    // Capture Location (Placeholder for now, but structured)
    const captureLoc = { cn: "未知", en: "Unknown", jp: "不明" };

    // Evolution (Placeholder)
    const evolution = { cn: "未知", en: "Unknown", jp: "不明" };

    return {
        id: p.id,
        national_id: p.national_id,
        names: names,
        types: types,
        image: p.image,
        capture_location: captureLoc, // Renamed from district to be more accurate
        alpha_location: alphaLoc,
        evolution: evolution
    };
});

fs.writeFileSync(filePath, JSON.stringify(newPokemonList, null, 2), 'utf8');
console.log(`Successfully transformed ${newPokemonList.length} pokemon entries.`);
