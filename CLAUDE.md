# Claude Code Briefing — WhisperCue

**Project:** WhisperCue — real-time cueing app for yoga teachers
**Last updated:** March 25, 2026

---

## Owner Background

- Yoga teacher, product and experience builder and founder — the app content (sequences, meditations) comes from real classes
- Staff-level PM  (not a professional developer)
- Uses Claude Code (Opus 4.6) for writing code and running commands
- Previously built a React Native version (FlowCue) that got over-scoped — this time keeping it simple
- Cares deeply about design and UX

---

## Critical Rules

### NEVER One-Shot Build
- Do NOT try to build entire features from start to finish in one go
- Work incrementally — one small piece at a time
- Each change should be testable and verifiable independently

### Incremental Workflow
1. **Read** the relevant docs/plans first
2. **Propose** what you're about to do (explain the what and why)
3. **Do ONE thing** (one small change)
4. **Have owner verify** it works before proceeding
5. **Then move** to the next thing

### Scope Discipline
- We are building **Phase 0 only to start**: 1 seeded sequence (~20 postures) + Live Teach screen
- Do NOT add Phase 1/2/3 features unless explicitly asked
- No backend, no auth, no AI, no database — just local JSON and screens
- When in doubt, build less

### Communication
- Explain what you did and why after each change
- Explain recommendations so owner understands the tradeoffs
- Test each piece before moving on
- If something fails, STOP and debug together rather than plowing ahead
- Ask owner to confirm things work before proceeding

---

## Current State

### Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo SDK 54 (managed workflow) |
| Navigation | Expo Router v6 (file-based) |
| Language | TypeScript |
| Data | Local JSON (no backend for Phase 0) |
| Testing | Expo Go on physical device |
| Design tools | Stitch (design systems), Pencil (.pen files) — on request |

### Project Structure
```
whisper-cue-app/
├── app/                  # Screens (file-based routing)
│   ├── _layout.tsx       # Root layout (Slot-based)
│   ├── index.tsx         # Home screen
│   └── live-teach.tsx    # Live teach screen
├── src/
│   ├── data/             # Seed data (JSON)
│   └── types/            # TypeScript types
├── docs/                 # PRD and project docs
└── assets/               # App icons and images
```

### Phase 0 Progress
- [x] Expo project scaffolded
- [x] Expo Router navigation working
- [x] Verified on device via Expo Go
- [x] TypeScript data model (posture/sequence types)
- [ ] Seed data (1 sequence, ~20 postures)
- [ ] Live Teach screen

---

## Debugging Protocol

When something fails:
1. **STOP** — don't plow ahead with more changes
2. **Add logging** — targeted console.log to narrow down the issue
3. **Have owner reproduce** — let them trigger the bug and share output
4. **Read the logs** — let evidence point to root cause
5. **Propose** — suggest a specific fix
6. **Execute** — one focused change
7. **Verify** — confirm with owner it worked
8. **Clean up** — remove debug logging

---

## Expo Go Gotchas

- Current Expo Go on App Store is **SDK 54** — project must match
- `Stack` from expo-router had type errors on SDK 54; using `Slot` in _layout.tsx instead
- Shake phone to open dev menu and reload
- If hot reload fails, re-scan QR code from Expo Go home screen

---

## Maintenance

- **README.md** — keep updated when pushing to git, especially at milestones (current status checklist, project structure, tech stack changes)
- **CLAUDE.md** (this file) — update when architecture decisions change, new gotchas are discovered, or phase progress advances
- **PRD** — lives at docs/whispercue_prd.docx

---

## Summary

**Work small. Work incrementally. Communicate clearly. Test frequently. Resist scope creep.**
