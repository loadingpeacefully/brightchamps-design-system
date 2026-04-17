# ADR-0004: Use Figma REST API Directly (No SDK)

## Status
Accepted

## Date
2026-04-15

## Context
Need to extract styles and variables from BrightChamps Figma files.
Options: official Figma REST API, figma-js community SDK, or Figma MCP.

## Decision
Use the Figma REST API directly via `fetch()`. No third-party SDK.
Figma MCP is used in claude.ai chat sessions for interactive work;
the REST API is used in the automated extraction pipeline.

## Options considered
| Option | Pros | Cons |
|--------|------|------|
| Figma REST API (chosen) | Official, stable, full control | More code to write |
| figma-js SDK | Less code | Outdated, unmaintained |
| Figma MCP only | Good for interactive use | Can't automate in scripts |

## Consequences
- Direct control over rate limiting and retries
- No external SDK dependency to maintain
- Figma token stored in .env as FIGMA_TOKEN
- Rate limit: 100 req/min — extractor batches requests

## Confidence
High.
