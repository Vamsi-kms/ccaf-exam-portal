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
    const usedThisSession = new Set();
    const byDomain = new Map(DOMAINS.map(domain => [
      domain,
      shuffle(RAW_BANK.filter(q => q.domain === domain))
    ]));

    function takeForSlot(domain, scenario) {
      const pool = byDomain.get(domain) || [];
      let pick = pool.find(q => !usedThisSession.has(q.id) && !seen.has(q.id));
      if (!pick) pick = pool.find(q => !usedThisSession.has(q.id)); // seen but not repeated this session
      if (!pick) return null;
      usedThisSession.add(pick.id);
      return { ...pick, scenario, domain };
    }

    return SCENARIO_IDS.flatMap(scenario =>
      DOMAINS.flatMap((domain, index) => {
        const count = BLUEPRINT_COUNTS[index];
        const picks = [];
        for (let i = 0; i < count; i++) {
          const pick = takeForSlot(domain, scenario);
          if (pick) picks.push(pick);
        }
        return picks;
      })
    );
  }

  window.CCAF_buildPoolSession = buildPoolSession;
})();
