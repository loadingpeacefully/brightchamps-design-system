# ADR-0007: Three Output Targets

## Status
Accepted

## Date
2026-04-15

## Context
Once we have a canonical ledger of approved tokens, we need to publish them
in formats that design and engineering teams can actually use.

## Decision
Three output targets:
1. **Figma variables** — push canonical tokens to Figma via Variables API
2. **CSS custom properties** — write `tokens.css` for engineering
3. **Design system site** — `brightchamps.design` mirroring atlassian.design structure

## Options considered
| Option | Reasoning |
|--------|-----------|
| Figma variables | Designers work in Figma — tokens must live there |
| CSS custom properties | Engineers need a drop-in import for all surfaces |
| Design system site | Public-facing documentation, the "atlassian.design" goal |
| Style Dictionary | Considered but adds complexity; direct output is simpler |
| Storybook | Component library — Phase 2 scope |

## Consequences
- Three separate publish commands: publish:figma, publish:css, publish:site
- Design system site is a Next.js app in src/publish/ds-site/
- CSS output is a single flat file, not scoped to surfaces

## Confidence
High — these are the three formats the team will actually use.
