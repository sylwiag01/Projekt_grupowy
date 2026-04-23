const QUESTIONS = [
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
];

let currentIndex = 0;
let score = 0;
let answered = false;
let questions = [];

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startQuiz() {
    questions = shuffle([...QUESTIONS]);
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
        document.getElementById('score-live').textContent = score;
        document.getElementById('feedback-text').innerHTML =
            `<span style="color:var(--green-dk)">🎉 Brawo! ${questions[currentIndex].explain}</span>`;
    } else {
        btn.classList.add('wrong');
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

function showResults() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';

    const total = questions.length;
    const pct = score / total;

    let emoji, msg, sub;
    if      (pct === 1)   { emoji = '🏆'; msg = 'Idealny wynik! Jesteś mistrzem WW!';   sub = 'Wszystkie odpowiedzi poprawne – niesamowite!'; }
    else if (pct >= 0.8)  { emoji = '🎉'; msg = 'Świetnie Ci poszło!';                  sub = 'Jeszcze trochę ćwiczeń i będziesz mistrzem!'; }
    else if (pct >= 0.6)  { emoji = '😊'; msg = 'Dobry wynik!';                         sub = 'Wiesz już sporo – powtórz i spróbuj jeszcze raz!'; }
    else if (pct >= 0.4)  { emoji = '🤔'; msg = 'Nieźle, ale możesz lepiej!';           sub = 'Przeczytaj objaśnienia i zagraj ponownie.'; }
    else                  { emoji = '💪'; msg = 'Nie poddawaj się!';                    sub = 'Każda próba to nauka – spróbuj jeszcze raz!'; }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-score').textContent = `${score} / ${total}`;
    document.getElementById('result-stars').textContent = '⭐'.repeat(score) || '—';
    document.getElementById('result-msg').textContent = msg;
    document.getElementById('result-sub').textContent = sub;
}

startQuiz();
