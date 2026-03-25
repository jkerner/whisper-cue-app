# WhisperCue

Real-time, karaoke-style cueing for yoga teachers. A calm, glanceable teleprompter for sequences and guided meditations.

## What It Does

WhisperCue helps yoga teachers deliver classes with confidence by providing real-time cueing they can glance at mid-class — without breaking their flow or reaching for notes.

## Current Status

**Phase 0 — MVP (in progress)**
- [x] Expo project scaffolded (SDK 54, Expo Router)
- [x] Verified working on device via Expo Go
- [ ] TypeScript data model for postures/sequences
- [ ] Seed data (1 sequence, ~20 postures)
- [ ] Live Teach screen

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo (managed workflow) |
| Navigation | Expo Router (file-based) |
| Language | TypeScript |
| Testing | Expo Go on device |

## Getting Started

```bash
git clone git@github.com:jkerner/whisper-cue-app.git
cd whisper-cue-app
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

## Project Structure

```
whisper-cue-app/
├── app/                  # Screens (file-based routing)
│   ├── _layout.tsx       # Root layout
│   ├── index.tsx         # Home screen
│   └── live-teach.tsx    # Live teach screen
├── src/
│   ├── data/             # Seed data (JSON)
│   └── types/            # TypeScript types
├── docs/                 # PRD and project docs
└── assets/               # App icons and images
```

## Roadmap

- **Phase 0** — MVP: 1 sequence, live teach mode
- **Phase 1** — Launch: Auth, sequence builder, full pose library, seeded content
- **Phase 2** — AI: Drafting, live suggestions, audio detection, meditation builder
- **Phase 3** — Community: Marketplace, multi-teacher, music integration, Apple Watch
