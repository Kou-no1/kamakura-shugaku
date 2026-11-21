const { test } = require('node:test');
const assert = require('node:assert/strict');
const bank = require('../src/quiz-bank.json');
globalThis.KRDictionary = require('../src/ruby-dictionary.json');
require('../src/ruby.js');

test('4段階の各20問を、一つの正答と根拠のある四択として配布する', () => {
  const ids = new Set();
  const questions = new Set();
  assert.deepEqual(Object.keys(bank).sort(), ['easy', 'expert', 'hard', 'normal']);
  for (const [level, entries] of Object.entries(bank)) {
    assert.equal(entries.length, 20, level);
    const positions = new Set();
    for (const entry of entries) {
      assert.ok(entry.id && !ids.has(entry.id), entry.id);
      ids.add(entry.id);
      assert.ok(entry.question && !questions.has(entry.question), entry.question);
      questions.add(entry.question);
      assert.equal(entry.choices.length, 4, entry.id);
      assert.equal(new Set(entry.choices).size, 4, entry.id);
      assert.ok(Number.isInteger(entry.answer) && entry.answer >= 0 && entry.answer < 4, entry.id);
      positions.add(entry.answer);
      assert.ok(entry.explanation && entry.sourceTitle && entry.category, entry.id);
      assert.equal(new URL(entry.sourceUrl).protocol, 'https:', entry.id);
    }
    assert.equal(positions.size, 4, level);
  }
});

test('全問の問題文・選択肢・解説・出典名にルビを付けられる', () => {
  const missing = [];
  for (const entry of Object.values(bank).flat()) {
    const texts = [entry.category, entry.question, ...entry.choices, entry.explanation, entry.sourceTitle];
    for (const text of texts) {
      const unread = KR.segments(text).filter(part => !part.reading && /[\u3400-\u9fff々]/u.test(part.base));
      if (unread.length) missing.push([entry.id, unread.map(part => part.base)]);
    }
  }
  assert.deepEqual(missing, []);
});
