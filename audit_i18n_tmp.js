// Temporary i18n audit: find RU texts in HTML files not covered by dict or TR.ru values,
// and data-i18n keys missing from TR.
const fs = require('fs');
const path = require('path');

const js = fs.readFileSync('js/app.js', 'utf8');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

// --- Extract TR.ru / TR.en keys ---
// TR.ru block: from "const TR = {" to "const PHRASES" ... simpler: capture between "ru:{" and "  },\n    en:{"
const trStart = js.indexOf('const TR = {');
const ruBlock = js.slice(js.indexOf('ru:{', trStart), js.indexOf('en:{', trStart));
const ruKeys = {};
ruBlock.replace(/([A-Za-z0-9_]+)\s*:\s*'((?:[^'\\]|\\.)*)'/g, (m, k, v) => { ruKeys[k] = v.replace(/\\'/g, "'"); return m; });
const enBlock = js.slice(js.indexOf('en:{', trStart), js.indexOf('};', trStart));
const enKeys = {};
enBlock.replace(/([A-Za-z0-9_]+)\s*:\s*'((?:[^'\\]|\\.)*)'/g, (m, k, v) => { enKeys[k] = v.replace(/\\'/g, "'"); return m; });

// --- Extract phrase dict (inside applyLang): keys are long RU strings ---
const dictStart = js.indexOf("const dict = {");
const dictEnd = js.indexOf("};", dictStart);
const dictBlock = js.slice(dictStart, dictEnd);
const dictKeys = new Set();
let m;
const re = /'((?:[^'\\]|\\.)+)'\s*:/g;
while ((m = re.exec(dictBlock)) !== null) dictKeys.add(m[1].replace(/\\'/g, "'"));
const dictVals = new Set();
const reV = /\s*:\s*'((?:[^'\\]|\\.)+)'/g;
while ((m = reV.exec(dictBlock)) !== null) dictVals.add(m[1].replace(/\\'/g, "'"));

const trRuValues = new Set(Object.values(ruKeys));
const covered = t => dictKeys.has(t) || dictVals.has(t) || trRuValues.has(t) || enKeys[t];

// Known non-translatable tokens
const skip = new Set(['', 'f', 'G', 'VK', 'MC', 'SBP', 'CDEK', 'dpd', 'EMS', 'VISA', 'МИР', 'miр']);

const isRu = t => /[а-яёА-ЯЁ]/.test(t);

let missingTotal = 0;
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  // Remove script/style blocks
  const clean = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  // Extract text between tags
  const texts = [];
  clean.replace(/>([^<>]+)</g, (mm, t) => { texts.push(t); return mm; });
  // Also placeholders and aria-labels
  clean.replace(/placeholder="([^"]+)"/g, (mm, t) => { texts.push(t); return mm; });
  clean.replace(/aria-label="([^"]+)"/g, (mm, t) => { texts.push(t); return mm; });
  clean.replace(/title="([^"]+)"/g, (mm, t) => { texts.push(t); return mm; });

  const norm = t => t.replace(/\s+/g, ' ').trim();
  const uniq = new Set();
  for (const raw of texts) {
    const t = norm(raw);
    if (!t || uniq.has(t) || skip.has(t)) continue;
    if (!isRu(t)) continue;
    if (covered(t)) continue;
    // Split long sentences: check if each sentence covered
    const sentences = t.split(/(?<=[.!?])\s+/);
    const uncoveredSentences = sentences.filter(s => !covered(s.trim()));
    if (sentences.length > 1 && uncoveredSentences.length === 0) continue;
    uniq.add(t);
  }
  if (uniq.size) {
    console.log(`\n=== ${f} (${uniq.size} uncovered) ===`);
    [...uniq].slice(0, 40).forEach(t => console.log('  · ' + t.slice(0, 110)));
    missingTotal += uniq.size;
  }
}

// --- Check data-i18n key coverage in TR ---
console.log('\n=== data-i18n keys missing in TR.en ===');
const usedKeys = new Set();
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  html.replace(/data-i18n(?:-placeholder)?="([^"]+)"/g, (mm, k) => { usedKeys.add(k); return mm; });
}
const missingEn = [...usedKeys].filter(k => !enKeys[k]);
const missingRu = [...usedKeys].filter(k => !ruKeys[k]);
console.log(missingEn.length ? missingEn.join(', ') : '(none)');
console.log('=== data-i18n keys missing in TR.ru ===');
console.log(missingRu.length ? missingRu.join(', ') : '(none)');

console.log(`\nTOTAL uncovered unique RU strings: ${missingTotal}`);