let allMeals = [];
const mealDateMap = {};

function localDateKey(isoStr) {
    const d = new Date(isoStr);
    return d.getFullYear() + '-'
        + String(d.getMonth() + 1).padStart(2, '0') + '-'
        + String(d.getDate()).padStart(2, '0');
}

function formatDate(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(isoStr) {
    return new Date(isoStr).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

function todayKey() { return localDateKey(new Date().toISOString()); }

function fmt(val, unit = '') {
    return (val !== null && val !== undefined) ? `${val}${unit}` : '—';
}

function pluralPosilek(n) {
    return n === 1 ? 'posiłek' : n < 5 ? 'posiłki' : 'posiłków';
}

function progBar(value, target, label) {
    if (!target) return '';
    const pct = Math.min(Math.round((value / target) * 100), 999);
    const barPct = Math.min(pct, 100);
    const cls = pct > 100 ? 'over' : 'ok';
    return `<div class="prog-row">
        <span style="font-size:.7rem;font-weight:600;width:32px;color:#555">${label}</span>
        <div class="prog-bar-bg"><div class="prog-bar-fill ${cls}" style="width:${barPct}%"></div></div>
        <span class="prog-pct ${cls}">${pct}%</span>
    </div>`;
}

function pillsHtml(cal, bestWw, bestWbt) {
    return `<span class="stat-pill kcal"><i class="fas fa-fire-alt"></i>&nbsp;${Math.round(cal)}&nbsp;<span class="label">kcal</span></span>
            <span class="stat-pill ww"><i class="fas fa-seedling"></i>&nbsp;${bestWw.toFixed(1)}&nbsp;<span class="label">WW</span></span>
            <span class="stat-pill wbt"><i class="fas fa-drumstick-bite"></i>&nbsp;${bestWbt.toFixed(1)}&nbsp;<span class="label">WBT</span></span>`;
}

function calcDayTotals(dateKey) {
    const dayMeals = allMeals.filter(m => mealDateMap[m.id] === dateKey);
    let sumCal = 0, sumWw = 0, sumWbt = 0, sumBestWw = 0, sumBestWbt = 0, correctedCount = 0;
    for (const m of dayMeals) {
        sumCal  += m.calories || 0;
        sumWw   += m.ww  || 0;
        sumWbt  += m.wbt || 0;
        const hasActualWw  = m.actual_ww  !== null && m.actual_ww  !== undefined;
        const hasActualWbt = m.actual_wbt !== null && m.actual_wbt !== undefined;
        sumBestWw  += hasActualWw  ? m.actual_ww  : (m.ww  || 0);
        sumBestWbt += hasActualWbt ? m.actual_wbt : (m.wbt || 0);
        if (hasActualWw || hasActualWbt) correctedCount++;
    }
    return { sumCal, sumWw, sumWbt, sumBestWw, sumBestWbt, correctedCount, count: dayMeals.length };
}

function refreshDaySummary(dateKey) {
    const { sumCal, sumWw, sumWbt, sumBestWw, sumBestWbt, correctedCount, count } = calcDayTotals(dateKey);
    const collapseId = `day-${dateKey.replace(/-/g, '')}`;

    const pills = document.getElementById(`pills-${collapseId}`);
    if (pills) pills.innerHTML = pillsHtml(sumCal, sumBestWw, sumBestWbt);

    const sumRow = document.getElementById(`sum-row-${collapseId}`);
    if (sumRow) sumRow.outerHTML = renderSummaryRow(sumCal, sumWw, sumWbt, sumBestWw, sumBestWbt, correctedCount, count, collapseId);
}

function renderSummaryRow(cal, childWw, childWbt, bestWw, bestWbt, correctedCount, count, collapseId) {
    const hasCorrections = correctedCount > 0;
    const correctionNote = hasCorrections
        ? `<div style="font-size:.7rem;color:#1565c0;font-weight:500;margin-top:.2rem">
               <i class="fas fa-pen-to-square me-1"></i>uwzględniono korektę rodzica (${correctedCount} ${pluralPosilek(correctedCount)})
           </div>`
        : '';

    const bars = TARGETS
        ? `<div class="prog-wrap">
               ${progBar(Math.round(cal), TARGETS.kcal, 'kcal')}
               ${progBar(bestWw, TARGETS.ww, 'WW')}
               ${progBar(bestWbt, TARGETS.wbt, 'WBT')}
           </div>`
        : '';

    return `<tr class="daily-summary" id="sum-row-${collapseId}">
        <td colspan="2">
            <div class="summary-label"><i class="fas fa-calculator me-1"></i>Suma dnia &mdash; ${count} ${pluralPosilek(count)}</div>
            ${bars}
        </td>
        <td>
            <span class="val-cal">${Math.round(cal)} kcal</span>
            ${TARGETS ? `<div style="font-size:.72rem;color:#9aa5b4;font-weight:400">cel: ${TARGETS.kcal}</div>` : ''}
        </td>
        <td>
            <span class="val-ww">${bestWw.toFixed(1)} WW</span>
            <span class="text-muted mx-1">/</span>
            <span class="val-wbt">${bestWbt.toFixed(1)} WBT</span>
            ${TARGETS ? `<div style="font-size:.72rem;color:#9aa5b4;font-weight:400">cel: ${TARGETS.ww} WW / ${TARGETS.wbt} WBT</div>` : ''}
            ${correctionNote}
        </td>
        <td>
            ${hasCorrections
                ? `<span style="font-size:.78rem;color:#6c757d">
                       dziecko: <span class="val-ww">${childWw.toFixed(1)} WW</span>
                       / <span class="val-wbt">${childWbt.toFixed(1)} WBT</span>
                   </span>`
                : `<span class="actual-empty">Brak korekt rodzica</span>`}
        </td>
    </tr>`;
}

function renderMealRow(m) {
    const hasActual = m.actual_ww !== null || m.actual_wbt !== null;
    const displayHtml = hasActual
        ? `<span class="actual-display">${fmt(m.actual_ww, ' WW')} / ${fmt(m.actual_wbt, ' WBT')}</span>`
        : `<span class="actual-empty">Nie uzupełniono</span>`;

    return `<tr id="row-${m.id}">
        <td><span class="meal-time"><i class="fas fa-clock me-1 text-muted"></i>${formatTime(m.timestamp)}</span></td>
        <td><div class="meal-name">${esc(m.meal_name)}</div></td>
        <td><span class="val-cal">${fmt(m.calories, ' kcal')}</span></td>
        <td>
            <span class="val-ww">${fmt(m.ww, ' WW')}</span>
            <span class="text-muted mx-1">/</span>
            <span class="val-wbt">${fmt(m.wbt, ' WBT')}</span>
        </td>
        <td>
            <div class="mb-1" id="display-${m.id}">${displayHtml}</div>
            <div class="d-flex align-items-center gap-2 flex-wrap">
                <input type="number" id="aww-${m.id}" class="form-control form-control-sm actual-input"
                       value="${m.actual_ww ?? ''}" step="0.1" min="0" placeholder="WW">
                <input type="number" id="awbt-${m.id}" class="form-control form-control-sm actual-input"
                       value="${m.actual_wbt ?? ''}" step="0.1" min="0" placeholder="WBT">
                <button class="btn btn-outline-success btn-sm" onclick="saveActual(${m.id})" title="Zapisz">
                    <i class="fas fa-save"></i>
                </button>
                <i class="fas fa-check-circle save-ok" id="saved-${m.id}" style="display:none"></i>
            </div>
        </td>
    </tr>`;
}

function renderDays(meals) {
    const groups = {};
    for (const m of meals) {
        const key = localDateKey(m.timestamp);
        (groups[key] = groups[key] || []).push(m);
        mealDateMap[m.id] = key;
    }
    const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    const today = todayKey();
    const container = document.getElementById('days-container');
    container.innerHTML = '';

    sortedKeys.forEach((dateKey, idx) => {
        const dayMeals = groups[dateKey];
        const isToday = dateKey === today;

        let sumCal = 0, sumWw = 0, sumWbt = 0, sumBestWw = 0, sumBestWbt = 0;
        let correctedCount = 0;
        for (const m of dayMeals) {
            sumCal  += m.calories || 0;
            sumWw   += m.ww  || 0;
            sumWbt  += m.wbt || 0;
            const hasActualWw  = m.actual_ww  !== null && m.actual_ww  !== undefined;
            const hasActualWbt = m.actual_wbt !== null && m.actual_wbt !== undefined;
            sumBestWw  += hasActualWw  ? m.actual_ww  : (m.ww  || 0);
            sumBestWbt += hasActualWbt ? m.actual_wbt : (m.wbt || 0);
            if (hasActualWw || hasActualWbt) correctedCount++;
        }

        const collapseId = `day-${dateKey.replace(/-/g, '')}`;
        const isOpen = isToday || idx === 0;

        const card = document.createElement('div');
        card.className = 'day-card';
        card.innerHTML = `
            <div class="day-header">
                <button class="day-toggle" type="button"
                        data-bs-toggle="collapse" data-bs-target="#${collapseId}"
                        aria-expanded="${isOpen}" aria-controls="${collapseId}">
                    <i class="fas fa-chevron-right toggle-icon"></i>
                    <div class="day-date">
                        ${formatDate(dateKey)}
                        ${isToday ? '<span class="today-badge">Dziś</span>' : ''}
                        <small>${dayMeals.length} ${pluralPosilek(dayMeals.length)}</small>
                    </div>
                    <div class="day-stats" id="pills-${collapseId}">
                        ${pillsHtml(sumCal, sumBestWw, sumBestWbt)}
                    </div>
                </button>
            </div>
            <div class="collapse${isOpen ? ' show' : ''}" id="${collapseId}">
                <div class="day-body">
                    <div class="table-responsive">
                        <table class="table meal-table">
                            <thead>
                                <tr>
                                    <th style="width:120px">Godzina</th>
                                    <th>Posiłek</th>
                                    <th style="width:110px">Kalorie</th>
                                    <th style="width:170px">Obliczenia dziecka</th>
                                    <th>Wartości rzeczywiste</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dayMeals.map(m => renderMealRow(m)).join('')}
                                ${renderSummaryRow(sumCal, sumWw, sumWbt, sumBestWw, sumBestWbt, correctedCount, dayMeals.length, collapseId)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;

        container.appendChild(card);
    });
}

async function loadMeals() {
    try {
        const resp = await fetch(`/api/meals/${USER_ID}`);
        const meals = await resp.json();
        document.getElementById('loading').style.display = 'none';

        if (!meals.length) {
            document.getElementById('empty-state').style.display = 'block';
            document.getElementById('total-count').textContent = '0 posiłków';
            return;
        }

        document.getElementById('total-count').textContent =
            `${meals.length} ${pluralPosilek(meals.length)}`;
        document.getElementById('days-container').style.display = 'block';
        allMeals = meals;
        renderDays(meals);
    } catch {
        document.getElementById('loading').innerHTML =
            '<div class="text-danger py-4"><i class="fas fa-exclamation-triangle me-2"></i>Błąd ładowania danych. Odśwież stronę.</div>';
    }
}

async function saveActual(mealId) {
    const aww  = parseFloat(document.getElementById(`aww-${mealId}`).value);
    const awbt = parseFloat(document.getElementById(`awbt-${mealId}`).value);
    const actualWw  = isNaN(aww)  ? null : aww;
    const actualWbt = isNaN(awbt) ? null : awbt;

    try {
        await fetch(`/api/meal/${mealId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actual_ww: actualWw, actual_wbt: actualWbt }),
        });
    } catch { return; }

    const meal = allMeals.find(m => m.id === mealId);
    if (meal) { meal.actual_ww = actualWw; meal.actual_wbt = actualWbt; }

    const display = document.getElementById(`display-${mealId}`);
    display.innerHTML = (actualWw !== null || actualWbt !== null)
        ? `<span class="actual-display">${fmt(actualWw, ' WW')} / ${fmt(actualWbt, ' WBT')}</span>`
        : `<span class="actual-empty">Nie uzupełniono</span>`;

    const icon = document.getElementById(`saved-${mealId}`);
    icon.style.display = 'inline';
    setTimeout(() => { icon.style.display = 'none'; }, 2000);

    refreshDaySummary(mealDateMap[mealId]);
}

function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadMeals();
