# WhisperCue

Real-time cueing app for yoga teachers. A calm, glanceable teleprompter for sequences and guided meditations.

## Current Status

**Phase 0 -- Complete**

- Home screen with sequence card
- Sequence Overview with 13 expandable section cards
- Live Teach with karaoke-style cueing, progress ring, section labels, adjustments, breath counts, pause/resume
- Practice Complete with animated icon, glow ring, and return CTA

**Seed data:** "Root & Rise -- 60 Min Power Vinyasa" with 133 steps across 13 sections.

**Phase 1 -- In Progress**

- Supabase backend (Postgres + Auth)
- 136 poses seeded in database
- Auth screen (email/password + Google OAuth)
- Auth guard in root layout

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo SDK 54 (managed workflow) |
| Navigation | Expo Router v6 (file-based) |
| Language | TypeScript |
| Backend | Supabase (Postgres + Auth) |
| Data | Local JSON seed data + Supabase |
| Design | Raga color palette, Cormorant Garamond + system sans typography, watercolor pose icons |

## Getting Started

```bash
git clone git@github.com:jkerner/whisper-cue-app.git
cd whisper-cue-app
npm install --legacy-peer-deps

# Create .env with Supabase credentials
cp .env.example .env     # or create manually with:
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

npx expo start           # Device via Expo Go
npx expo start -c --web  # Web browser
```

Web requires `react-dom` and `react-native-web` (already in dependencies).

## Project Structure

```
whisper-cue-app/
├── app/
│   ├── _layout.tsx            # Root layout (auth guard, font loading)
│   ├── index.tsx              # Home screen
│   ├── auth.tsx               # Auth screen (email/password + Google)
│   ├── sequence.tsx           # Sequence overview (section cards)
│   ├── live-teach.tsx         # Live teach (karaoke cueing)
│   └── practice-complete.tsx  # End-of-class screen
├── src/
│   ├── lib/
│   │   └── supabase.ts        # Supabase client
│   ├── data/                  # Seed data (JSON)
│   └── types/                 # TypeScript types
├── assets/
│   └── poses/                 # Watercolor pose icon PNGs
├── docs/
│   ├── design.md              # Design system and screen specs
│   └── whispercue_prd.docx    # Product requirements
└── CLAUDE.md                  # AI assistant briefing
```

## Pose Library

Source pose data lives in `src/data/`. The editable reference file is maintained at `~/Whisper cue content/source_poses.md`.

## Roadmap

- **Phase 0** -- MVP: 1 sequence, live teach mode (complete)
- **Phase 1** -- Launch: Auth, sequence builder, full pose library, seeded content (in progress)
- **Phase 2** -- AI: Drafting, live suggestions, audio detection, meditation builder
- **Phase 3** -- Community: Marketplace, multi-teacher, music integration, Apple Watch
