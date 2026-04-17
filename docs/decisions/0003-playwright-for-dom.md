# ADR-0003: Use Playwright for DOM Token Extraction

## Status
Accepted

## Date
2026-04-15

## Context
We need to visit live BrightChamps URLs and extract all computed CSS values
from rendered components. Options: Playwright, Puppeteer, jsdom, or a custom
browser extension.

## Decision
Use Playwright with Chromium. Extract via `window.getComputedStyle()` on
a sample of key elements (body, headings, buttons, inputs, cards, nav).

## Options considered
| Option | Pros | Cons |
|--------|------|------|
| Playwright (chosen) | Full browser, handles JS, handles auth, well-maintained | Heavier install |
| Puppeteer | Similar capability | Less active maintenance |
| jsdom | Lightweight | Doesn't execute JS, misses dynamic styles |
| Browser extension | User-friendly | Can't automate, requires manual work |

## Consequences
- `npx playwright install chromium` required at setup
- Playwright handles JS-rendered styles correctly
- Auth via `storageState` for protected routes
- Heavier install (~150MB) but only used in dev

## Confidence
High — Playwright is the industry standard for browser automation.
