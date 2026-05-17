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
            { id: 'pasta', name: 'Makaron', icon: '🍝', ww: 2.5, wbt: 0.5, kcal: 140, note: 'pół szklanki ugotowanego (80g)' },
            { id: 'pizza', name: 'Pizza', icon: '🍕', ww: 3.0, wbt: 1.5, kcal: 230, note: '1 kawałek (~100g)' },
            { id: 'soup', name: 'Zupa pomidorowa', icon: '🍲', ww: 1.5, wbt: 0.5, kcal: 80, note: 'talerz z ryżem (300ml)' },
            { id: 'pierogi', name: 'Pierogi', icon: '🥟', ww: 2.5, wbt: 1.0, kcal: 180, note: '4 sztuki (~150g)' },
            { id: 'sandwich', name: 'Kanapka', icon: '🥪', ww: 2.0, wbt: 1.5, kcal: 180, note: '2 kromki z wędliną' },
            { id: 'grapes', name: 'Winogrona', icon: '🍇', ww: 2.0, wbt: 0, kcal: 90, note: 'mała kiść (~100g)' },
            { id: 'carrot', name: 'Marchewka', icon: '🥕', ww: 0.5, wbt: 0, kcal: 35, note: '1 sztuka (~80g)' },
            { id: 'fish', name: 'Paluszki rybne', icon: '🐟', ww: 1.5, wbt: 2.0, kcal: 150, note: '3 sztuki (~90g)' },
            { id: 'cocoa', name: 'Kakao', icon: '🍫', ww: 1.5, wbt: 0.5, kcal: 90, note: 'kubek z mlekiem (200ml)' },
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
            {
                label: 'Poziom 4 – Detektyw Przekąsek', emoji: '🍿',
                meal: 'przekąskę', minWW: 1, maxWW: 2, barMax: 3,
                msg: 'Ułóż lekką przekąskę z <strong>1–2 WW</strong>. To drugie śniadanie lub podwieczorek – coś małego, żeby nie być głodnym!',
                winMsg: 'Idealna przekąska! Między posiłkami wystarczy 1–2 WW. Mały zastrzyk energii bez skoku cukru – mądry wybór! 🍿',
                overMsg: 'Za dużo jak na przekąskę! Powinna być lekka – maks 2 WW. Usuń jeden produkt!',
                lowMsg: 'Jeszcze mało! Dodaj choć 1 WW, żeby zaspokoić głód między posiłkami.',
            },
            {
                label: 'Poziom 5 – Sportowiec', emoji: '⚽',
                meal: 'obiad sportowy', minWW: 5, maxWW: 6, barMax: 9,
                msg: 'Masz dziś trening! Ułóż obiad z <strong>5–6 WW</strong>. Podczas sportu spalasz więcej energii – potrzebujesz więcej węglowodanów!',
                winMsg: 'Super! Przed sportem potrzebujesz więcej WW – organizm spali je podczas treningu. Aktywność fizyczna obniża cukier, więc więcej WW to dobry pomysł! ⚽',
                overMsg: 'Za dużo! Nawet przed treningiem powyżej 6 WW to za duże obciążenie. Usuń coś i zamień na lżejszy produkt!',
                lowMsg: 'Za mało energii przed treningiem! Potrzebujesz co najmniej 5 WW. Dodaj ziemniaki, ryż albo makaron!',
            },
            {
                label: 'Poziom 6 – Urodzinowy Detektyw', emoji: '🎂',
                meal: 'posiłek na przyjęciu', minWW: 3, maxWW: 5, barMax: 8,
                msg: 'Jesteś na urodzinach! Ułóż posiłek z <strong>3–5 WW</strong>. Uwaga – pizza i ciasto mają dużo WW! Musisz wybrać mądrze.',
                winMsg: 'Brawo! Nawet na przyjęciu potrafisz liczyć WW! Możesz się bawić i jeść smacznie, ale z głową. Jesteś naprawdę mądry/a! 🎉',
                overMsg: 'Ups! Na przyjęciu łatwo przesadzić. Jeden kawałek pizzy LUB kawałek ciasta – nie oba naraz. Usuń coś!',
                lowMsg: 'Talerz za pusty! Na przyjęciu możesz zjeść troszkę więcej. Dodaj coś pysznego w granicach 3–5 WW!',
            },
            {
                label: 'Poziom 7 – EKSPERT 🔬', emoji: '🧪',
                meal: 'kolację eksperta', minWW: 2.5, maxWW: 3.0, barMax: 5,
                msg: 'TRYB EKSPERTA! Ułóż kolację z dokładnie <strong>2.5–3.0 WW</strong>. Zakres jest bardzo wąski – musisz liczyć precyzyjnie!',
                winMsg: 'NIESAMOWITE! Trafiłeś/aś w bardzo wąski zakres eksperta! To prawdziwy talent do liczenia WW – twój diabetolog byłby z ciebie bardzo dumny! 🔬',
                overMsg: 'Prawie! Przekroczyłeś/aś zakres eksperta. Nawet 0.5 WW robi różnicę – usuń coś małego!',
                lowMsg: 'Brakuje! W trybie eksperta musisz trafić dokładnie w 2.5–3.0 WW. Może dodaj marchewkę (0.5 WW)?',
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

            const bar = document.getElementById('ww-bar');
            bar.style.width = pct.toFixed(1) + '%';
            bar.className = 'ww-bar-fill' +
                (totWW > lvl.maxWW ? ' over' : totWW >= lvl.minWW ? ' ok' : '');
            bar.textContent = pct > 8 ? totWW.toFixed(1) + ' WW' : '';

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

        function logActivity(type, actScore, details) {
            const childId = (typeof CHILD_ID !== 'undefined') ? CHILD_ID : 1;
            fetch('/api/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ child_id: childId, activity_type: type, score: actScore, details }),
            }).catch(() => {});
        }

        function submitGameResult(stars) {
            fetch('/game/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stars }),
            }).catch(() => {});
        }

        function playSound(type) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const schedule = (freq, start, dur, vol = 0.3) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(vol, start);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
                    osc.start(start);
                    osc.stop(start + dur);
                };
                const t = ctx.currentTime;
                if (type === 'grandmaster') {
                    [523, 659, 784, 1047, 1319, 1047, 784, 1047, 1319, 1568].forEach((f, i) => schedule(f, t + i * 0.1, 0.5, 0.3));
                } else if (type === 'win3') {
                    [523, 659, 784, 1047, 1319].forEach((f, i) => schedule(f, t + i * 0.12, 0.45, 0.32));
                } else if (type === 'win') {
                    [523, 659, 784, 1047].forEach((f, i) => schedule(f, t + i * 0.13, 0.35, 0.28));
                } else {
                    schedule(380, t, 0.2, 0.2);
                    schedule(260, t + 0.2, 0.35, 0.2);
                }
            } catch (_) {}
        }

        function spawnConfetti(count = 35) {
            const emojis = ['⭐', '🌟', '✨', '🎉', '🎊', '💫', '🏆', '🌈'];
            const container = document.getElementById('confetti-container');
            container.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const el = document.createElement('span');
                el.className = 'confetti-piece';
                el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.left = (Math.random() * 100) + '%';
                el.style.fontSize = (14 + Math.random() * 22) + 'px';
                el.style.animationDuration = (1.2 + Math.random() * 1.6) + 's';
                el.style.animationDelay = (Math.random() * 0.7) + 's';
                container.appendChild(el);
            }
            setTimeout(() => { container.innerHTML = ''; }, 3500);
        }

        function showResult({ won, stars, totWW, totWBT, totKcal, isLast, text }) {
            const isGrandMaster = won && isLast;
            document.getElementById('r-emoji').textContent = isGrandMaster ? '👑' : won ? (stars === 3 ? '🏆' : '🎉') : '😅';
            document.getElementById('r-title').textContent = isGrandMaster ? 'WIELKI MISTRZ!' : won ? (stars === 3 ? 'Perfekcyjnie!' : 'Brawo!') : 'Prawie!';
            document.getElementById('r-title').className = 'result-title ' + (isGrandMaster ? 'grand-master' : won ? 'win' : 'lose');
            document.querySelector('.result-card').classList.toggle('grand-master', isGrandMaster);
            const starsEl = document.getElementById('r-stars');
            if (isGrandMaster) {
                starsEl.innerHTML = Array.from({ length: 7 }, (_, i) =>
                    `<span class="star-anim" style="animation-delay:${i * 0.1}s">🏆</span>`
                ).join('');
            } else if (won) {
                starsEl.innerHTML = Array.from({ length: stars }, (_, i) =>
                    `<span class="star-anim" style="animation-delay:${i * 0.15}s">⭐</span>`
                ).join('');
            } else {
                starsEl.textContent = '💪';
            }
            document.getElementById('r-text').textContent = text;
            document.getElementById('r-badge').style.display = isGrandMaster ? 'block' : 'none';

            if (won) {
                playSound(isGrandMaster ? 'grandmaster' : stars === 3 ? 'win3' : 'win');
                spawnConfetti(isGrandMaster ? 100 : stars === 3 ? 50 : 30);
            } else {
                playSound('lose');
            }
            document.getElementById('r-ww').textContent = totWW.toFixed(1);
            document.getElementById('r-wbt').textContent = totWBT.toFixed(1);
            document.getElementById('r-kcal').textContent = Math.round(totKcal);

            const btn = document.getElementById('r-btn');
            if (!won) {
                btn.textContent = '🔄 Spróbuj jeszcze raz';
                btn.onclick = () => { closeOverlay(); clearPlate(); };
            } else if (isLast) {
                btn.textContent = '🔄 Zagraj od nowa!';
                btn.onclick = () => { closeOverlay(); currentLevel = 0; initLevel(); };
            } else {
                btn.textContent = 'Następny poziom! 🚀';
                btn.onclick = nextLevel;
            }

            if (won) {
                const lvl = LEVELS[currentLevel];
                logActivity('game', stars, {
                    level: currentLevel + 1,
                    level_name: lvl.label,
                    stars,
                    ww: parseFloat(totWW.toFixed(1)),
                });
                submitGameResult(stars);
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