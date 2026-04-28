---
title: Student Dashboard /my-feed — Component Match Report
date: 2026-04-29
production: EznPshYN5XVc49fQSUOSEQ → My Feed (9325:8437)
dsLibrary: 8eNJf875iY9HISEsczDfOh → Screens / Student Dashboard
---

# Student Dashboard /my-feed — Match Report

## Summary

| Status | Count | % |
|---|---:|---:|
| ✅ Match | 2 | 11% |
| ⚠️ Drift | 11 | 61% |
| ❌ Missing | 5 | 28% |
| 🔲 CDN | 4 | n/a |

**Overall match rate: 72%**

## Components that fit DS library

- **Course-progress card** structure maps to a Card/with-progress variant — but the DS Card has no `lessons / quiz / assignments` triple-counter slot. New variant needed.
- **Comment box** maps to a new pattern — file as Tier 5 component.
- **Right sidebar** matches DS RightSideBar shape at a different width (362 vs 460).

## New DC tickets

3 new color tickets surfaced (DC-049 / DC-050 / DC-051) — all hardcoded accent colors in the feed area without DS equivalents.

## Manual actions

1. Build "CourseProgressCard" molecule — tier 5
2. Build "CommentBox" molecule — tier 5
3. Tokenize feed-accent colors OR codemod to existing feedback palette
