# WhisperCue

Real-time cueing app for yoga teachers. A calm, glanceable teleprompter for sequences and guided meditations.

## Current Status

**Phase 0 — Complete**
- Home screen, sequence overview, live teach with karaoke-style cueing, practice complete screen

**Phase 1 — Largely Complete**
- [x] Supabase backend (Postgres + Auth)
- [x] 136 poses seeded with authentic TWS 200hr Manual cue language
- [x] Auth screen (email/password + Google OAuth) with auth guard
- [x] Animated home screen with saved sequences list
- [x] Sequence builder — create, edit, reorder sections
- [x] Section editor — add/remove/reorder poses with cues
- [x] Save sequences to Supabase (upsert on edit)
- [x] Vinyasa Flow 60-min pre-filled template
- [x] Share a sequence — public `/s/[token]` view, no auth required
- [x] Universal links configured (`whispercue.app/s/[token]` → app)
- [x] EAS Build + TestFlight (build #9)
- [x] Vercel hosting at `whispercue.app`
- [x] Privacy policy at `whispercue.app/privacy`
- [x] Terms of service at `whispercue.app/terms`
- [x] `support@whispercue.app` email (Microsoft 365)

**Still needed for Phase 1**
- [ ] Bundle ID fix (`com.anonymous.whisper-cue-app` → `app.whispercue`)
- [ ] Apple Sign-In (required for App Store)
- [ ] Phone OTP via Twilio
- [ ] Wire Live Teach to Supabase sequences

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo SDK 54 (managed workflow) |
| Navigation | Expo Router v6 (file-based) |
| Language | TypeScript |
| Backend | Supabase (Postgres + Auth) |
| Hosting | Vercel (static, `public/` directory) |
| Builds | EAS Build + EAS Submit |
| Design | Dark theme (`#030303`), cyan accents (`#43B1E8`), Circular Std + Cormorant Garamond + Dancing Script |

## Getting Started

```bash
git clone git@github.com:jkerner/whisper-cue-app.git
cd whisper-cue-app
npm install --legacy-peer-deps

# Create .env with Supabase credentials
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

npx expo start           # Device via Expo Go
npx expo start -c --web  # Web browser
```

Run Expo commands from the repo root (`/Users/julieshome/Code/whisper-cue-app`).

## Project Structure

```
whisper-cue-app/
├── app/
│   ├── _layout.tsx            # Root layout (auth guard, font loading)
│   ├── index.tsx              # Home screen (animated, saved sequences)
│   ├── auth.tsx               # Auth screen
│   ├── builder.tsx            # Sequence builder
│   ├── builder-entry.tsx      # New sequence entry screen
│   ├── section-editor.tsx     # Pose picker + cue editor
│   ├── live-teach.tsx         # Live teach (karaoke cueing)
│   ├── practice-complete.tsx  # End-of-class screen
│   ├── account.tsx            # Account screen
│   └── s/[token].tsx          # Public shared sequence view
├── src/
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   └── builder-store.ts   # In-memory sequence state
│   └── data/
│       ├── poses.json         # 136 poses
│       └── pose-cues.json     # 120+ curated pose cues (TWS language)
├── public/
│   ├── privacy.html           # Privacy policy
│   ├── terms.html             # Terms of service
│   └── .well-known/
│       └── apple-app-site-association  # Universal links config
├── assets/
│   ├── fonts/                 # Circular Std, SQ Market
│   └── poses/                 # Watercolor pose icon PNGs (transparent bg)
├── docs/
│   ├── feature-briefs.md      # Product roadmap and feature specs
│   └── whispercue_prd.docx    # Full PRD
├── vercel.json                # Static hosting config
└── CLAUDE.md                  # AI assistant briefing
```

## Roadmap

- **Phase 0** — MVP: 1 sequence, live teach mode ✓
- **Phase 1** — Launch: Auth, sequence builder, sharing, App Store submission (nearly complete)
- **Phase 2** — Audio: Text-to-speech cues via AirPods, Apple Watch haptics
- **Phase 3** — AI + Community: Post-class ratings, AI improvement suggestions, marketplace
