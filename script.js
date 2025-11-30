document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const grid = document.getElementById('pokemon-grid');
    const searchInput = document.getElementById('search-input');
    const hideNamesToggle = document.getElementById('hide-names');
    const hideTypesToggle = document.getElementById('hide-types');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');
    const navBtns = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const filterBar = document.getElementById('type-filters');
    const gridControls = document.getElementById('grid-controls');

    // Flashcard Elements
    const flashcard = document.getElementById('flashcard');
    const fcImg = document.getElementById('fc-img');
    const fcName = document.getElementById('fc-name');
    const fcNameBack = document.getElementById('fc-name-back');
    const fcTypes = document.getElementById('fc-types');
    const fcWeaknesses = document.getElementById('fc-weaknesses');
    const fcPrev = document.getElementById('fc-prev');
    const fcNext = document.getElementById('fc-next');
    const fcFlip = document.getElementById('fc-flip');

    // Game Elements
    const gameArea = document.getElementById('game-area');
    const gameContent = document.getElementById('game-content');
    const gameScoreEl = document.getElementById('game-score');
    const gameStreakEl = document.getElementById('game-streak');
    const gamesMenu = document.querySelector('.games-menu');

    // Cheatsheet Elements (Type Explorer)
    const explorerTypes = document.getElementById('explorer-types');
    const explorerResults = document.getElementById('explorer-results');
    const offStrong = document.getElementById('off-strong');
    const offWeak = document.getElementById('off-weak');
    const defWeak = document.getElementById('def-weak');
    const defResist = document.getElementById('def-resist');

    // Translations
    const TRANSLATIONS = {
        cn: {
            subtitle: "密阿雷图鉴记忆助手",
            nav_pokedex: "图鉴",
            nav_flashcards: "卡片",
            nav_games: "游戏",
            nav_cheatsheet: "相性表",
            search_placeholder: "搜索宝可梦名称或属性...",
            hide_names: "隐藏名字",
            hide_types: "隐藏属性",
            click_to_flip: "点击翻转",
            prev: "上一个",
            next: "下一个",
            flip: "翻转",
            game_guess_type: "猜属性",
            game_guess_weakness: "猜弱点",
            game_guess_strong: "猜克制",
            exit: "退出",
            submit_answer: "提交答案",
            select_type_hint: "选择属性查看相性",
            offensive: "攻击 (Offensive)",
            strong_against: "打击面 (Strong Against)",
            defensive: "防御 (Defensive)",
            weak_to: "弱点 (Weak To)",
            immune_to: "无效 (Immune To)",
            score: "得分",
            streak: "连胜",
            correct: "正确!",
            wrong: "错误!",
            types: "属性:",
            weak_to_label: "弱点:",
            immune_to_label: "无效:",
            next_question: "下一题 ➔",
            game_q_type: "{name} 的属性是?",
            game_q_weakness: "什么属性克制 {name}?",
            game_q_strong: "{name} 克制什么属性?",
            select_all: "选择所有正确答案",
            no_weakness: "无弱点",
            none: "无",
            hint_click_types: "点击属性查看详情",
            hint_select_2: "最多选择2个属性",
            not_super_effective: "无克制对象"
        },
        en: {
            subtitle: "Lumiose City Pokedex Memory Aid",
            nav_pokedex: "Pokedex",
            nav_flashcards: "Flashcards",
            nav_games: "Games",
            nav_cheatsheet: "Cheatsheet",
            search_placeholder: "Search Pokemon or Type...",
            hide_names: "Hide Names",
            hide_types: "Hide Types",
            click_to_flip: "Click to Flip",
            prev: "Prev",
            next: "Next",
            flip: "Flip",
            game_guess_type: "Guess Type",
            game_guess_weakness: "Guess Weakness",
            game_guess_strong: "Guess Strong",
            exit: "Exit",
            submit_answer: "Submit Answer",
            select_type_hint: "Select Type to View Effectiveness",
            offensive: "Offensive",
            strong_against: "Strong Against",
            defensive: "Defensive",
            weak_to: "Weak To",
            immune_to: "Immune To",
            score: "Score",
            streak: "Streak",
            correct: "Correct!",
            wrong: "Wrong!",
            types: "Types:",
            weak_to_label: "Weak To:",
            immune_to_label: "Immune To:",
            next_question: "Next Question ➔",
            game_q_type: "What is {name}'s type?",
            game_q_weakness: "What is effective against {name}?",
            game_q_strong: "What is {name} strong against?",
            select_all: "Select ALL correct types",
            no_weakness: "No Weaknesses",
            none: "None",
            hint_click_types: "Click types to see details",
            hint_select_2: "Select up to 2 types",
            not_super_effective: "Not super effective against anything"
        },
        jp: {
            subtitle: "ミアレシティ図鑑記憶サポーター",
            nav_pokedex: "図鑑",
            nav_flashcards: "カード",
            nav_games: "ゲーム",
            nav_cheatsheet: "相性表",
            search_placeholder: "ポケモン名またはタイプを検索...",
            hide_names: "名前を隠す",
            hide_types: "タイプを隠す",
            click_to_flip: "クリックして反転",
            prev: "前へ",
            next: "次へ",
            flip: "反転",
            game_guess_type: "タイプ当て",
            game_guess_weakness: "弱点当て",
            game_guess_strong: "抜群当て",
            exit: "終了",
            submit_answer: "回答する",
            select_type_hint: "タイプを選択して相性を確認",
            offensive: "攻撃 (Offensive)",
            strong_against: "抜群 (Strong Against)",
            defensive: "防御 (Defensive)",
            weak_to: "弱点 (Weak To)",
            immune_to: "無効 (Immune To)",
            score: "スコア",
            streak: "連勝",
            correct: "正解!",
            wrong: "不正解!",
            types: "タイプ:",
            weak_to_label: "弱点:",
            immune_to_label: "無効:",
            next_question: "次の問題 ➔",
            game_q_type: "{name} のタイプは?",
            game_q_weakness: "{name} の弱点は?",
            game_q_strong: "{name} は何に抜群?",
            select_all: "正解をすべて選択",
            no_weakness: "弱点なし",
            none: "なし",
            hint_click_types: "タイプをクリックして詳細を表示",
            hint_select_2: "2つまで選択可能",
            not_super_effective: "抜群なし"
        }
    };

    // Type Translations (Simple Map)
    const TYPE_TRANS = {
        "Normal": { cn: "一般", en: "Normal", jp: "ノーマル" },
        "Fire": { cn: "火", en: "Fire", jp: "ほのお" },
        "Water": { cn: "水", en: "Water", jp: "みず" },
        "Grass": { cn: "草", en: "Grass", jp: "くさ" },
        "Electric": { cn: "电", en: "Electric", jp: "でんき" },
        "Ice": { cn: "冰", en: "Ice", jp: "こおり" },
        "Fighting": { cn: "格斗", en: "Fighting", jp: "かくとう" },
        "Poison": { cn: "毒", en: "Poison", jp: "どく" },
        "Ground": { cn: "地面", en: "Ground", jp: "じめん" },
        "Flying": { cn: "飞行", en: "Flying", jp: "ひこう" },
        "Psychic": { cn: "超能力", en: "Psychic", jp: "エスパー" },
        "Bug": { cn: "虫", en: "Bug", jp: "むし" },
        "Rock": { cn: "岩石", en: "Rock", jp: "いわ" },
        "Ghost": { cn: "幽灵", en: "Ghost", jp: "ゴースト" },
        "Dragon": { cn: "龙", en: "Dragon", jp: "ドラゴン" },
        "Dark": { cn: "恶", en: "Dark", jp: "あく" },
        "Steel": { cn: "钢", en: "Steel", jp: "はがね" },
        "Fairy": { cn: "妖精", en: "Fairy", jp: "フェアリー" }
    };

    // Reverse Map for Data Loading (CN -> EN Key)
    // We will need to normalize the data or just use this map if data is still mixed.
    // Ideally we convert data to EN keys.

    // State
    let currentLang = 'cn';
    let allPokemon = [];
    let typeChart = {};
    let currentFilter = 'all';
    let currentFlashcardIndex = 0;
    let gameScore = 0;
    let gameStreak = 0;

    let currentGameType = null;
    let selectedCheatsheetTypes = []; // Array of strings, max 2

    // Fetch Data
    try {
        const [pokemonRes, typesRes] = await Promise.all([
            fetch('pokemon.json'),
            fetch('types.json')
        ]);
        allPokemon = await pokemonRes.json();
        typeChart = await typesRes.json();

        initApp();
    } catch (error) {
        console.error("Error loading data:", error);
        grid.innerHTML = "<p>Error loading data. Please check console.</p>";
    }

    function initApp() {
        setupCheatsheet(); // Create elements first
        setupLanguageSwitcher();
        setupEventListeners();

        setLanguage(currentLang); // Initial render

        // Preload first flashcard if data exists
        if (allPokemon.length > 0) {
            loadFlashcard(0);
        }
    }

    function setupLanguageSwitcher() {
        const btns = document.querySelectorAll('.lang-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                setLanguage(btn.dataset.lang);
            });
        });
    }

    function setLanguage(lang) {
        currentLang = lang;

        // Update Buttons
        document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
        });

        // Update Static Text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (TRANSLATIONS[lang][key]) {
                el.innerText = TRANSLATIONS[lang][key];
            }
        });

        // Update Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (TRANSLATIONS[lang][key]) {
                el.placeholder = TRANSLATIONS[lang][key];
            }
        });

        // Re-render Views
        renderPokemon(allPokemon); // Grid
        renderFilters(); // Filters
        loadFlashcard(currentFlashcardIndex); // Flashcard
        setupCheatsheet(); // Re-render Cheatsheet Grid
        updateCheatsheetUI(); // Cheatsheet Results

        // If game is active, maybe restart or update text?
        // For now, next question will handle it.
        if (!document.getElementById('game-area').classList.contains('hidden')) {
            // Update Score/Streak labels manually if needed or just let them be
            updateGameStats();
        }
    }

    function getTransType(typeKey) {
        // typeKey might be "Grass" (EN) or "草" (CN) depending on data state.
        // We should normalize data to EN keys first.
        // For now, let's try to find the EN key if it's not.
        let enKey = typeKey;
        // Simple check if it's Chinese
        const entry = Object.entries(TYPE_TRANS).find(([k, v]) => v.cn === typeKey || k === typeKey);
        if (entry) enKey = entry[0];

        if (TYPE_TRANS[enKey]) {
            return TYPE_TRANS[enKey][currentLang];
        }
        return typeKey;
    }

    function getPokemonName(p) {
        // Handle new data structure names: { cn, en, jp }
        if (p.names && p.names[currentLang]) {
            return p.names[currentLang];
        }
        // Fallback to old structure
        if (currentLang === 'en') return p.name_en || p.name;
        if (currentLang === 'jp') return p.name_jp || p.name;
        return p.name;
    }

    // --- Navigation ---
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabId = btn.dataset.tab;
            viewSections.forEach(section => {
                if (section.id === `${tabId}-view`) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });

            // Show/Hide Grid Controls
            if (tabId === 'grid') {
                gridControls.style.display = 'flex';
            } else {
                gridControls.style.display = 'none';
            }

            // Persistent Flashcard Fix: Reload when tab is clicked
            if (tabId === 'flashcards') {
                loadFlashcard(currentFlashcardIndex);
            }
        });
    });

    // --- Grid View ---
    function renderPokemon(pokemonList) {
        grid.innerHTML = '';
        pokemonList.forEach(p => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.onclick = () => showDetails(p);

            const name = getPokemonName(p);
            const typesHtml = p.types.map(t => {
                const transType = getTransType(t);
                return `<span class="type-badge type-${t}">${transType}</span>`;
            }).join('');

            card.innerHTML = `
                <img src="${p.image}" alt="${name}" class="pokemon-img" loading="lazy">
                <div class="pokemon-id">#${p.id}</div>
                <div class="pokemon-name">${name}</div>
                <div class="pokemon-types">${typesHtml}</div>
            `;
            grid.appendChild(card);
        });
    }

    function renderFilters() {
        const types = Object.keys(typeChart);
        // "All" translation
        const allText = currentLang === 'cn' ? '全部' : (currentLang === 'jp' ? 'すべて' : 'All');
        filterBar.innerHTML = `<span class="filter-badge default-badge active" data-type="all">${allText}</span>`;

        types.forEach(type => {
            const badge = document.createElement('span');
            badge.className = `filter-badge type-badge type-${type}`;
            badge.innerText = getTransType(type);
            badge.dataset.type = type;
            badge.onclick = () => filterGrid(type);
            filterBar.appendChild(badge);
        });

        filterBar.querySelector('[data-type="all"]').onclick = () => filterGrid('all');
    }

    function filterGrid(type) {
        currentFilter = type;
        document.querySelectorAll('.filter-badge').forEach(b => b.classList.remove('active'));
        const activeBadge = filterBar.querySelector(`[data-type="${type}"]`);
        if (activeBadge) activeBadge.classList.add('active');

        let filtered = allPokemon;
        if (type !== 'all') {
            filtered = allPokemon.filter(p => p.types.includes(type));
        }

        // Apply search filter as well
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p => {
                const name = getPokemonName(p).toLowerCase();
                const types = p.types.map(t => getTransType(t).toLowerCase());
                return name.includes(searchTerm) ||
                    types.some(t => t.includes(searchTerm)) ||
                    p.id.includes(searchTerm);
            });
        }

        renderPokemon(filtered);
    }

    searchInput.addEventListener('input', (e) => {
        filterGrid(currentFilter);
    });

    // --- Flashcard View ---
    function loadFlashcard(index) {
        if (!allPokemon || allPokemon.length === 0) return;

        // Shuffle if first load and not already shuffled
        if (!window.flashcardDeck) {
            window.flashcardDeck = [...allPokemon].sort(() => Math.random() - 0.5);
        }

        if (index < 0) index = window.flashcardDeck.length - 1;
        if (index >= window.flashcardDeck.length) index = 0;
        currentFlashcardIndex = index;

        const p = window.flashcardDeck[index];
        const name = getPokemonName(p);

        // Ensure elements exist before setting properties
        if (fcImg) fcImg.src = p.image;
        if (fcName) fcName.innerText = name;
        if (fcNameBack) fcNameBack.innerHTML = `#${p.id} ${name}`;

        if (fcTypes) {
            // Generate types with tooltip data for hover
            fcTypes.innerHTML = p.types.map(t => {
                const transType = getTransType(t);
                // Calculate what this specific type is weak to (Defensive)
                const weakTo = [];
                Object.keys(typeChart).forEach(attacker => {
                    if (typeChart[attacker][t] > 1) weakTo.push(getTransType(attacker));
                });

                const weakLabel = TRANSLATIONS[currentLang].weak_to_label || "Weak to:";
                const noWeakLabel = TRANSLATIONS[currentLang].no_weakness || "No Weaknesses";
                const tooltipText = weakTo.length > 0 ? `${weakLabel} ${weakTo.join(', ')}` : noWeakLabel;

                // Use onmouseenter/leave for JS tooltip to avoid overflow clipping
                return `<span class="type-badge type-${t}" onmouseenter="showTooltip(event, '${tooltipText}')" onmouseleave="hideTooltip()">${transType}</span>`;
            }).join('');
        }

        // Remove static effectiveness list as requested
        if (fcWeaknesses) {
            fcWeaknesses.innerHTML = '';
            fcWeaknesses.style.display = 'none'; // Hide the container
        }

        if (flashcard) flashcard.classList.remove('flipped');
    }

    flashcard.addEventListener('click', (e) => {
        // Don't flip if clicking a type badge (to allow hover/reading)
        if (!e.target.classList.contains('type-badge')) {
            flashcard.classList.toggle('flipped');
        }
    });
    fcFlip.addEventListener('click', () => flashcard.classList.toggle('flipped'));

    fcPrev.addEventListener('click', () => loadFlashcard(currentFlashcardIndex - 1));
    fcNext.addEventListener('click', () => loadFlashcard(currentFlashcardIndex + 1));

    // --- Games View ---
    let selectedAnswers = new Set();
    let currentCorrectAnswers = [];
    let currentPokemon = null; // Add global state for current pokemon

    window.startGame = (type) => {
        currentGameType = type;
        gameScore = 0;
        gameStreak = 0;
        updateGameStats();
        gamesMenu.classList.add('hidden');
        gameArea.classList.remove('hidden');
        nextGameQuestion();
    };

    window.stopGame = () => {
        gameArea.classList.add('hidden');
        gamesMenu.classList.remove('hidden');
    };

    function updateGameStats() {
        gameScoreEl.innerText = `Score: ${gameScore}`;
        gameStreakEl.innerText = `Streak: ${gameStreak}`;
        if (gameStreak > 0) {
            gameStreakEl.classList.remove('hidden');
        } else {
            gameStreakEl.classList.add('hidden');
        }
    }

    // Expose for global access (e.g. from HTML onclick)
    window.nextGameQuestion = function () {
        const p = allPokemon[Math.floor(Math.random() * allPokemon.length)];
        currentPokemon = p; // Store current pokemon
        selectedAnswers.clear();
        document.getElementById('game-controls').classList.add('hidden');

        // Clear any previous feedback
        const feedbackEl = document.getElementById('game-feedback');
        if (feedbackEl) feedbackEl.remove();

        // Enable options container
        const optionsContainer = document.querySelector('.game-options');
        if (optionsContainer) {
            optionsContainer.classList.remove('disabled');
        }

        let questionHtml = '';
        let options = [];
        const allTypes = Object.keys(typeChart);

        if (currentGameType === 'type') {
            const qText = TRANSLATIONS[currentLang].game_q_type.replace('{name}', getPokemonName(p));
            const hintText = TRANSLATIONS[currentLang].select_all;
            questionHtml = `
                <div class="game-question">
                    <img src="${p.image}" alt="Pokemon">
                    <h3>${qText}</h3>
                    <p style="font-size: 0.9rem; color: #888;">${hintText}</p>
                </div>
            `;
            currentCorrectAnswers = p.types;
            options = allTypes;
            document.getElementById('game-controls').classList.remove('hidden'); // Show submit button

        } else if (currentGameType === 'weakness') {
            const weaknesses = calculateWeaknesses(p.types);
            const weakTypes = Object.keys(weaknesses).filter(t => weaknesses[t] >= 2);

            if (weakTypes.length === 0) return nextGameQuestion(); // Skip if no weaknesses

            currentCorrectAnswers = weakTypes; // Allow selecting ANY correct weakness

            const qText = TRANSLATIONS[currentLang].game_q_weakness.replace('{name}', getPokemonName(p));
            const hintText = TRANSLATIONS[currentLang].select_all;

            questionHtml = `
                <div class="game-question">
                    <img src="${p.image}" alt="Pokemon">
                    <h3>${qText}</h3>
                    <p style="font-size: 0.9rem; color: #888;">${hintText}</p>
                </div>
            `;

            options = allTypes;
            document.getElementById('game-controls').classList.remove('hidden');

        } else if (currentGameType === 'strong') {
            // What is this Pokemon strong against? (Offensive)
            // We look at the Pokemon's types.
            const strongAgainst = new Set();
            p.types.forEach(myType => {
                allTypes.forEach(defType => {
                    if (typeChart[myType][defType] > 1) {
                        strongAgainst.add(defType);
                    }
                });
            });

            if (strongAgainst.size === 0) return nextGameQuestion();

            currentCorrectAnswers = Array.from(strongAgainst);

            const qText = TRANSLATIONS[currentLang].game_q_strong.replace('{name}', getPokemonName(p));
            const hintText = TRANSLATIONS[currentLang].select_all;

            questionHtml = `
                <div class="game-question">
                    <img src="${p.image}" alt="Pokemon">
                    <h3>${qText}</h3>
                    <p style="font-size: 0.9rem; color: #888;">${hintText}</p>
                </div>
            `;
            options = allTypes;
            document.getElementById('game-controls').classList.remove('hidden');
        }

        const optionsHtml = options.map(opt =>
            `<button class="option-btn type-${opt}" onclick="handleOptionClick(this, '${opt}')">${getTransType(opt)}</button>`
        ).join('');

        gameContent.innerHTML = `
            ${questionHtml}
            <div class="game-options">${optionsHtml}</div>
        `;
    };

    window.handleOptionClick = (btn, value) => {
        if (btn.closest('.game-options').classList.contains('disabled')) return;

        // Toggle selection for ALL game modes now (Unified Flow)
        if (selectedAnswers.has(value)) {
            selectedAnswers.delete(value);
            btn.classList.remove('selected');
        } else {
            selectedAnswers.add(value);
            btn.classList.add('selected');
        }
    };

    document.getElementById('submit-answer-btn').onclick = () => {
        submitAnswer();
    };

    function submitAnswer() {
        // Disable inputs
        const btns = document.querySelectorAll('.option-btn');
        document.querySelector('.game-options').classList.add('disabled');
        document.getElementById('game-controls').classList.add('hidden');

        const selected = Array.from(selectedAnswers);
        const correct = currentCorrectAnswers;

        // Logic:
        // Type Game: Must select ALL correct types exactly.
        // Weakness/Strong Game: 
        // User might not know ALL of them. Should we require ALL?
        // "Select ALL correct types" implies yes.
        // Let's require ALL for strictness, or at least ONE correct and NO wrong?
        // User request: "submit answer... then next".
        // Let's enforce strict "Match All" for now to be challenging.

        const isCorrect = selected.length === correct.length &&
            selected.every(val => correct.includes(val));

        if (isCorrect) {
            gameScore++;
            gameStreak++;
            // Highlight correct
            btns.forEach(b => {
                if (selectedAnswers.has(b.innerText)) b.classList.add('correct');
            });
        } else {
            gameStreak = 0;
            // Highlight results
            btns.forEach(b => {
                const val = b.innerText;
                if (selectedAnswers.has(val) && !correct.includes(val)) {
                    b.classList.add('wrong'); // Selected but wrong
                }
                if (correct.includes(val)) {
                    b.classList.add('correct'); // Should have been selected
                    if (!selectedAnswers.has(val)) b.classList.add('missed'); // Missed
                }
            });
        }
        updateGameStats();
        showGameFeedback(isCorrect);
    }

    function showGameFeedback(isCorrect) {
        const p = currentPokemon;

        // Calculate data for feedback
        const weaknesses = calculateWeaknesses(p.types);
        const weakTypes = Object.keys(weaknesses).filter(t => weaknesses[t] > 1);
        const immuneTypes = Object.keys(weaknesses).filter(t => weaknesses[t] === 0);

        // Sort weak types by multiplier
        weakTypes.sort((a, b) => weaknesses[b] - weaknesses[a]);

        const typesHtml = p.types.map(t =>
            `<span class="type-badge type-${t}">${getTransType(t)}</span>`
        ).join('');

        const weakHtml = weakTypes.length > 0 ? weakTypes.map(t => {
            const mult = weaknesses[t];
            return `<span class="type-badge type-${t}" style="margin: 2px;">${getTransType(t)} <small>x${mult}</small></span>`;
        }).join('') : `<span>${TRANSLATIONS[currentLang].none}</span>`;

        const immuneHtml = immuneTypes.length > 0 ? immuneTypes.map(t =>
            `<span class="type-badge type-${t}" style="margin: 2px; opacity: 0.7;">${getTransType(t)} <small>x0</small></span>`
        ).join('') : `<span>${TRANSLATIONS[currentLang].none}</span>`;

        let feedbackTitle = isCorrect ? `<h3 style="color:#7AC74C">${TRANSLATIONS[currentLang].correct}</h3>` : `<h3 style="color:#FF69B4">${TRANSLATIONS[currentLang].wrong}</h3>`;

        const feedbackDiv = document.createElement('div');
        feedbackDiv.id = 'game-feedback';
        feedbackDiv.className = 'game-feedback';
        feedbackDiv.innerHTML = `
            <div class="feedback-content">
                ${feedbackTitle}
                <h4>${getPokemonName(p)}</h4>
                <div class="feedback-row">
                    <span>${TRANSLATIONS[currentLang].types}</span>
                    <div class="feedback-badges">${typesHtml}</div>
                </div>
                <div class="feedback-row">
                    <span>${TRANSLATIONS[currentLang].weak_to_label}</span>
                    <div class="feedback-badges">${weakHtml}</div>
                </div>
                <div class="feedback-row">
                    <span>${TRANSLATIONS[currentLang].immune_to_label}</span>
                    <div class="feedback-badges">${immuneHtml}</div>
                </div>
            </div>
            <button id="next-question-btn" class="action-btn" onclick="nextGameQuestion()">${TRANSLATIONS[currentLang].next_question}</button>
        `;

        gameContent.appendChild(feedbackDiv);
        feedbackDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Cheatsheet View (Interactive) ---
    function setupCheatsheet() {
        const types = Object.keys(typeChart);
        const allTypesList = document.getElementById('explorer-types');

        if (!allTypesList) return;
        allTypesList.innerHTML = '';

        types.forEach(type => {
            const badge = document.createElement('div');
            badge.className = `type-badge type-${type} type-item-interactive`;
            badge.innerText = getTransType(type);
            badge.onclick = () => toggleTypeSelection(type);
            allTypesList.appendChild(badge);
        });

        updateCheatsheetUI();
    }

    function toggleTypeSelection(type) {
        const index = selectedCheatsheetTypes.indexOf(type);

        if (index > -1) {
            // Already selected, remove it
            selectedCheatsheetTypes.splice(index, 1);
        } else {
            // Not selected
            if (selectedCheatsheetTypes.length < 2) {
                // Add if space
                selectedCheatsheetTypes.push(type);
            } else {
                // Replace first one (FIFO) if full
                selectedCheatsheetTypes.shift();
                selectedCheatsheetTypes.push(type);
            }
        }
        updateCheatsheetUI();
    }

    function updateCheatsheetUI() {
        const allTypesList = document.getElementById('explorer-types');
        const weakToList = document.getElementById('weak-to-list');
        const strongAgainstList = document.getElementById('strong-against-list');
        const immunityInfo = document.getElementById('immunity-info');
        const immuneToTypes = document.getElementById('immune-to-types');

        if (!allTypesList) return;

        // 1. Update Active State in Center
        const allBadges = allTypesList.querySelectorAll('.type-badge');
        allBadges.forEach(b => {
            if (selectedCheatsheetTypes.includes(b.innerText)) {
                b.classList.add('active');
                b.style.opacity = '1';
            } else {
                b.classList.remove('active');
                b.style.opacity = selectedCheatsheetTypes.length > 0 ? '0.4' : '0.6';
            }
        });

        // 2. Clear Lists if empty
        if (selectedCheatsheetTypes.length === 0) {
            weakToList.innerHTML = `<p class="hint">${TRANSLATIONS[currentLang].hint_click_types}</p>`;
            strongAgainstList.innerHTML = `<p class="hint">${TRANSLATIONS[currentLang].hint_select_2}</p>`;
            immunityInfo.classList.add('hidden');
            return;
        }

        // 3. Get Relationships
        const rels = getCombinedRelationships(selectedCheatsheetTypes);

        // 4. Render Weak To (Left)
        weakToList.innerHTML = '';
        if (rels.weakTo.length === 0) {
            weakToList.innerHTML = `<p class="hint">${TRANSLATIONS[currentLang].no_weakness}</p>`;
        } else {
            rels.weakTo.forEach(item => {
                const badge = document.createElement('div');
                badge.className = `type-badge type-${item.type}`;
                badge.innerHTML = `${getTransType(item.type)} <small>x${item.multiplier}</small>`;
                weakToList.appendChild(badge);
            });
        }

        // 5. Render Strong Against (Right)
        strongAgainstList.innerHTML = '';
        if (rels.strongAgainst.length === 0) {
            strongAgainstList.innerHTML = `<p class="hint">${TRANSLATIONS[currentLang].not_super_effective}</p>`;
        } else {
            rels.strongAgainst.forEach(t => {
                const badge = document.createElement('div');
                badge.className = `type-badge type-${t}`;
                badge.innerText = getTransType(t);
                strongAgainstList.appendChild(badge);
            });
        }

        // 6. Render Immunities
        if (rels.immuneTo.length > 0) {
            immunityInfo.classList.remove('hidden');
            immuneToTypes.innerHTML = '';
            rels.immuneTo.forEach(t => {
                const span = document.createElement('span');
                span.className = `type-badge type-${t}`;
                span.style.fontSize = '0.8rem';
                span.style.margin = '0 0.2rem';
                span.innerText = getTransType(t);
                immuneToTypes.appendChild(span);
            });
        } else {
            immunityInfo.classList.add('hidden');
        }
    }

    function getCombinedRelationships(selectedTypes) {
        const weakTo = []; // Array of {type, multiplier}
        const strongAgainst = new Set();
        const immuneTo = [];
        const allTypes = Object.keys(typeChart);

        if (selectedTypes.length === 0) return { weakTo: [], strongAgainst: [], immuneTo: [] };

        // 1. Weak To (Defensive) & Immune To
        // Check every attacker against our selected types (as defenders)
        allTypes.forEach(attacker => {
            let multiplier = 1;
            selectedTypes.forEach(defType => {
                const effectiveness = typeChart[attacker][defType];
                const factor = effectiveness !== undefined ? effectiveness : 1;
                multiplier *= factor;
            });

            if (multiplier > 1) {
                weakTo.push({ type: attacker, multiplier });
            }
            if (multiplier === 0) {
                immuneTo.push(attacker);
            }
        });

        // Sort weakTo by multiplier (descending)
        weakTo.sort((a, b) => b.multiplier - a.multiplier);

        // 2. Strong Against (Offensive)
        // Combine what each selected type is strong against
        selectedTypes.forEach(myType => {
            allTypes.forEach(defender => {
                const effectiveness = (typeChart[myType][defender] !== undefined) ? typeChart[myType][defender] : 1;
                if (effectiveness > 1) {
                    strongAgainst.add(defender);
                }
            });
        });

        return {
            weakTo,
            strongAgainst: Array.from(strongAgainst),
            immuneTo
        };
    }


    // --- Shared Logic ---
    function setupEventListeners() {
        hideNamesToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('hide-names', e.target.checked);
        });

        hideTypesToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('hide-types', e.target.checked);
        });

        closeBtn.onclick = () => modal.classList.add('hidden');
        window.onclick = (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        };
    }

    function showDetails(pokemon) {
        const weaknesses = calculateWeaknesses(pokemon.types);
        const typesHtml = pokemon.types.map(t =>
            `<span class="type-badge type-${t}">${getTransType(t)}</span>`
        ).join('');

        const name = getPokemonName(pokemon);
        // New Fields (District, Alpha, Evo)
        // We assume these fields exist in the new data structure with {cn, en, jp} or similar
        // If not, we show "Unknown" or hide

        const district = pokemon.district ? (pokemon.district[currentLang] || pokemon.district.en || 'Unknown') : 'Unknown';
        const alpha = pokemon.alpha_location ? (pokemon.alpha_location[currentLang] || pokemon.alpha_location.en || 'Unknown') : 'Unknown';
        const evolution = pokemon.evolution ? (pokemon.evolution[currentLang] || pokemon.evolution.en || 'Unknown') : 'Unknown';

        const districtLabel = currentLang === 'cn' ? '栖息地' : (currentLang === 'jp' ? '生息地' : 'District');
        const alphaLabel = currentLang === 'cn' ? '头目位置' : (currentLang === 'jp' ? 'オヤブン' : 'Alpha Location');
        const evoLabel = currentLang === 'cn' ? '进化链' : (currentLang === 'jp' ? '進化' : 'Evolution');

        modalBody.innerHTML = `
            <div class="detail-header">
                <img src="${pokemon.image}" alt="${name}" class="detail-img">
                <div>
                    <h2>#${pokemon.id} ${name}</h2>
                    <div class="pokemon-types" style="justify-content: flex-start; margin-top: 0.5rem;">${typesHtml}</div>
                </div>
            </div>
            
            <div class="info-section" style="margin-bottom: 1rem; background: rgba(255,255,255,0.5); padding: 1rem; border-radius: 12px;">
                <p><strong>${districtLabel}:</strong> ${district}</p>
                <p><strong>${alphaLabel}:</strong> ${alpha}</p>
                <p><strong>${evoLabel}:</strong> ${evolution}</p>
            </div>

            <div class="effectiveness-section">
                <h3>${currentLang === 'cn' ? '属性相性' : (currentLang === 'jp' ? 'タイプ相性' : 'Type Effectiveness')}</h3>
                <div class="eff-grid">
                    ${renderWeaknessesHtml(weaknesses) || '<p>No special effectiveness</p>'}
                </div>
            </div>
        `;
        modal.classList.remove('hidden');
    }

    function calculateWeaknesses(defenderTypes) {
        const effectiveness = {};
        const allTypes = Object.keys(typeChart);

        allTypes.forEach(attackerType => {
            let multiplier = 1;
            defenderTypes.forEach(defType => {
                if (typeChart[attackerType] && typeChart[attackerType][defType] !== undefined) {
                    multiplier *= typeChart[attackerType][defType];
                }
            });
            effectiveness[attackerType] = multiplier;
        });
        return effectiveness;
    }

    function renderWeaknessesHtml(weaknesses) {
        let html = '';
        for (const [type, multiplier] of Object.entries(weaknesses)) {
            if (multiplier !== 1) {
                let className = 'eff-val';
                if (multiplier > 1) className += ' weak';
                if (multiplier < 1) className += ' resist';
                if (multiplier === 0) className += ' immune';

                html += `
                    <div class="eff-item">
                        <span class="type-badge type-${type}" style="font-size: 0.7rem; padding: 2px 4px;">${getTransType(type)}</span>
                        <span class="${className}">x${multiplier}</span>
                    </div>
                `;
            }
        }
        return html;
    }

    function showTooltip(e, text) {
        let tooltip = document.getElementById('custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }
        tooltip.innerText = text;
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 'px';
        tooltip.style.top = (e.pageY - 40) + 'px'; // Position above cursor
    }

    window.hideTooltip = function () {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    };

    // Make showTooltip global
    window.showTooltip = showTooltip;
});
