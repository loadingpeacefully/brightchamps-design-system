# Project Brief — BrightChamps Design System

## What we're building
A living design system for BrightChamps that:
1. Extracts real design tokens from live surfaces (DOM) and design files (Figma)
2. Detects drift between what was designed and what was shipped
3. Lets the design team review and resolve drift through a web dashboard
4. Publishes a canonical design system as a Figma variables file and a live website

## The end goal
A site like atlassian.design — published as `brightchamps.design` — that is
the single source of truth for all design decisions across landing pages,
student app, teacher app, and admin dashboard.

## Why this project exists
BrightChamps has 4 surfaces built across different teams over different time
periods. Nobody knows what the real design system is. Figma files, live pages,
and admin dashboard are all inconsistent with each other. This project creates
the canonical truth by measuring what's actually there.

## Success metrics
- All 4 surfaces fully extracted (100% coverage)
- Zero unresolved critical drift items
- Figma variables file published with canonical tokens
- Design system site live with Foundations + Components + Patterns sections
- Design team can run drift detection in < 5 minutes per sprint

## Non-goals
- We do NOT redesign the product (we document and systematize what exists)
- We do NOT implement design changes (we flag them, devs implement)
- We do NOT replace Figma (we feed into it)

## Owner
Suneet Jagdev — Senior PM, BrightChamps
