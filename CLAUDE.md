# Claude Code Briefing -- WhisperCue

**Project:** WhisperCue -- real-time cueing app for yoga teachers
**Last updated:** March 28, 2026

---

## Owner Background

- Yoga teacher, product and experience builder and founder -- the app content (sequences, meditations) comes from real classes
- Staff-level PM  (not a professional developer)
- Uses Claude Code (Opus 4.6) for writing code and running commands
- Previously built a React Native version (FlowCue) that got over-scoped -- this time keeping it simple
- Cares deeply about design and UX

---

## Critical Rules

### NEVER One-Shot Build
- Do NOT try to build entire features from start to finish in one go
- Work incrementally -- one small piece at a time
- Each change should be testable and verifiable independently

### Incremental Workflow
1. **Read** the relevant docs/plans first
2. **Propose** what you're about to do (explain the what and why)
3. **Do ONE thing** (one small change)
4. **Have owner verify** it works before proceeding
5. **Then move** to the next thing

### Scope Discipline
- Phase 0 is complete; we are now in **Phase 1** (auth, Supabase, sequence builder)
- Do NOT add Phase 2/3 features unless explicitly asked
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
| Backend | Supabase (Postgres + Auth) |
| Data | Local JSON seed data + Supabase for Phase 1 |
| Testing | Expo Go on physical device |
| Design tools | Stitch (design systems), Pencil (.pen files) -- on request |

### Project Structure
```
whisper-cue-app/
├── app/                  # Screens (file-based routing)
│   ├── _layout.tsx       # Root layout (auth guard, font loading)
│   ├── index.tsx         # Home screen
│   ├── auth.tsx          # Auth screen (email/password + Google OAuth)
│   ├── sequence.tsx      # Sequence overview (section cards)
│   ├── live-teach.tsx    # Live teach screen (karaoke cueing)
│   └── practice-complete.tsx  # End-of-class screen
├── src/
│   ├── lib/
│   │   └── supabase.ts   # Supabase client (reads from .env)
│   ├── data/             # Seed data (JSON)
│   └── types/            # TypeScript types
├── docs/
│   ├── design.md         # Design system and screen specs
│   └── whispercue_prd.docx
├── .env                  # Supabase credentials (git-ignored)
└── assets/
    ├── fonts/            # Circular Std (Book, Bold, Black), SQ Market (Light, Bold)
    ├── poses/            # Watercolor pose icon PNGs (transparent bg)
    └── ...               # App icons and images
```

### Pose Icon Rules
- All pose icon PNGs in `assets/poses/` MUST have transparent backgrounds (no dark squares)
- Icons float on the app's `#030303` Void background -- black on black, no visible container
- When regenerating or adding new pose icons, always remove dark backgrounds before committing
- Source .pen file at `docs/design/pose-icons.pen` -- images may not persist in Pencil, but exported PNGs are the source of truth

### Phase 0 Progress
- [x] Expo project scaffolded
- [x] Expo Router navigation working
- [x] Verified on device via Expo Go
- [x] TypeScript data model (posture/sequence types)
- [x] Seed data (1 sequence, ~20 postures)
- [x] Live Teach screen

### Phase 1 Progress
- [x] Supabase project created + database schema
- [x] Poses seeded (136 entries) with TWS 200hr Manual cue language
- [x] Auth screen + auth guard (email/password + Google OAuth UI)
- [x] Animated home screen with saved sequences list
- [x] Sequence builder — create, edit, reorder sections
- [x] Section editor — add/remove/reorder poses with cues
- [x] Save sequences to Supabase (upsert on edit)
- [x] Vinyasa Flow 60-min pre-filled template
- [x] Share a sequence — public /s/[token] view, no auth required
- [x] Universal links configured (whispercue.app/s/[token] → app)
- [x] EAS Build + TestFlight (build #9)
- [x] Vercel hosting at whispercue.app
- [x] Privacy policy at whispercue.app/privacy
- [x] Terms of service at whispercue.app/terms
- [x] support@whispercue.app email (Microsoft 365)
- [ ] Bundle ID fix (com.anonymous.whisper-cue-app → app.whispercue)
- [ ] Auth — Apple Sign-In (required for App Store)
- [ ] Auth — Phone OTP via Twilio (production, add before App Store)
- [ ] Wire Live Teach to Supabase sequences

---

## Debugging Protocol

When something fails:
1. **STOP** -- don't plow ahead with more changes
2. **Add logging** -- targeted console.log to narrow down the issue
3. **Have owner reproduce** -- let them trigger the bug and share output
4. **Read the logs** -- let evidence point to root cause
5. **Propose** -- suggest a specific fix
6. **Execute** -- one focused change
7. **Verify** -- confirm with owner it worked
8. **Clean up** -- remove debug logging

---

## Expo Go Gotchas

- Current Expo Go on App Store is **SDK 54** -- project must match
- `Stack` from expo-router had type errors on SDK 54; using `Slot` in _layout.tsx instead
- Shake phone to open dev menu and reload
- If hot reload fails, re-scan QR code from Expo Go home screen
- Font loading must be **non-blocking** -- use `Font.loadAsync` inside a `useEffect` with `.catch()` so the app renders immediately with system fonts while custom fonts load
- Use `--legacy-peer-deps` flag when running `npm install` to avoid peer dependency conflicts
- Web requires `react-dom` and `react-native-web` packages (already in dependencies)
- **`.env` file required** -- Supabase credentials live in `.env` (git-ignored). Copy from another dev or create with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## Maintenance

- **README.md** -- keep updated when pushing to git, especially at milestones (current status checklist, project structure, tech stack changes)
- **CLAUDE.md** (this file) -- update when architecture decisions change, new gotchas are discovered, or phase progress advances
- **PRD** -- lives at docs/whispercue_prd.docx

---

## Summary

**Work small. Work incrementally. Communicate clearly. Test frequently. Resist scope creep.**
