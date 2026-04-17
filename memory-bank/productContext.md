# Product Context

## The problem
BrightChamps has 4 surfaces: landing pages, student app, teacher app, admin dashboard.
These were built by different teams, at different times, with no shared design system.
The result: inconsistent colors, spacing, typography, and components everywhere.
Nobody knows what the "right" design is. Even Figma files are inconsistent with live.

## Who this is for
1. **Design team** — need a single source of truth to design against
2. **Engineering team** — need a token file and CSS variables to implement consistently
3. **Suneet (PM)** — needs to see the full picture of what needs fixing and in what order

## User journeys this enables

### For designers
"Before I design a new feature, I open brightchamps.design to find the correct color
token, spacing value, and component pattern. I know it's correct because it reflects
what's actually in the live product."

### For engineers
"Before I implement a new component, I import from tokens.css and use the CSS
variables. I never hardcode a hex value. If a designer changes a token in Figma and
approves it, my component updates automatically."

### For Suneet (drift review)
"Every sprint, I run drift detection. It shows me which surfaces have drifted from
the design system. I prioritize which to fix, and the engineering team gets a
specific list of what to update."

## The Atlassian model
atlassian.design is the reference. It has:
- Foundations (tokens, color, typography, spacing, grid)
- Components (with usage guidelines, variants, code)
- Patterns (common flows, page templates)
- Tools (Figma libraries, plugins)

brightchamps.design will mirror this structure, built from real extracted data.

## What makes this different from a manual design system
The system is MEASURED, not assumed. Every token has a source (Figma or DOM),
a confidence level, and a drift status. The design team doesn't decide what
the system should be — they decide what the conflicts mean.
