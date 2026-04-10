  const FOODS = [
            { id: 'bread', name: 'Chleb razowy', icon: '🍞', ww: 1.0, wbt: 0.5, kcal: 70, note: '1 kromka (30g)' },
            { id: 'apple', name: 'Jabłko', icon: '🍎', ww: 1.5, wbt: 0, kcal: 80, note: '1 sztuka (~150g)' },
            { id: 'milk', name: 'Mleko', icon: '🥛', ww: 1.0, wbt: 1.0, kcal: 60, note: 'szklanka (200ml)' },
            { id: 'egg', name: 'Jajko', icon: '🥚', ww: 0, wbt: 1.5, kcal: 75, note: '1 sztuka' },
            { id: 'potato', name: 'Ziemniaki', icon: '🥔', ww: 2.0, wbt: 0, kcal: 120, note: '1 sztuka (~150g)' },
            { id: 'banana', name: 'Banan', icon: '🍌', ww: 2.5, wbt: 0, kcal: 110, note: '1 sztuka (~120g)' },
            { id: 'rice', name: 'Ryż', icon: '🍚', ww: 2.0, wbt: 0.5, kcal: 130, note: 'pół szklanki' },
            { id: 'cheese', name: 'Ser żółty', icon: '🧀', ww: 0, wbt: 2.0, kcal: 90, note: '2 plasterki (30g)' },
            { id: 'yogurt', name: 'Jogurt', icon: '🫙', ww: 1.0, wbt: 1.5, kcal: 65, note: 'kubeczek (150g)' },
            { id: 'orange', name: 'Pomarańcza', icon: '🍊', ww: 1.5, wbt: 0, kcal: 70, note: '1 sztuka (~150g)' },
            { id: 'oats', name: 'Płatki owsiane', icon: '🥣', ww: 3.0, wbt: 1.0, kcal: 150, note: 'pół szklanki (40g)' },
            { id: 'chicken', name: 'Kurczak', icon: '🍗', ww: 0, wbt: 3.0, kcal: 165, note: '1 kawałek (100g)' },
        ];

        const LEVELS = [
            {
                label: 'Poziom 1 – Odkrywca', emoji: '🕵️',
                meal: 'śniadanie', minWW: 3, maxWW: 4, barMax: 6,
                msg: 'Ułóż śniadanie z dokładnie <strong>3–4 WW</strong>. Klikaj produkty, żeby je dodać na talerz!',
                winMsg: 'Brawo! Idealne śniadanie! Tyle WW wystarczy, żeby mieć energię do szkoły bez za dużego skoku cukru. 🌟',
                overMsg: 'Odrobinę za dużo! Przy cukrzycy liczymy WW, bo każdy wymiennik to 10g węglowodanów, które podnoszą cukier we krwi. Usuń jeden produkt!',
                lowMsg: 'Jeszcze mało energii! Śniadanie powinno mieć co najmniej 3 WW, żebyś miał(a) siłę do szkoły. Dodaj coś!',
            },
            {
                label: 'Poziom 2 – Eksplorator', emoji: '🧭',
                meal: 'obiad', minWW: 4, maxWW: 5, barMax: 8,
                msg: 'Ułóż obiad z <strong>4–5 WW</strong>. Obiad to największy posiłek dnia – możesz zjeść więcej!',
                winMsg: 'Idealne! Obiad z 4–5 WW daje energię na całe popołudnie. Widzisz jak WBT też się liczy? To białko i tłuszcz – one też trochę podnoszą cukier, ale wolniej! 🍽️',
                overMsg: 'Za dużo! Pamiętaj: za dużo WW naraz to za dużo cukru we krwi. Zamień jeden ciężki produkt na lżejszy!',
                lowMsg: 'Obiad za mały! Potrzebujesz co najmniej 4 WW. Może ziemniaki albo ryż?',
            },
            {
                label: 'Poziom 3 – Mistrz WW 🏆', emoji: '🌙',
                meal: 'kolację', minWW: 2, maxWW: 3, barMax: 5,
                msg: 'Ułóż <strong>lekką kolację z 2–3 WW</strong>. Wieczorem jemy mniej węglowodanów – to ważne przy cukrzycy!',
                winMsg: 'Doskonale! Lekka kolacja to mądry wybór wieczorem. Podczas snu potrzebujemy mniej energii, a mniej WW = stabilniejszy cukier przez noc. Jesteś mistrzem! 🏆',
                overMsg: 'Za ciężko na kolację! Wieczorem organizm potrzebuje mniej węglowodanów, bo nie biegamy już aktywnie. Wybierz lżejsze produkty!',
                lowMsg: 'Kolacja potrzebuje choć 2 WW, żebyś miał(a) siłę do rana. Dodaj jeszcze coś lekkiego!',
            },
        ];

        let currentLevel = 0;
        let plate = [];
        let totalStars = 0;

        function init() {
            renderLevelDots();
            renderFoods();
            initLevel();
        }

        function initLevel() {
            plate = [];
            const lvl = LEVELS[currentLevel];
            document.getElementById('level-label').textContent = lvl.label;
            document.getElementById('mission-emoji').textContent = lvl.emoji;
            document.getElementById('mission-text').innerHTML = lvl.msg;
            document.getElementById('bar-target-label').textContent = `Cel: ${lvl.minWW}–${lvl.maxWW} WW`;
            document.getElementById('bar-max-label').textContent = `${lvl.barMax} WW`;

            const limitPct = (lvl.maxWW / lvl.barMax) * 100;
            document.getElementById('ww-limit-line').style.left = limitPct + '%';

            renderPlate();
            renderStats();
            setFeedback('default', '👆', 'Dodaj produkty na talerz, żeby zobaczyć wynik!');
            renderLevelDots();
        }

        function renderFoods() {
            document.getElementById('food-grid').innerHTML = FOODS.map(f => `
    <div class="food-item" onclick="addFood('${f.id}')">
      <span class="food-icon">${f.icon}</span>
      <span class="food-name">${f.name}</span>
      <span class="food-ww">${f.ww} WW</span>
      <div class="tooltip">${f.note}</div>
    </div>
  `).join('');
        }

        function renderPlate() {
            const area = document.getElementById('plate-area');
            const empty = document.getElementById('plate-empty');
            if (plate.length === 0) {
                area.innerHTML = '<div class="plate-empty" id="plate-empty">Pusto! Dodaj coś 👆</div>';
                return;
            }
            area.innerHTML = plate.map(item => `
    <div class="plate-item">
      <span class="p-icon">${item.icon}</span>
      <span>${item.name}</span>
      <button class="remove-btn" onclick="removeFood(${item.uid})" title="Usuń">✕</button>
    </div>
  `).join('');
        }

        function renderStats() {
            const totWW = plate.reduce((s, i) => s + i.ww, 0);
            const totWBT = plate.reduce((s, i) => s + i.wbt, 0);
            const totKcal = plate.reduce((s, i) => s + i.kcal, 0);
            const lvl = LEVELS[currentLevel];
            const pct = Math.min(100, (totWW / lvl.barMax) * 100);

            /* bar */
            const bar = document.getElementById('ww-bar');
            bar.style.width = pct.toFixed(1) + '%';
            bar.className = 'ww-bar-fill' +
                (totWW > lvl.maxWW ? ' over' : totWW >= lvl.minWW ? ' ok' : '');
            bar.textContent = pct > 8 ? totWW.toFixed(1) + ' WW' : '';

            /* stats */
            const wwEl = document.getElementById('stat-ww');
            wwEl.textContent = totWW.toFixed(1);
            wwEl.className = 'stat-val' + (totWW > lvl.maxWW ? ' over' : totWW >= lvl.minWW ? ' ok' : '');

            document.getElementById('stat-wbt').textContent = totWBT.toFixed(1);
            document.getElementById('stat-kcal').textContent = Math.round(totKcal);

            if (plate.length === 0) {
                setFeedback('default', '👆', 'Dodaj produkty na talerz, żeby zobaczyć wynik!');
            } else if (totWW > lvl.maxWW) {
                setFeedback('over', '⚠️', `Za dużo! Masz <strong>${totWW.toFixed(1)} WW</strong>, a limit to ${lvl.maxWW} WW. Usuń coś z talerza!`);
            } else if (totWW < lvl.minWW) {
                setFeedback('warn', '🤔', `Jeszcze mało – masz <strong>${totWW.toFixed(1)} WW</strong>. Potrzebujesz co najmniej ${lvl.minWW} WW. Dodaj coś!`);
            } else {
                setFeedback('ok', '😊', `Świetnie! Masz <strong>${totWW.toFixed(1)} WW</strong> – mieścisz się w limicie ${lvl.minWW}–${lvl.maxWW} WW. Kliknij "Sprawdź wynik"!`);
            }
        }

        function renderLevelDots() {
            document.getElementById('level-dots').innerHTML = LEVELS.map((l, i) => `
    <div class="level-dot ${i < currentLevel ? 'done' : i === currentLevel ? 'active' : ''}"></div>
  `).join('');
            document.getElementById('total-stars').textContent = totalStars;
        }

        function setFeedback(type, icon, html) {
            const box = document.getElementById('feedback-box');
            const text = document.getElementById('feedback-text');
            box.className = 'feedback-box ' + (type === 'ok' ? 'ok' : type === 'over' ? 'over' : type === 'warn' ? 'warn' : '');
            document.querySelector('.feedback-icon').textContent = icon;
            text.innerHTML = html;
        }

        function addFood(id) {
            const f = FOODS.find(x => x.id === id);
            if (!f) return;
            if (plate.length >= 8) {
                setFeedback('warn', '😅', 'Talerz jest pełny! Usuń coś, żeby dodać nowe produkty.');
                return;
            }
            plate.push({ ...f, uid: Date.now() + Math.random() });
            renderPlate();
            renderStats();
        }

        function removeFood(uid) {
            plate = plate.filter(x => x.uid !== uid);
            renderPlate();
            renderStats();
        }

        function clearPlate() {
            plate = [];
            renderPlate();
            renderStats();
        }

        function checkMission() {
            const totWW = plate.reduce((s, i) => s + i.ww, 0);
            const totWBT = plate.reduce((s, i) => s + i.wbt, 0);
            const totKcal = plate.reduce((s, i) => s + i.kcal, 0);
            const lvl = LEVELS[currentLevel];
            const isLast = currentLevel === LEVELS.length - 1;

            if (plate.length === 0) {
                setFeedback('warn', '😊', 'Talerz jest pusty! Dodaj najpierw jakieś produkty.');
                return;
            }

            const won = totWW >= lvl.minWW && totWW <= lvl.maxWW;

            /* stars */
            let stars = 0;
            if (won) {
                const margin = lvl.maxWW - totWW;
                stars = margin <= 0.5 ? 3 : margin <= 1 ? 2 : 1;
                totalStars += stars;
            }

            showResult({
                won, stars, totWW, totWBT, totKcal, isLast,
                text: won
                    ? lvl.winMsg
                    : (totWW > lvl.maxWW ? lvl.overMsg : lvl.lowMsg),
            });
        }

        function showResult({ won, stars, totWW, totWBT, totKcal, isLast, text }) {
            document.getElementById('r-emoji').textContent = won ? (stars === 3 ? '🏆' : '🎉') : '😅';
            document.getElementById('r-title').textContent = won ? (stars === 3 ? 'Perfekcyjnie!' : 'Brawo!') : 'Prawie!';
            document.getElementById('r-title').className = 'result-title ' + (won ? 'win' : 'lose');
            document.getElementById('r-stars').textContent = won ? '⭐'.repeat(stars) : '💪';
            document.getElementById('r-text').textContent = text;
            document.getElementById('r-ww').textContent = totWW.toFixed(1);
            document.getElementById('r-wbt').textContent = totWBT.toFixed(1);
            document.getElementById('r-kcal').textContent = Math.round(totKcal);

            const btn = document.getElementById('r-btn');
            if (!won) {
                btn.textContent = '🔄 Spróbuj jeszcze raz';
                btn.onclick = () => { closeOverlay(); clearPlate(); };
            } else if (isLast) {
                btn.textContent = '🏁 Zagraj od nowa!';
                btn.onclick = () => { closeOverlay(); currentLevel = 0; initLevel(); };
            } else {
                btn.textContent = 'Następny poziom! 🚀';
                btn.onclick = nextLevel;
            }

            document.getElementById('overlay').classList.add('show');
        }

        function nextLevel() {
            closeOverlay();
            currentLevel++;
            initLevel();
        }

        function closeOverlay(e) {
            if (!e || e.target === document.getElementById('overlay')) {
                document.getElementById('overlay').classList.remove('show');
            }
        }

        init();