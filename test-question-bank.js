const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('cca-f-portal-data.js', 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync('cca-f-curated-data.js', 'utf8'), sandbox);

const questions = sandbox.window.CCAF_CURATED_BANK;
const scenarios = ['s1', 's2', 's3', 's4', 's5', 's6'];
const expectedDomains = [24, 16, 18, 18, 14];
const domains = sandbox.window.CCAF_DOMAINS;
const wordCount = text => text.trim().split(/\s+/).length;

assert.equal(questions.length, 90);
assert.equal(new Set(questions.map(question => question.id)).size, 90);
scenarios.forEach(scenario => assert.equal(questions.filter(question => question.scenario === scenario).length, 15));
domains.forEach((domain, index) => assert.equal(questions.filter(question => question.domain === domain).length, expectedDomains[index]));
questions.forEach(question => {
  assert.equal(question.options.length, 4, question.id);
  assert.ok(question.answer >= 0 && question.answer < 4, question.id);
  const lengths = question.options.map(wordCount);
  assert.ok(Math.max(...lengths) / Math.min(...lengths) <= 1.5, question.id);
});

console.log('Question bank checks passed.');
