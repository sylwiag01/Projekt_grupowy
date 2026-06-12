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
        explain: 'Jeden WW to zawsze równo 10 gramów węglowodan
