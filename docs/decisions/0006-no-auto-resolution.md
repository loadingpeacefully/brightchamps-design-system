# ADR-0006: Never Auto-Resolve Drift

## Status
Accepted

## Date
2026-04-15

## Context
When Figma and DOM disagree on a token value, we could:
(a) auto-pick Figma (design intent wins)
(b) auto-pick DOM (shipped reality wins)
(c) require human decision every time

## Decision
Never auto-resolve drift. Always require a human to decide which value is
canonical. The Claude SDK token-resolver agent RECOMMENDS but never decides.
Only the human (via review dashboard approval) writes to the ledger.

## Reasoning
Neither Figma nor DOM is always correct:
- Figma might have an intentional update not yet implemented in DOM
- DOM might have a deliberate override not reflected in Figma
- Only the design team knows which situation applies

Auto-resolution would introduce silent errors into the canonical design system.

## Consequences
- Drift review is a required step before publishing
- More human work, but higher confidence in the output
- Design team must be involved in the process (feature, not bug)

## Confidence
High — this is the right trade-off for a design system that will be used at scale.
