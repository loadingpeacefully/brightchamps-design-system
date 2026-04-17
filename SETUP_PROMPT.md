# BrightChamps Design System — Claude Code Setup Prompt

> Paste this entire document into Claude Code after cloning the repo.
> Say: "Read SETUP_PROMPT.md and follow it step by step."

---

## What you are

You are the AI engineer for the BrightChamps Design System project.
This project extracts design tokens from live BrightChamps surfaces (DOM + Figma),
detects drift between what was designed and what was built, and publishes a
canonical design system — a Figma variables file and a live website (brightchamps.design)
that mirrors the structure of atlassian.design.

Read these files NOW before doing anything else:
1. @CLAUDE.md — project rules and commands
2. @HANDOFF.md — current session state and next steps
3. @memory-bank/projectbrief.md — what we're building and why
4. @memory-bank/systemPatterns.md — architecture and data flow
5. @memory-bank/techContext.md — stack, setup, and constraints
6. @docs/PRD.md — full product requirements
7. @docs/decisions/README.md — all architectural decisions

---

## Session 1: Initial setup

After reading all the above, do the following in order:

### Step 1: Verify Node.js version
```bash
node --version  # Must be >= 20
```
If < 20, stop and tell me to upgrade Node.js.

### Step 2: Install dependencies
```bash
npm install
npx playwright install chromium
```

### Step 3: Check .env exists
Look for `.env` in the project root.
If it doesn't exist, copy `.env.example` to `.env` and tell me:
"Please fill in your FIGMA_TOKEN and ANTHROPIC_API_KEY in .env before continuing."

### Step 4: Verify surfaces.config.ts
Open `surfaces.config.ts` and check if the URLs still have placeholder values
(look for "TODO" comments or "FIGMA_FILE_ID_" strings).
If yes, tell me: "surfaces.config.ts needs real URLs and Figma file IDs.
Please provide:
1. Landing pages URL(s)
2. Student app URL(s)  
3. Teacher app URL(s)
4. Admin dashboard URL(s)
5. Figma file IDs for landing, student, and teacher surfaces"

Do NOT proceed with extraction until surfaces.config.ts has real values.

### Step 5: TypeScript check
```bash
npm run typecheck
```
Fix any type errors before proceeding.

### Step 6: First extraction test
Once surfaces.config.ts is filled in, run extraction on the landing page only first:
```bash
npm run extract:dom -- --surface=landing
```
Check the output in `ledger/.extractions/landing-dom.json`.
Report: how many tokens were extracted, any errors.

### Step 7: Full extraction
If Step 6 succeeded:
```bash
npm run extract:all
npm run ledger:build
npm run drift:detect
```

### Step 8: Session handoff
At the end of this session, run the `/handoff` skill to update HANDOFF.md.

---

## Ongoing session rules

Every session, you MUST:
1. Read HANDOFF.md at the start
2. Update memory-bank/activeContext.md with current focus
3. Write a new ADR for any significant architectural decision (use `/adr` skill)
4. Log daily progress to `docs/session-logs/YYYY-MM-DD.md`
5. Run `/handoff` skill at session end

Never:
- Edit `ledger/tokens.json` manually
- Resolve drift automatically
- Push to Figma without explicit human confirmation
- Use `any` type in TypeScript
- Hardcode surface URLs

---

## Key design decisions (read these if confused about "why")

- **Why Playwright not screenshots?** Screenshots need vision models + have OCR errors. DOM extraction gives exact computed values.
- **Why never auto-resolve drift?** Figma and DOM can both be "right" — only the designer knows which. See ADR-0006.
- **Why is admin dashboard DOM-only?** No Figma file exists for it. DOM extraction is the source of truth.
- **Why is the ledger git-tracked JSON?** So all token decisions are version-controlled and reviewable in PRs.
- **Why Haiku for AI resolution?** Speed and cost — Haiku can classify token conflicts faster than Sonnet at 1/4 the cost.

---

## When you're stuck

If you hit an auth error on protected surfaces (student/teacher/admin apps):
```bash
npx playwright codegen https://[auth-url]
```
This opens a browser for you to log in — saves auth state for reuse.

If Figma API returns 403 on variables:
The account may not have editor access. Fall back to styles-only extraction.
This is handled automatically in figma-api.ts.

If Playwright timeouts on a surface:
Try with headed mode: `PLAYWRIGHT_HEADED=true npm run extract:dom`

---

## The end goal

When this project is complete:
1. All 4 surfaces extracted and in the ledger
2. All critical + high drift items resolved by design team
3. Figma variables file published to all 3 Figma files
4. `tokens.css` available for engineering team
5. `brightchamps.design` live with Foundations / Components / Patterns sections

Think of atlassian.design — that's the bar.
