# ADR-0001: Use Architecture Decision Records

## Status
Accepted

## Date
2026-04-15

## Context
This is an AI-assisted project built with Claude Code. Without explicit records
of decisions, Claude starts each session without context on *why* things are the
way they are — leading to reversed decisions, re-debated choices, and inconsistent code.

## Decision
Maintain ADRs in docs/decisions/ for all significant architectural decisions.
Reference them from CLAUDE.md so Claude loads them on demand.

## Consequences
- Every significant decision has a permanent record
- Claude Code reads relevant ADRs before making changes
- New team members can understand "why" without asking

## Confidence
High — standard practice, no downsides for a project this size.
