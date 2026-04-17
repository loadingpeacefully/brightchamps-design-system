# Changelog

All notable changes to the BrightChamps Design System will be documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Initial project scaffold with full Claude Code intelligence architecture
- surfaces.config.ts with all four surfaces configured
- DesignToken schema with source, confidence, and surface fields
- Memory bank with full project context seeded from planning session
- ADRs 0001–0005 capturing key architectural decisions
- Skills: extract, drift-detect, handoff, adr-create, publish, session-log
- Agents: resolver, reviewer, investigator
- Drift detection pipeline architecture
- Living PRD v0.1

### Notes
- Surface URLs and Figma file IDs are placeholders — fill in surfaces.config.ts
- Admin dashboard has no Figma; DOM extraction will be its source of truth
