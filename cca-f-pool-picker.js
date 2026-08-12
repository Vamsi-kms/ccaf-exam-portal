// Draws a fresh 90-question set (6 scenarios x 15) from the full raw bank,
// following the same blueprint weightage as the curated set, while skipping
// question ids the caller has already seen. Falls back to repeats only when
// a slot's unseen pool is exhausted.
(function () {
  const RAW_BANK = window.CCAF_QUESTION_BANK || [];
  const DOMAINS = window.CCAF_DOMAINS || [];
  const SCENARIO_IDS = ['s1', 's2', 's3', 's4', 's5', 's6'];
  const BLUEPRINT_COUNTS = [4, 3, 3, 3, 2]; // agentic, tools, code, prompt, context

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function buildPoolSession(seenIds) {
    const seen = seenIds instanceof Set ? seenIds : new Set(seenIds || []);
    const byDomain = new Map(DOMAINS.map(domain => [
      domain,
      RAW_BANK.filter(q => q.domain === domain)
    ]));
    const session = [];

    DOMAINS.forEach((domain, index) => {
      const pool = byDomain.get(domain) || [];
      const candidates = [
        pool.filter(q => q.priority && !seen.has(q.id)),
        pool.filter(q => !q.priority && !seen.has(q.id)),
        pool.filter(q => q.priority && seen.has(q.id)),
        pool.filter(q => !q.priority && seen.has(q.id))
      ].flatMap(shuffle);
      const slots = Array.from(
        { length: BLUEPRINT_COUNTS[index] * SCENARIO_IDS.length },
        (_, slot) => SCENARIO_IDS[(slot + index) % SCENARIO_IDS.length]
      );
      slots.forEach((scenario, slot) => {
        if (candidates[slot]) session.push({ ...candidates[slot], scenario, domain });
      });
    });

    return session;
  }

  window.CCAF_buildPoolSession = buildPoolSession;
})();
