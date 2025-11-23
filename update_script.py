import os

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replacement 1
old1 = "if (fcNameBack) fcNameBack.innerText = `#${p.id} ${p.name}`;"
new1 = "if (fcNameBack) fcNameBack.innerHTML = `#${p.id} ${p.name}<br><span style='font-size: 1rem; color: #666; font-weight: normal;'>${p.name_en || ''} ${p.name_jp || ''}</span>`;"
content = content.replace(old1, new1)

# Replacement 2
old2 = "<h2>#${pokemon.id} ${pokemon.name}</h2>"
new2 = "<h2>#${pokemon.id} ${pokemon.name}</h2>\n<p style='color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;'>${pokemon.name_en || ''} | ${pokemon.name_jp || ''}</p>"
content = content.replace(old2, new2)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)
