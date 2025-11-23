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

    // State
    let allPokemon = [];
    let typeChart = {};
    let currentFilter = 'all';
    let currentFlashcardIndex = 0;
    let gameScore = 0;
    let gameStreak = 0;
    let currentGameType = null;

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
        renderPokemon(allPokemon);
        renderFilters();
        renderTypeExplorer();
        setupEventListeners();

        // Preload first flashcard if data exists
        if (allPokemon.length > 0) {
            loadFlashcard(0);
        }
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

            const typesHtml = p.types.map(t =>
                `<span class="type-badge type-${t}">${t}</span>`
            ).join('');

            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="pokemon-img" loading="lazy">
                <div class="pokemon-id">#${p.id}</div>
                <div class="pokemon-name">${p.name}</div>
                <div class="pokemon-types">${typesHtml}</div>
            `;
            grid.appendChild(card);
        });
    }

    function renderFilters() {
        const types = Object.keys(typeChart);
        filterBar.innerHTML = `<span class="filter-badge active" data-type="all">全部 (All)</span>`;

        types.forEach(type => {
            const badge = document.createElement('span');
            badge.className = `filter-badge type-${type}`;
            badge.innerText = type;
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
            filtered = filtered.filter(p =>
                p.name.includes(searchTerm) ||
                p.types.some(t => t.includes(searchTerm)) ||
                p.id.includes(searchTerm)
            );
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
        // Ensure elements exist before setting properties
        if (fcImg) fcImg.src = p.image;
        if (fcName) fcName.innerText = p.name;
        if (fcNameBack) fcNameBack.innerText = `#${p.id} ${p.name}`;

        if (fcTypes) {
            // Generate types with tooltip data for hover
            fcTypes.innerHTML = p.types.map(t => {
                // Calculate what this specific type is weak to (Defensive)
                const weakTo = [];
                Object.keys(typeChart).forEach(attacker => {
                    if (typeChart[attacker][t] > 1) weakTo.push(attacker);
                });
                const tooltipText = weakTo.length > 0 ? `Weak to: ${weakTo.join(', ')}` : 'No Weaknesses';

                // Use onmouseenter/leave for JS tooltip to avoid overflow clipping
                return `<span class="type-badge type-${t}" onmouseenter="showTooltip(event, '${tooltipText}')" onmouseleave="hideTooltip()">${t}</span>`;
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
            questionHtml = `
                <div class="game-question">
                    <img src="${p.image}" alt="Pokemon">
                    <h3>${p.name} 的属性是? (What is the type?)</h3>
                    <p style="font-size: 0.9rem; color: #888;">Select ALL correct types</p>
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

            questionHtml = `
                <div class="game-question">
                    <img src="${p.image}" alt="Pokemon">
                    <h3>什么属性克制 ${p.name}? (What is effective against ${p.name}?)</h3>
                    <p style="font-size: 0.9rem; color: #888;">Select ALL correct types</p>
                </div>
            `;

            // Show all types to make it harder/standardized, or a subset?
            // User said "works the same as the updated weakness minigame" which had 4 options.
            // But user also said "submit answer and next question button...".
            // Let's use ALL types for consistency if we are doing multi-select style submission.
            // Or keep 4 options but require Submit.
            // Let's use ALL types for a "Master" feel, or maybe 6-9 options?
            // Let's stick to ALL types for consistency with the "Type" game and "Strong" game.
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

            questionHtml = `
                <div class="game-question">
                    <img src="${p.image}" alt="Pokemon">
                    <h3>${p.name} 克制什么属性? (What is ${p.name} strong against?)</h3>
                    <p style="font-size: 0.9rem; color: #888;">Select ALL correct types</p>
                </div>
            `;
            options = allTypes;
            document.getElementById('game-controls').classList.remove('hidden');
        }

        const optionsHtml = options.map(opt =>
            `<button class="option-btn type-${opt}" onclick="handleOptionClick(this, '${opt}')">${opt}</button>`
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
            `<span class="type-badge type-${t}">${t}</span>`
        ).join('');

        const weakHtml = weakTypes.length > 0 ? weakTypes.map(t => {
            const mult = weaknesses[t];
            return `<span class="type-badge type-${t}" style="margin: 2px;">${t} <small>x${mult}</small></span>`;
        }).join('') : '<span>None</span>';

        const immuneHtml = immuneTypes.length > 0 ? immuneTypes.map(t =>
            `<span class="type-badge type-${t}" style="margin: 2px; opacity: 0.7;">${t} <small>x0</small></span>`
        ).join('') : '<span>None</span>';

        let feedbackTitle = isCorrect ? '<h3 style="color:#7AC74C">Correct!</h3>' : '<h3 style="color:#FF69B4">Wrong!</h3>';

        const feedbackDiv = document.createElement('div');
        feedbackDiv.id = 'game-feedback';
        feedbackDiv.className = 'game-feedback';
        feedbackDiv.innerHTML = `
            <div class="feedback-content">
                ${feedbackTitle}
                <h4>${p.name}</h4>
                <div class="feedback-row">
                    <span>Types:</span>
                    <div class="feedback-badges">${typesHtml}</div>
                </div>
                <div class="feedback-row">
                    <span>Weak To:</span>
                    <div class="feedback-badges">${weakHtml}</div>
                </div>
                <div class="feedback-row">
                    <span>Immune To:</span>
                    <div class="feedback-badges">${immuneHtml}</div>
                </div>
            </div>
            <button id="next-question-btn" class="action-btn" onclick="nextGameQuestion()">Next Question ➔</button>
        `;

        gameContent.appendChild(feedbackDiv);
        feedbackDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Cheatsheet View (Type Explorer) ---
    function renderTypeExplorer() {
        // New Layout: Central Column Info Graph
        // [Weak To] -- [TYPE] -- [Strong Against]
        // Render all 18 rows

        const types = Object.keys(typeChart);

        // Create container for the graph
        const graphContainer = document.createElement('div');
        graphContainer.className = 'cheatsheet-graph';

        // Header Row
        const header = document.createElement('div');
        header.className = 'cs-row cs-header';
        header.innerHTML = `
            <div class="cs-col cs-left">Weak To (Defensive)</div>
            <div class="cs-col cs-center">Type</div>
            <div class="cs-col cs-right">Strong Against (Offensive)</div>
        `;
        graphContainer.appendChild(header);

        types.forEach(type => {
            // 1. Defensive: What is this type Weak To?
            // (i.e. Attacker where typeChart[Attacker][type] > 1)
            const weakTo = [];
            const immuneTo = [];
            types.forEach(attacker => {
                const mult = typeChart[attacker][type];
                if (mult > 1) weakTo.push(attacker);
                if (mult === 0) immuneTo.push(attacker);
            });

            // 2. Offensive: What is this type Strong Against?
            // (i.e. Defender where typeChart[type][Defender] > 1)
            const strongAgainst = [];
            const noEffectAgainst = [];
            types.forEach(defender => {
                const mult = typeChart[type][defender];
                if (mult > 1) strongAgainst.push(defender);
                if (mult === 0) noEffectAgainst.push(defender);
            });

            const row = document.createElement('div');
            row.className = 'cs-row';

            const weakHtml = weakTo.map(t => `<span class="mini-badge type-${t}">${t}</span>`).join('');
            const immuneHtml = immuneTo.length > 0 ? `<div class="cs-immune">⛔ ${immuneTo.map(t => t).join(', ')}</div>` : '';

            const strongHtml = strongAgainst.map(t => `<span class="mini-badge type-${t}">${t}</span>`).join('');
            const noEffectHtml = noEffectAgainst.length > 0 ? `<div class="cs-immune">⛔ ${noEffectAgainst.map(t => t).join(', ')}</div>` : '';

            row.innerHTML = `
                <div class="cs-col cs-left">
                    <div class="cs-badges">${weakHtml || '-'}</div>
                    ${immuneHtml}
                </div>
                <div class="cs-col cs-center">
                    <span class="type-badge type-${type} main-type">${type}</span>
                </div>
                <div class="cs-col cs-right">
                    <div class="cs-badges">${strongHtml || '-'}</div>
                    ${noEffectHtml}
                </div>
            `;
            graphContainer.appendChild(row);
        });

        explorerTypes.innerHTML = ''; // Clear old selector
        explorerTypes.appendChild(graphContainer);
        explorerResults.classList.add('hidden'); // Hide old results container
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
            `<span class="type-badge type-${t}">${t}</span>`
        ).join('');

        modalBody.innerHTML = `
            <div class="detail-header">
                <img src="${pokemon.image}" alt="${pokemon.name}" class="detail-img">
                <div>
                    <h2>#${pokemon.id} ${pokemon.name}</h2>
                    <div class="pokemon-types" style="justify-content: flex-start; margin-top: 0.5rem;">${typesHtml}</div>
                </div>
            </div>
            <div class="effectiveness-section">
                <h3>属性相性 (Type Effectiveness)</h3>
                <div class="eff-grid">
                    ${renderWeaknessesHtml(weaknesses) || '<p>无特别相性 (No special effectiveness)</p>'}
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
                        <span class="type-badge type-${type}" style="font-size: 0.7rem; padding: 2px 4px;">${type}</span>
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
