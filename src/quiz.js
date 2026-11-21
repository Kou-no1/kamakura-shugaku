// Quiz progress is independent of the travel journal and its visit stamps.
const quizLevels = [
  { id: 'easy', label: 'やさしい', description: '場所や名前をたしかめる', icon: 'leaf' },
  { id: 'normal', label: 'ふつう', description: '地図と見どころをつなぐ', icon: 'map' },
  { id: 'hard', label: '難しい', description: '地形や建物の理由を考える', icon: 'book' },
  { id: 'expert', label: '激ムズ', description: '昔の人の立場や資料から考える', icon: 'flag' }
];
const quizMemory = new Map();
const quizVersions = new Map();
let quizStorageWarning = false;

function quizKey(level) {
  if (!quizVersions.has(level.id)) {
    quizVersions.set(level.id, hash(JSON.stringify(QUIZ_BANK[level.id])));
  }
  return 'kq:quiz:1:' + lesson.id + ':' + level.id + ':' + quizVersions.get(level.id);
}

function quizProgress(level) {
  const key = quizKey(level);
  const bank = QUIZ_BANK[level.id];
  const empty = { index: 0, picks: [] };
  let record = quizMemory.get(key);
  if (!quizStorageWarning) {
    try {
      const stored = localStorage.getItem(key);
      record = stored === null ? record : JSON.parse(stored);
    } catch { /* The in-memory round also works with storage disabled. */ }
  }
  if (!record || !Number.isInteger(record.index) ||
      record.index < 0 || record.index > bank.length || !Array.isArray(record.picks) ||
      record.picks.length < record.index || record.picks.length > bank.length ||
      record.picks.length > record.index + 1 ||
      !record.picks.every((pick, i) =>
        Number.isInteger(pick) && pick >= 0 && pick < bank[i].choices.length)) return empty;
  return record;
}

function saveQuizProgress(level, record) {
  const key = quizKey(level);
  quizMemory.set(key, record);
  try {
    localStorage.setItem(key, JSON.stringify(record));
    quizStorageWarning = false;
  } catch {
    if (!quizStorageWarning) toast('この画面では続けられます。端末に保存できませんでした。');
    quizStorageWarning = true;
  }
}

function quizButton(action, label, data = '', primary = false) {
  return button(action, label, primary ? 'primary' : '', data);
}

function showQuizView(content, focusSelector = '[data-quiz-focus]') {
  let dialog = $('#modal-root dialog.quiz-dialog');
  if (dialog) {
    dialog.querySelector('.modal-body').innerHTML = content;
  } else {
    dialog = openModal('鎌倉クイズ', content);
    dialog.classList.add('quiz-dialog');
    dialog.querySelector('.modal-head h2').id = 'quiz-dialog-title';
    dialog.setAttribute('aria-labelledby', 'quiz-dialog-title');
  }
  const target = dialog.querySelector(focusSelector);
  if (focusSelector === '.quiz-feedback') {
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest' });
  } else {
    dialog.scrollTop = 0;
    target?.focus({ preventScroll: true });
  }
}

function quizPicker() {
  const cards = quizLevels.map(level => {
    const record = quizProgress(level);
    const total = QUIZ_BANK[level.id].length;
    const complete = record.index === total;
    const status = complete ? '結果を見る' : record.picks.length ? 'つづきから' : 'はじめる';
    return `<button type="button" class="quiz-level quiz-tone-${level.id}"
        data-action="quizLevel" data-level="${level.id}">
      <span class="quiz-level-head"><span class="quiz-icon">${icon(level.icon)}</span>
        <strong>${level.label}</strong></span>
      <span class="quiz-level-desc">${level.description}</span>
      <span class="quiz-level-foot"><span>${record.picks.length} / ${total} 問</span>
        <span class="quiz-level-go">${status} ${icon('arrow')}</span></span>
    </button>`;
  }).join('');
  showQuizView(`<h3 class="quiz-heading" tabindex="-1" data-quiz-focus>レベルを選ぼう</h3>
    <div class="quiz-levels">${cards}</div>
    <div class="quiz-actions">${quizButton('quizMap', 'マップへ戻る')}</div>`);
}

function quizSource(question) {
  if (!/^https:\/\//.test(question.sourceUrl)) return '';
  return `<a class="quiz-source" href="${esc(question.sourceUrl)}" target="_blank"
    rel="noopener noreferrer">資料を読む · ${esc(question.sourceTitle)} ↗</a>`;
}

function quizQuestion(level, record, showFeedback = false) {
  const bank = QUIZ_BANK[level.id];
  if (record.index === bank.length) return quizResults(level, record);
  const question = bank[record.index];
  const pick = record.picks[record.index];
  const answered = pick !== undefined;
  const right = pick === question.answer;
  const data = `data-level="${level.id}" data-question="${esc(question.id)}"`;
  const choices = question.choices.map((choice, i) => {
    const correct = answered && i === question.answer;
    const wrong = answered && i === pick && !right;
    const status = correct ? '正解' : wrong ? 'えらんだ答え' : '';
    return `<button type="button" class="quiz-choice${correct ? ' is-correct' : ''}${wrong ? ' is-picked' : ''}"
        data-action="quizAnswer" ${data} data-choice="${i}" ${answered ? 'disabled' : ''}>
      <span class="quiz-letter" aria-hidden="true">${'ABCD'[i]}</span>
      <span class="quiz-choice-text">${esc(choice)}</span>
      ${status ? `<small class="quiz-choice-status">${status}</small>` : ''}
    </button>`;
  }).join('');
  const feedback = answered ? `<section class="quiz-feedback" tabindex="-1" aria-labelledby="quiz-verdict">
      <h4 id="quiz-verdict">${right ? '正解！' : '答えをたしかめよう'}</h4>
      ${right ? '' : `<p class="quiz-solution">正解は「${esc(question.choices[question.answer])}」</p>`}
      <p>${esc(question.explanation)}</p>${quizSource(question)}
    </section>` : '';
  const next = record.index + 1 === bank.length ? '結果を見る' : '次の問題へ';
  showQuizView(`<div class="quiz-round quiz-tone-${level.id}">
    <div class="quiz-meta"><b>${icon(level.icon)} ${level.label}</b><span>${esc(question.category)}</span>
      <span class="quiz-counter">${record.index + 1} / ${bank.length} 問</span></div>
    <progress class="quiz-progress" max="${bank.length}" value="${record.picks.length}"
      aria-label="答えた問題"></progress>
    <h3 class="quiz-question" data-quiz-focus tabindex="-1">${esc(question.question)}</h3>
    <div class="quiz-choices">${choices}</div>${feedback}
    <div class="quiz-actions">
      ${quizButton('quizOpen', 'レベル選択へ')}
      ${answered ? quizButton('quizNext', next + ' ' + icon('arrow'), data, true) : ''}
    </div></div>`, showFeedback ? '.quiz-feedback' : '[data-quiz-focus]');
}

function quizResults(level, record) {
  const bank = QUIZ_BANK[level.id];
  const score = bank.filter((q, i) => record.picks[i] === q.answer).length;
  const rows = bank.map((q, i) => {
    const pick = record.picks[i], correct = pick === q.answer;
    return `<details class="quiz-review-row">
      <summary><span class="quiz-review-mark${correct ? ' is-correct' : ''}">
          ${correct ? '正解' : '見直し'}</span>
        <span>${i + 1}. ${esc(q.question)}</span></summary>
      <div class="quiz-review-body">
        ${correct ? '' : `<p>えらんだ答え　${esc(q.choices[pick])}</p>`}
        <p><b>正解　${esc(q.choices[q.answer])}</b></p>
        <p>${esc(q.explanation)}</p>${quizSource(q)}
      </div></details>`;
  }).join('');
  showQuizView(`<div class="quiz-round quiz-tone-${level.id}">
    <h3 class="quiz-heading" tabindex="-1" data-quiz-focus>${level.label} の結果</h3>
    <div class="quiz-score">${icon('flag')}<span><strong>${score}</strong> / ${bank.length} 問正解</span></div>
    <div class="quiz-actions">
      ${quizButton('quizOpen', 'レベル選択へ')}
      ${quizButton('quizRetry', 'もう一度とく', `data-level="${level.id}"`)}
      ${quizButton('quizMap', 'マップへ戻る', '', true)}
    </div>
    <h4 class="quiz-review-title">答えをふり返る</h4>
    <div class="quiz-review">${rows}</div></div>`);
}

function handleQuizAction(action, control) {
  if (action === 'quizOpen') {
    quizPicker();
    return true;
  }
  if (action === 'quizMap') {
    closeModal();
    if (tab !== 'explore') {
      tab = 'explore';
      render();
      document.querySelector('[data-action="quizOpen"]')?.focus();
    }
    return true;
  }
  if (!['quizLevel', 'quizAnswer', 'quizNext', 'quizRetry'].includes(action)) return false;
  const level = quizLevels.find(item => item.id === control.dataset.level);
  if (!level) return true;
  let record = quizProgress(level);
  const bank = QUIZ_BANK[level.id];
  const question = bank[record.index];
  let focusFeedback = false;
  if (action === 'quizRetry' && record.index === bank.length) {
    record = { index: 0, picks: [] };
    saveQuizProgress(level, record);
  }
  if (question && question.id === control.dataset.question) {
    if (action === 'quizAnswer' && record.picks.length === record.index) {
      const pick = Number(control.dataset.choice);
      if (Number.isInteger(pick) && pick >= 0 && pick < question.choices.length) {
        record.picks.push(pick);
        saveQuizProgress(level, record);
        focusFeedback = true;
      }
    } else if (action === 'quizNext' && record.picks.length > record.index) {
      record.index++;
      saveQuizProgress(level, record);
    }
  }
  quizQuestion(level, record, focusFeedback);
  return true;
}
