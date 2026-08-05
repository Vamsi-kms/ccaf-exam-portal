// Exam-guide-aligned set: 6 scenarios x 15 questions, with blueprint-level domain weighting.
(function () {
  const source = new Map((window.CCAF_QUESTION_BANK || []).map(question => [question.id, question]));
  const domains = {
    agentic: 'Agentic Architecture & Orchestration',
    tools: 'Tool Design & MCP Integration',
    code: 'Claude Code Configuration & Workflows',
    prompt: 'Prompt Engineering & Structured Output',
    context: 'Context Management & Reliability'
  };

  const plan = {
    s1: [
      ['q199', domains.agentic], ['q212', domains.agentic], ['q472', domains.agentic],
      ['q104', domains.agentic], ['q34', domains.tools], ['q35', domains.tools],
      ['q37', domains.tools], ['q40', domains.code], ['q311', domains.code],
      ['q313', domains.code], ['q559', domains.prompt], ['q583', domains.prompt],
      ['q825', domains.prompt], ['q450', domains.context], ['q61', domains.context]
    ],
    s2: [
      ['q2', domains.agentic], ['q10', domains.agentic], ['q20', domains.agentic],
      ['q80', domains.agentic], ['q790', domains.tools], ['q791', domains.tools],
      ['q797', domains.tools], ['q4', domains.code], ['q6', domains.code],
      ['q41', domains.code], ['q606', domains.prompt], ['q612', domains.prompt],
      ['q831', domains.prompt], ['q1', domains.context], ['q9', domains.context]
    ],
    s3: [
      ['q755', domains.agentic], ['q756', domains.agentic], ['q758', domains.agentic],
      ['q760', domains.agentic], ['q790', domains.tools, 's3q790'], ['q793', domains.tools],
      ['q799', domains.tools], ['q42', domains.code], ['q44', domains.code],
      ['q318', domains.code], ['q818', domains.prompt], ['q821', domains.prompt],
      ['q536', domains.prompt], ['q865', domains.context], ['q868', domains.context]
    ],
    s4: [
      ['q776', domains.agentic], ['q779', domains.agentic], ['q781', domains.agentic],
      ['q789', domains.agentic], ['q8', domains.tools], ['q652', domains.tools],
      ['q655', domains.tools], ['q424', domains.code], ['q469', domains.code],
      ['q68', domains.code], ['q807', domains.prompt], ['q838', domains.prompt],
      ['q615', domains.prompt], ['q5', domains.context], ['q872', domains.context]
    ],
    s5: [
      ['q783', domains.agentic], ['q784', domains.agentic], ['q785', domains.agentic],
      ['q16', domains.agentic], ['q793', domains.tools, 's5q793'], ['q796', domains.tools],
      ['q806', domains.code], ['q809', domains.code], ['q812', domains.code],
      ['q808', domains.prompt], ['q810', domains.prompt], ['q819', domains.prompt],
      ['q494', domains.context], ['q495', domains.context], ['q497', domains.context]
    ],
    s6: [
      ['q768', domains.agentic], ['q769', domains.agentic], ['q80', domains.agentic, 's6q80'],
      ['q82', domains.agentic], ['q802', domains.tools], ['q804', domains.tools],
      ['q813', domains.code], ['q816', domains.code], ['q820', domains.code],
      ['q539', domains.prompt], ['q564', domains.prompt], ['q598', domains.prompt],
      ['q629', domains.context], ['q633', domains.context], ['q636', domains.context]
    ]
  };

  const revisions = {
    q199: {
      options: [
        'Stop after one tool call whenever predictable cost is more important than completing the requested task in the same session.',
        'Pause after each tool result and require the user to authorize the next model turn before execution can continue.',
        'Continue while stop_reason is tool_use and finish on end_turn, with a separate safety limit for abnormal looping behavior.',
        'Continue until end_turn without any safety boundary because stop_reason alone guarantees that every loop eventually terminates.'
      ]
    },
    q212: {
      options: [
        'Treat max_tokens as continuation because the model needs another turn to finish the same tool request it already started.',
        'Treat stop_sequence as continuation because a configured delimiter indicates that another tool result must be supplied.',
        'Treat end_turn as continuation because the model has completed its current reasoning phase but may still need tools.',
        'Treat tool_use as continuation because the model requested tools and expects their results before deciding the next action.'
      ]
    },
    q472: {
      options: [
        'Finish the nearly completed refund, then transfer the resolved case so the human can confirm that the outcome was acceptable.',
        'Ask once for confirmation of the handoff request, then continue autonomously if the customer does not respond immediately.',
        'Explain that autonomous resolution will be faster and offer a handoff only if the next two tool calls fail.',
        'Honor the explicit request immediately, stop autonomous resolution, and transfer the accumulated case context to a human agent.'
      ]
    },
    q20: {
      options: [
        'Add a PreToolUse hook that blocks refunds above $500 only when the model reports confidence below the approved threshold.',
        'Add a PostToolUse hook that reverses refunds above $500 whenever the audit record lacks a second confirmation.',
        'Remove refund access above $500 entirely and require a human to perform every such transaction outside the agent workflow.',
        'Add a PreToolUse hook that blocks refunds above $500 unless the workflow records the required independent confirmation.'
      ],
      explanation: 'The prerequisite must be checked before execution and cannot depend on model confidence. A PostToolUse reversal acts after the prohibited transaction, while removing all access changes the stated policy.'
    },
    q80: {
      options: [
        'Retry the same endpoint after a fixed delay, escalating only after the configured retry count has been completely exhausted.',
        'Set a maximum agent iteration count so the session ends after enough model responses, regardless of tool-call duration.',
        'Increase the worker pool and requeue the session when infrastructure monitoring detects that all available workers are occupied.',
        'Set a per-tool timeout and an orchestration watchdog that records the stalled session and triggers a human escalation.'
      ],
      explanation: 'A tool timeout releases the blocked call, while the orchestration watchdog guarantees a recorded terminal path. Iteration limits do not interrupt a hanging call, and more workers only mask it.'
    },
    q82: {
      options: [
        'The ingestion layer lacks schema validation that would reject malformed applicant records before they reach the underwriting tool.',
        'The worker lacks a supervising boundary that catches execution failures and durably records either recovery or human escalation.',
        'The tool lacks local exception handling that converts malformed records into structured, non-retryable validation error responses.',
        'The queue lacks an automatic retry policy that resubmits every interrupted applicant record to another available worker process.'
      ],
      explanation: 'Tool validation and structured errors are useful, but the disappearance of the entire case reveals the broader architectural gap: no supervisor guarantees a durable terminal outcome when execution crashes.'
    },
    q104: {
      options: [
        'The complete transcript and customer identifier, leaving the human agent to reconstruct findings, actions, and authorization state.',
        'A short issue summary and customer profile, omitting unsuccessful actions so the handoff remains concise for the human agent.',
        'The disputed charges and actions already attempted, omitting authorization status and the specific condition that triggered escalation.',
        'A structured package containing customer identity, disputed charges, verified findings, attempted actions, authorization state, and escalation reason.'
      ],
      explanation: 'A useful handoff preserves the accumulated operational state, not merely the transcript or final message. The complete structured package lets the human continue safely without repeating work.'
    },
    q34: {
      options: [
        'Return a transient error with isRetryable true and recommend repeating the same extraction after an exponential-backoff delay.',
        'Return a password-protected error with isRetryable false and recommend asking the customer for an unlocked document.',
        'Return a validation error with isRetryable true and recommend modifying the extraction schema before retrying the document.',
        'Return a successful empty extraction with a warning field so downstream processing can continue without interrupting the workflow.'
      ],
      explanation: 'The failure is recoverable through user action, not by repeating the same call. A typed, non-retryable error and suggested next action let the agent explain and recover appropriately.'
    },
    q35: {
      options: [
        'Return a common error code plus the tool name, then let the coordinator infer whether another invocation might succeed.',
        'Return an error category and message, while applying the same bounded retry policy to every category for consistent behavior.',
        'Return an error category, isRetryable flag, explanation, and suggested action so recovery differs by the actual failure type.',
        'Return the original exception text and stack trace so the model can decide whether the failure appears temporary or permanent.'
      ],
      explanation: 'Recovery requires explicit type and retryability metadata. Raw exceptions or uniform retries force the model to guess and waste attempts on permanent failures.'
    },
    q37: {
      options: [
        'Describe each tool’s purpose, accepted identifiers, result shape, examples, and explicit boundary against the other search tool.',
        'Expand both descriptions with the records each tool can return, while leaving identifier requirements and overlap unstated.',
        'Add keyword-routing instructions to the system prompt that associate mentions of customers with the exact-match lookup tool.',
        'Replace both tools with one search tool that accepts a mode field and lets the model choose exact or fuzzy behavior.'
      ],
      explanation: 'The immediate root cause is indistinguishable tool descriptions. Purpose, inputs, examples, and explicit boundaries improve model selection without adding brittle keyword routing or redesigning the interface.'
    },
    q450: {
      options: [
        'The API retains prior turns when requests reuse a conversation identifier, while the application only stores tool results locally.',
        'The application resends conversation history on every request and must summarize or trim it as the context budget fills.',
        'The API retains prior turns for requests using the same API key, while the application supplies only each new user message.',
        'The application sends only a rolling summary because previously processed messages remain available to the model automatically.'
      ],
      explanation: 'The Messages API is stateless. The client owns history and must resend the context needed for each turn, managing growth without assuming server-side conversational memory.'
    },
    q61: {
      options: [
        'Load the stored conversation identifier with the latest message so the API can retrieve the earlier turns from server memory.',
        'Resend the full relevant message history with the latest turn because each Messages API request is independently stateless.',
        'Increase the model context window so earlier turns become available even though the client omitted them from the new request.',
        'Repeat only the earlier decision in the system prompt because assistant and tool messages cannot be resent in later requests.'
      ],
      answer: 1,
      explanation: 'A fresh request contains only what the client sends. Maintaining multi-turn state means accumulating and resending the relevant user, assistant, and tool messages.'
    },
    q68: {
      options: [
        'Define both workflows as project commands because slash commands are useful only when their files are stored in a repository.',
        'Define both workflows as personal commands, then document the shared command so each teammate can recreate it locally.',
        'Put the private workflow in personal CLAUDE.md and the shared workflow in project CLAUDE.md as conditional instructions.',
        'Put my-scratch-notes in personal commands and run-integration-tests in project commands so their availability matches their audience.'
      ]
    },
    q768: {
      options: [
        'Invoke one subagent per source and let the coordinator infer cross-source relationships only after all six independent reports return.',
        'Pass structured findings that keep each claim beside its source name, URL, page, and evidence so attribution survives handoff.',
        'Pass the combined text with source headings and rely on the subagent to reconstruct claim-level attribution during its analysis.',
        'Summarize all sources into one shorter narrative and attach a bibliography containing the six source locations at the end.'
      ]
    },
    q790: {
      options: [
        'The coordinator is following the order in which the tools were registered because both descriptions provide comparable semantic guidance.',
        'The user prompts omit a document MIME type, leaving neither tool able to determine whether the uploaded content is a PDF.',
        'The tools expose overlapping input schemas, causing the coordinator to favor the tool whose parameters require fewer populated fields.',
        'The descriptions do not state distinct purposes or boundaries, leaving the model without enough information for reliable selection.'
      ]
    },
    q791: {
      options: [
        'The vague description supplied enough signal only when no competing tool existed; overlapping tools require explicit purpose and boundary guidance.',
        'The second tool changed discovery order, so patient_lookup now needs a higher priority value in the MCP server configuration.',
        'The short description omits example inputs, so the model cannot validate whether patient identifiers match the lookup schema.',
        'The shared server scope causes both tools to compete; moving patient_lookup to user scope would restore deterministic selection.'
      ]
    },
    q799: {
      options: [
        'Split the interface into extraction, summarization, and threat-check tools with distinct contracts and selection boundaries.',
        'Keep one interface but require a task_type enum that selects extraction, summarization, or threat checking for every call.',
        'Keep one interface and expand its description with three examples showing how analysts should request each supported operation.',
        'Move threat checking to the coordinator while leaving extraction and summarization combined in the existing generic interface.'
      ]
    },
    q785: {
      options: [
        'Run the same ordered ingestion, feature, and scoring checks each time so results remain comparable across repeated investigations.',
        'Delegate the complete investigation to one specialist that can retain all evidence and choose its own internal diagnostic sequence.',
        'Begin with a broad scan, then create targeted subtasks from emerging evidence and revise the investigation as findings accumulate.',
        'Apply the established regression checklist first and add exploratory tasks only after every predefined diagnostic returns inconclusive.'
      ]
    },
    q809: {
      options: [
        'The review lacks enough remaining context after generation; shorten project guidance and rerun review within the original session.',
        'The review prompt lacks explicit bug categories; add correctness examples while keeping generation and review in one session.',
        'The session retains its implementation rationale; review the diff with an independent instance that has no generating context.',
        'The CI job combines two responsibilities; move review to another pipeline stage while preserving the original Claude session.'
      ]
    },
    q810: {
      options: [
        'Use non-interactive print mode and instruct the model to choose only blocking, major, or minor in its response text.',
        'Use JSON output and normalize critical to blocking in the parsing script before the finding reaches merge-gating logic.',
        'Use JSON output with severity examples in CLAUDE.md so the model learns the team’s preferred classification vocabulary.',
        'Use JSON output with a JSON Schema enum restricting severity to blocking, major, or minor for every finding.'
      ]
    },
    q821: {
      options: [
        'Use JSON output and reject missing remediation fields in the posting script, because output format alone controls syntax rather than required properties.',
        'Use non-interactive JSON output because print mode implicitly rejects responses that omit fields named in the review prompt.',
        'Use JSON Schema with remediation required, so generated review output must conform to that required-property constraint.',
        'Use JSON output alone because a valid JSON object necessarily includes every property described in the accompanying prompt.'
      ]
    },
    q606: {
      options: [
        'Constrain invoice_date to an enum containing the source formats accepted from every currently supported vendor and region.',
        'Require normalization of every recognized source date into YYYY-MM-DD before placing it in the structured output.',
        'Add a date_format_detected field so downstream accounting code can convert each value according to its original representation.',
        'Describe invoice_date as an accurate calendar date and rely on the numeric schema type to standardize its representation.'
      ]
    },
    q629: {
      options: [
        'Log the failed field, error category, extracted value, corrected value, and source characteristics for aggregation and analysis.',
        'Run validation after every extracted field so failures are recorded closer to the model action that produced them.',
        'Send rejected records to human review and preserve the same generic validation-failed event for operational reporting.',
        'Relax required fields that fail most often so downstream validation rejects fewer records during normal processing.'
      ]
    },
    q633: {
      options: [
        'Capture the field, extracted value, corrected value, source characteristics, and error category so recurring patterns become actionable.',
        'Keep the binary result but segment weekly accuracy by reviewer, document source, and processing date before changing prompts.',
        'Capture reviewer comments as free text because predefined error categories may conceal unexpected extraction failure modes.',
        'Keep the binary result and increase review volume until aggregate accuracy identifies whether the current prompt needs improvement.'
      ]
    },
    q636: {
      options: [
        'Add a dashboard for viewing error counts while keeping the deployed prompt and schema unchanged until accuracy falls below target.',
        'Replace the original schema because a mature extraction pipeline should not continue producing categorized errors after deployment.',
        'Run a one-time analysis of the accumulated failures and freeze the best-performing prompt after the highest-volume category improves.',
        'Close the feedback loop by regularly analyzing error patterns and updating prompts, schemas, or examples based on those findings.'
      ]
    },
    q494: {
      options: [
        'Stratify a fixed random sample by document type so every template contributes the same number of weekly reviewer assignments.',
        'Prioritize documents with low calibrated field confidence or source ambiguity, while retaining a small audit sample of high-confidence results.',
        'Prioritize the newest applications first so reviewers can correct recent submissions before downstream processing begins for the day.',
        'Raise the random review percentage uniformly until the observed aggregate accuracy reaches the organization’s required quality threshold.'
      ],
      explanation: 'Risk-based routing directs limited attention to likely errors. A small high-confidence audit sample remains useful for calibration and detecting novel failure patterns.'
    },
    q495: {
      options: [
        'Raise the document-level review threshold until every document containing handwriting falls below the revised aggregate confidence cutoff.',
        'Route on calibrated field-level confidence so a weak due-date extraction triggers review despite strong confidence in other fields.',
        'Require human review for every due date while allowing all other extracted fields to pass without any confidence-based routing.',
        'Stratify a random sample by document source so handwritten and printed templates receive equal representation in periodic quality audits.'
      ],
      answer: 1,
      explanation: 'Aggregate confidence hides weak individual fields. Field-level routing catches the risky due date without forcing review of every document or relying only on sampling.'
    },
    q497: {
      options: [
        'Combine calibrated field confidence with business impact so uncertain claim amounts receive priority over equally uncertain narrative fields.',
        'Sort only by field confidence so every field with the same score receives identical priority regardless of downstream consequences.',
        'Send every claim amount to review and automatically accept all narrative fields, regardless of ambiguity or contradictory source evidence.',
        'Randomly sample each extracted field at the same rate so review coverage remains statistically uniform across the entire schema.'
      ],
      explanation: 'Review priority should reflect both the likelihood and consequence of error. Confidence alone misses business impact; blanket review wastes capacity.'
    }
  };

  window.CCAF_CURATED_BANK = Object.entries(plan).flatMap(([scenario, entries]) =>
    entries.map(([sourceId, domain, replacementId]) => {
      const question = source.get(sourceId);
      if (!question) throw new Error('Missing curated question: ' + sourceId);
      return { ...question, ...revisions[sourceId], id: replacementId || sourceId, scenario, domain };
    })
  );
})();
