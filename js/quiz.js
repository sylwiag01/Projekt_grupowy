// --- ZESTAW DLA STARSZYCH (ORYGINALNY) ---
const QUESTIONS_NORMAL = [
    {
        q: 'Ile gramów węglowodanów odpowiada 1 WW?',
        answers: ['5 g', '10 g', '15 g', '20 g'],
        correct: 1,
        explain: '1 WW (wymiennik węglowodanowy) = dokładnie 10 g węglowodanów.',
    },
    {
        q: 'Co oznacza skrót WW?',
        answers: ['Wielki Węglowodor', 'Wymiennik Węglowodanowy', 'Wartość Węglowodanowa', 'Wskaźnik Ważenia'],
        correct: 1,
        explain: 'WW to Wymiennik Węglowodanowy – jednostka używana przy cukrzycy.',
    },
    {
        q: 'Co oznacza skrót WBT?',
        answers: ['Wartość Białkowa Tłuszczów', 'Wymiennik Białkowo-Tłuszczowy', 'Wskaźnik Białko-Tłuszcz', 'Wielki Białkowy Test'],
        correct: 1,
        explain: 'WBT = Wymiennik Białkowo-Tłuszczowy – uwzględnia białka i tłuszcze.',
    },
    {
        q: 'Które produkty zawierają najwięcej węglowodanów?',
        answers: ['Mięso i ryby', 'Chleb, ryż i makaron', 'Masło i olej', 'Jajka i ser'],
        correct: 1,
        explain: 'Produkty zbożowe takie jak chleb, ryż i makaron są bogate w węglowodany.',
    },
    {
        q: 'Co podnosi poziom cukru we krwi?',
        answers: ['Tłuszcze', 'Białka', 'Węglowodany', 'Witaminy'],
        correct: 2,
        explain: 'Węglowodany są głównym składnikiem podnoszącym poziom cukru (glukozy) we krwi.',
    },
    {
        q: 'Jak obliczyć WW z gramatury węglowodanów?',
        answers: ['Pomnożyć przez 10', 'Podzielić przez 10', 'Dodać 10', 'Odjąć 10'],
        correct: 1,
        explain: 'WW = gramy węglowodanów ÷ 10. Np. 30 g węglowodanów = 3 WW.',
    },
    {
        q: 'Jabłko (~150 g) ma około 22 g węglowodanów. Ile to WW?',
        answers: ['1 WW', '2,2 WW', '22 WW', '0,22 WW'],
        correct: 1,
        explain: '22 g ÷ 10 = 2,2 WW. Dobrze liczyć jabłka przy posiłkach!',
    },
    {
        q: 'Który produkt ma 0 WW (brak węglowodanów)?',
        answers: ['Banan', 'Ryż', 'Jajko', 'Chleb'],
        correct: 2,
        explain: 'Jajko nie zawiera węglowodanów, więc ma 0 WW. Ma za to WBT!',
    },
    {
        q: 'Co to jest hipoglikemia?',
        answers: ['Za wysoki poziom cukru', 'Za niski poziom cukru', 'Brak insuliny', 'Zbyt dużo WW'],
        correct: 1,
        explain: 'Hipoglikemia (niedocukrzenie) = za mało cukru we krwi, poniżej 70 mg/dl.',
    },
    {
        q: 'Co zrobić przy hipoglikemii?',
        answers: ['Wziąć insulinę', 'Zjeść coś słodkiego', 'Pójść spać', 'Wypić wodę'],
        correct: 1,
        explain: 'Szybki cukier (glukoza, sok, słodycze) podnosi poziom cukru przy niedocukrzeniu.',
    },
    {
        q: 'Ile WW powinno mieć typowe śniadanie dla dziecka z cukrzycą?',
        answers: ['0–1 WW', '1–2 WW', '3–4 WW', '8–10 WW'],
        correct: 2,
        explain: 'Śniadanie to zwykle 3–4 WW, żeby dać energię na poranek bez za dużego skoku cukru.',
    },
    {
        q: 'Banan (~120 g) ma około 25 g węglowodanów. Ile to WW?',
        answers: ['1,5 WW', '2,5 WW', '5 WW', '0,25 WW'],
        correct: 1,
        explain: '25 g ÷ 10 = 2,5 WW. Banan ma dużo cukrów – trzeba go liczyć!',
    },
    {
        q: 'Co to jest insulina?',
        answers: ['Rodzaj witaminy', 'Hormon regulujący poziom cukru', 'Rodzaj węglowodanu', 'Lek przeciwbólowy'],
        correct: 1,
        explain: 'Insulina to hormon produkowany przez trzustkę, który obniża poziom glukozy we krwi.',
    },
    {
        q: 'Ile kcal dostarcza 1 gram węglowodanów?',
        answers: ['2 kcal', '4 kcal', '7 kcal', '9 kcal'],
        correct: 1,
        explain: '1 g węglowodanów = 4 kcal. Tłuszcze mają 9 kcal/g, a białka 4 kcal/g.',
    },
    {
        q: 'Szklanka mleka (200 ml) ma ~10 g węglowodanów. Ile to WW?',
        answers: ['0,5 WW', '1 WW', '2 WW', '10 WW'],
        correct: 1,
        explain: '10 g ÷ 10 = 1 WW. Mleko ma też WBT, bo zawiera białko i tłuszcz.',
    },
    {
        q: 'Ile kilokalorii (kcal) z białka i tłuszczu odpowiada 1 WBT?',
        answers: ['50 kcal', '100 kcal', '150 kcal', '200 kcal'],
        correct: 1,
        explain: '1 WBT to porcja produktu, która dostarcza dokładnie 100 kcal pochodzących z białka i tłuszczu.',
    },
    {
        q: 'Jak nazywa się stan, w którym poziom cukru we krwi jest zbyt wysoki?',
        answers: ['Hiperglikemia', 'Hipoglikemia', 'Hipoksja', 'Glikoliza'],
        correct: 0,
        explain: 'Hiperglikemia to przecukrzenie. Wymaga podania odpowiedniej dawki insuliny lub aktywności fizycznej.',
    },
    {
        q: 'Co określa Indeks Glikemiczny (IG)?',
        answers: ['Ilość kalorii w produkcie', 'Zawartość tłuszczu w jedzeniu', 'Szybkość, z jaką produkt podnosi poziom cukru', 'Ilość witamin w jedzeniu'],
        correct: 2,
        explain: 'Indeks Glikemiczny określa, jak szybko po zjedzeniu danego produktu wzrasta poziom glukozy we krwi.',
    },
    {
        q: 'Jak wysiłek fizyczny (np. bieganie, jazda na rowerze) zazwyczaj wpływa na poziom cukru we krwi?',
        answers: ['Szybko go podnosi', 'Obniża poziom cukru', 'Nie ma żadnego wpływu', 'Zatrzymuje działanie insuliny'],
        correct: 1,
        explain: 'Wysiłek fizyczny sprawia, że mięśnie zużywają więcej glukozy, co prowadzi do obniżenia poziomu cukru we krwi.',
    },
    {
        q: 'Którą insulinę podaje się zazwyczaj bezpośrednio przed posiłkiem?',
        answers: ['Insulinę bazową (długodziałającą)', 'Insulinę szybkodziałającą', 'Nie ma to znaczenia', 'Tylko rano po przebudzeniu'],
        correct: 1,
        explain: 'Insulinę szybkodziałającą podaje się przed jedzeniem, aby pokryć skok cukru spowodowany węglowodanami z posiłku.',
    },
    {
        q: 'Co oznacza badanie HbA1c (hemoglobina glikowana)?',
        answers: ['Poziom cukru w danym momencie', 'Ilość wyprodukowanej insuliny', 'Średni poziom cukru z ostatnich 3 miesięcy', 'Ciśnienie krwi'],
        correct: 2,
        explain: 'Hemoglobina glikowana (HbA1c) to ważne badanie, które pokazuje średnie stężenie glukozy we krwi w ciągu ostatnich 2-3 miesięcy.',
    },
    {
        q: 'Jeśli Twój przelicznik to 1 jednostka insuliny na 1 WW, ile jednostek musisz podać na posiłek mający 5 WW?',
        answers: ['1 jednostkę', '2,5 jednostki', '5 jednostek', '10 jednostek'],
        correct: 2,
        explain: 'Skoro 1 WW wymaga 1 jednostki insuliny, to 5 WW wymaga podania 5 jednostek (5 x 1).',
    },
    {
        q: 'Czym charakteryzuje się cukrzyca typu 1?',
        answers: ['Brak produkcji insuliny przez trzustkę', 'Zbyt duża produkcja insuliny', 'Oporność komórek na insulinę', 'Występuje tylko u osób otyłych'],
        correct: 0,
        explain: 'W cukrzycy typu 1 układ odpornościowy niszczy komórki trzustki, przez co organizm przestaje samodzielnie produkować insulinę.',
    },
    {
        q: 'Jaki hormon działa przeciwnie do insuliny, ratując przed ciężką hipoglikemią?',
        answers: ['Adrenalina', 'Glukagon', 'Tyroksyna', 'Melatonina'],
        correct: 1,
        explain: 'Glukagon to hormon, który uwalnia zapasy glukozy z wątroby, szybko podnosząc poziom cukru we krwi.',
    },
    {
        q: 'Jaki jest prawidłowy poziom cukru we krwi na czczo u zdrowej osoby (bez cukrzycy)?',
        answers: ['70-99 mg/dl', '100-125 mg/dl', '126-150 mg/dl', 'Powyżej 150 mg/dl'],
        correct: 0,
        explain: 'Prawidłowa glikemia na czczo u zdrowego człowieka wynosi od 70 do 99 mg/dl. Powyżej tej wartości diagnozuje się stan przedcukrzycowy lub cukrzycę.'
    }
];

// --- ZESTAW DLA MŁODSZYCH DZIECI (ŁATWY JĘZYK) ---
const QUESTIONS_KIDS = [
    {
        q: 'Co oznacza skrót WW, którego używamy przy jedzeniu?',
        answers: ['Wielki Worek', 'Wymiennik Węglowodanowy', 'Wesoły Wąż', 'Woda i Witaminy'],
        correct: 1,
        explain: 'WW to Wymiennik Węglowodanowy – tak liczymy jedzenie, żeby wiedzieć, ile podać insuliny!'
    },
    {
        q: 'Ile gramów węglowodanów (cukrów) to 1 WW?',
        answers: ['5 gramów', '10 gramów', '15 gramów', '100 gramów'],
        correct: 1,
        explain: 'Jeden WW to zawsze równo 10 gramów węglowodanów. Bardzo łatwo to policzyć!'
    },
    {
        q: 'Co daje nam najwięcej energii, ale szybko podnosi cukier we krwi?',
        answers: ['Węglowodany (np. chleb, makaron)', 'Woda', 'Białko (np. mięso)', 'Tłuszcze (np. masło)'],
        correct: 0,
        explain: 'Węglowodany dają moc do zabawy, ale podnoszą cukier, więc musimy na nie podać insulinę.'
    },
    {
        q: 'Co robi insulina w Twoim ciele?',
        answers: ['Podnosi cukier we krwi', 'Działa jak kluczyk, wpuszczając cukier do komórek', 'Zmienia kolor oczu', 'Zastępuje jedzenie'],
        correct: 1,
        explain: 'Insulina to taki super-kluczyk! Otwiera komórki, żeby cukier dał Ci energię i zniknął z krwi.'
    },
    {
        q: 'Masz za niski cukier (hipoglikemia) i źle się czujesz. Co musisz szybko zrobić?',
        answers: ['Pójść spać', 'Wypić wodę', 'Zjeść lub wypić coś słodkiego (np. sok)', 'Podać więcej insuliny'],
        correct: 2,
        explain: 'Gdy cukier jest za niski, organizm woła o pomoc! Szybko zjedz lub wypij coś słodkiego, np. sok jabłkowy.'
    },
    {
        q: 'Co ma 0 WW i wcale nie podnosi szybko cukru?',
        answers: ['Banan', 'Słodki soczek', 'Chleb', 'Jajko'],
        correct: 3,
        explain: 'Jajko nie ma węglowodanów, więc nie musisz go liczyć jako WW. Prawie wcale nie podnosi cukru!'
    },
    {
        q: 'Zjadasz jabłuszko, które ma 20 gramów węglowodanów. Ile to będzie WW?',
        answers: ['1 WW', '2 WW', '3 WW', '10 WW'],
        correct: 1,
        explain: 'Super! 20 podzielone przez 10 to 2. Jabłuszko ma 2 WW.'
    },
    {
        q: 'Po co uprawiamy sport (np. biegamy po dworze)? Jak to działa na cukier?',
        answers: ['Sport podnosi cukier do nieba', 'Sport sprawia, że cukier spada', 'Sport wcale nie zmienia cukru', 'Sport to tylko zabawa'],
        correct: 1,
        explain: 'Kiedy biegasz albo grasz w piłkę, Twoje mięśnie "zjadają" cukier. Dlatego podczas zabawy cukier często spada!'
    },
    {
        q: 'Jaką insulinę podajesz sobie do posiłku (np. przed obiadem)?',
        answers: ['Tę, która działa bardzo powoli', 'Tę, która działa szybko', 'Nie podaję insuliny przed obiadem', 'Tylko tę na noc'],
        correct: 1,
        explain: 'Przed jedzeniem podajemy insulinę "szybką", żeby od razu złapała cukier, który zjesz w obiadku.'
    },
    {
        q: 'Co oznacza trudne słowo "Hiperglikemia"?',
        answers: ['Za mało cukru we krwi', 'Za dużo cukru we krwi', 'Zdrowy brzuszek', 'Super moc w nogach'],
        correct: 1,
        explain: 'Hiperglikemia to tak zwane przecukrzenie. We krwi jest za dużo cukru i trzeba podać insulinę, by go obniżyć.'
    }
];

let currentIndex = 0;
let score = 0;
let answered = false;
let questions = [];
let currentDifficulty = 'normal';

function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const schedule = (freq, start, dur, vol = 0.28) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine'; osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
            osc.start(start); osc.stop(start + dur);
        };
        const t = ctx.currentTime;
        if (type === 'correct') {
            schedule(660, t, 0.12); schedule(880, t + 0.1, 0.18);
        } else if (type === 'wrong') {
            schedule(320, t, 0.15); schedule(220, t + 0.14, 0.25);
        } else if (type === 'win3') {
            [523, 659, 784, 1047, 1319].forEach((f, i) => schedule(f, t + i * 0.12, 0.4, 0.3));
        } else if (type === 'win') {
            [523, 659, 784, 1047].forEach((f, i) => schedule(f, t + i * 0.13, 0.32, 0.26));
        }
    } catch (_) {}
}

function spawnConfetti(count = 35) {
    const emojis = ['⭐', '🌟', '✨', '🎉', '🎊', '💫', '🏆', '🧠', '🌈'];
    const container = document.getElementById('confetti-container');
    if (!container) return;
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

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startQuiz(difficulty = 'normal') {
    currentDifficulty = difficulty;
    
    const startMenu = document.getElementById('start-menu');
    if (startMenu) startMenu.style.display = 'none';
    
    const sourceQuestions = (difficulty === 'kids') ? QUESTIONS_KIDS : QUESTIONS_NORMAL;
    
    questions = shuffle([...sourceQuestions]).slice(0, 10); 
    currentIndex = 0;
    score = 0;
    answered = false;
    
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('back-btn').style.display = 'inline-block';
    
    renderQuestion();
}

function renderQuestion() {
    answered = false;
    const q = questions[currentIndex];
    const total = questions.length;

    document.getElementById('q-counter').textContent = `Pytanie ${currentIndex + 1} z ${total}`;
    document.getElementById('score-live').textContent = score;
    document.getElementById('progress-bar').style.width = `${(currentIndex / total) * 100}%`;
    document.getElementById('question-text').textContent = q.q;
    document.getElementById('feedback-text').textContent = '';
    document.getElementById('next-btn').style.display = 'none';

    const shuffledAnswers = shuffle(q.answers.map((text, idx) => ({ text, idx })));

    document.getElementById('answers-container').innerHTML = shuffledAnswers.map(a => `
        <button class="answer-btn" onclick="selectAnswer(this, ${a.idx === q.correct})">
            ${a.text}
        </button>
    `).join('');
}

function selectAnswer(btn, isCorrect) {
    if (answered) return;
    answered = true;

    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    if (isCorrect) {
        btn.classList.add('correct');
        score++;
        playSound('correct');
        const scoreLive = document.getElementById('score-live');
        scoreLive.textContent = score;
        scoreLive.style.animation = 'none';
        scoreLive.offsetHeight;
        scoreLive.style.animation = 'popInBounce .35s cubic-bezier(.34,1.56,.64,1)';
        document.getElementById('feedback-text').innerHTML =
            `<span style="color:var(--green-dk)">🎉 Brawo! ${questions[currentIndex].explain}</span>`;
    } else {
        btn.classList.add('wrong');
        playSound('wrong');
        document.getElementById('feedback-text').innerHTML =
            `<span style="color:var(--red)">😅 Nie tym razem. ${questions[currentIndex].explain}</span>`;
        const correctText = questions[currentIndex].answers[questions[currentIndex].correct];
        document.querySelectorAll('.answer-btn').forEach(b => {
            if (b.textContent.trim() === correctText) b.classList.add('correct');
        });
    }

    const nextBtn = document.getElementById('next-btn');
    nextBtn.textContent = currentIndex === questions.length - 1 ? 'Zobacz wyniki 🏆' : 'Następne pytanie →';
    nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= questions.length) {
        showResults();
    } else {
        renderQuestion();
    }
}

function logActivity(type, actScore, details) {
    const childId = (typeof CHILD_ID !== 'undefined') ? CHILD_ID : 1;
    fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, activity_type: type, score: actScore, details }),
    }).catch(() => {});
}

function submitQuizResult(correctAnswers) {
    fetch('/quiz/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correct_answers: correctAnswers }),
    }).catch(() => {});
}

function showResults() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';

    const total = questions.length;
    const pct = score / total;

    logActivity('quiz', Math.round(pct * 100), { correct: score, total, difficulty: currentDifficulty });
    submitQuizResult(score);

    let emoji, msg, sub;
    if      (pct === 1)   { emoji = '🏆'; msg = 'Idealny wynik! Jesteś mistrzem WW!';   sub = 'Wszystkie odpowiedzi poprawne – niesamowite!'; }
    else if (pct >= 0.8)  { emoji = '🎉'; msg = 'Świetnie Ci poszło!';                  sub = 'Jeszcze trochę ćwiczeń i będziesz mistrzem!'; }
    else if (pct >= 0.6)  { emoji = '😊'; msg = 'Dobry wynik!';                         sub = 'Wiesz już sporo – powtórz i spróbuj jeszcze raz!'; }
    else if (pct >= 0.4)  { emoji = '🤔'; msg = 'Nieźle, ale możesz lepiej!';           sub = 'Przeczytaj objaśnienia i zagraj ponownie.'; }
    else                  { emoji = '💪'; msg = 'Nie poddawaj się!';                    sub = 'Każda próba to nauka – spróbuj jeszcze raz!'; }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-score').textContent = `${score} / ${total}`;
    document.getElementById('result-msg').textContent = msg;
    document.getElementById('result-sub').textContent = sub;

    const starsEl = document.getElementById('result-stars');
    if (score > 0) {
        starsEl.innerHTML = Array.from({ length: score }, (_, i) =>
            `<span class="star-anim" style="animation-delay:${i * 0.08}s">⭐</span>`
        ).join('');
    } else {
        starsEl.textContent = '—';
    }

    if (pct >= 0.8) {
        playSound(pct === 1 ? 'win3' : 'win');
        spawnConfetti(pct === 1 ? 55 : 35);
    }
}
