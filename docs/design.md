# Saraswathi

## Product Overview

**The Pitch:** WhisperCue is a pocket teleprompter for yoga teachers and meditation guides. It provides glanceable, karaoke-style cueing that keeps teachers in the flow of their class without constantly losing their place in a notebook.

**For:** Yoga teachers, meditation facilitators, breathwork guides who need subtle, low-light guidance mid-class.

**Device:** Mobile

**MVP Phase 0 Roadmap:** The initial focus heavily prioritizes the Home screen (index) and the core Live Teach screen to establish the essential karaoke-style, glanceable, nocturnal design principles before expanding into sequence management.

**Core Features:**
- Sequence Builder
- Templates + Modify
- AI Recommendations
- Live Teach Mode

**Design Direction:** Ethereal, soft, nocturnal — strictly dark mode with blurred glowing accents, minimalist dark UI, elegant typography, and custom illustrative icons for poses and navigation. Three-font type system: Cormorant Garamond for display/Sanskrit, SQ Market for headings and UI, Circular for body text — optimized for low-light studio environments. All screens must be strictly in dark mode.

**Inspired by:** Endel, Calm

---

## Screens

- **Home:** Dashboard featuring AI recommendations and quick access to templates
- **Library:** Overview of saved sequences and guided meditations
- **Sequence Builder:** Interface to create and modify sequences
- **Sequence Detail:** High-level timeline of poses and total duration
- **Live Teach:** Full-screen karaoke-style teleprompter for active teaching
- **Post-Class Wrap:** Brief summary of duration and post-class notes

---

## Key Flows

**Start a Live Class:** Teacher selects a sequence and begins teaching.

1. User is on **Home** → sees AI recommendations or navigates to **Library**
2. User clicks `Vinyasa Flow - 60 Min` → opens **Sequence Detail**
3. User clicks `Begin Class` → opens **Live Teach** in full screen mode
4. User taps screen edge → advances to next cue, previous cue dims
5. User reaches end → sees **Post-Class Wrap** with total time

---

## Design System

### Color Palette — Raga

_Drawn from sky at dusk, water at dawn, and the indigo of deep meditation._

| Role | Token | Name | Value | Notes |
|------|-------|------|-------|-------|
| Background | `bg-base` | Void | `#030303` | App background |
| Surface 1 | `surface-1` | Cave | `#0d1117` | Cards, bottom sheets |
| Surface 2 | `surface-2` | Dusk | `#131820` | Elevated surfaces, modals |
| Surface 3 | `surface-3` | Twilight | `#1a2230` | Highest elevation, active states |
| Primary | `accent-primary` | Akasha | `#43B1E8` | Active cues, progress rings, key CTAs |
| Alert | `accent-alert` | Vayu | `#7999C1` | Secondary accent, inactive cues, muted text |
| Data | `accent-data` | Chandra | `#AAA8D6` | Ambient glows, data visualization |
| Warm | `accent-warm` | Agni | `#F59E0B` | Highlights, warnings |
| Text | — | — | `#F8F9FA` | Primary text, active teleprompter line |

### Typography

Three font families: **Cormorant Garamond** for display/Sanskrit, **SQ Market** for headings and UI, **Circular** for body text.

| Role | Font | Weight | Size | Notes |
|------|------|--------|------|-------|
| Display / Sanskrit | Cormorant Garamond | Light Italic | 48–96px | tracking: −0.01em |
| Sanskrit Label | Cormorant Garamond | Italic | 13–16px | color: accent-primary |
| Heading / Pose Name | SQ Market | Bold | 24–36px | tracking: −0.02em |
| Cue / Body Text | Circular | Regular | 14–16px | leading: 1.7, max-width: 480px |
| Label / Eyebrow | SQ Market | Regular | 9–10px | tracking: 0.35em, UPPERCASE |
| Timer / Mono | SQ Market | Light | 32–48px | tabular nums |

### Iconography — Bindu

_Bindu — the point from which all creation emerges._

**UI Icons**

| Property | Rule |
|----------|------|
| **Style** | 1.5px stroke, rounded caps, rounded joins. No fills. Evokes the hand-drawn. Use Lucide or custom SVG set. |
| **Size** | 16px (inline), 20px (nav/action), 24px (hero/empty state). |
| **Color** | Default: 50% white. Active/selected: `#43B1E8` (Akasha) with a subtle glow. Destructive: `#F59E0B` (Agni). |

**Pose Illustrations**

Yoga pose figures use a watercolor illustration style — bold, simple silhouettes with soft color washes. The human form is the subject; never reduce poses to abstract geometric shapes.

| Property | Rule |
|----------|------|
| **Style** | Watercolor silhouettes — bold shapes with soft, bleeding color washes. Hand-painted feel, minimal detail. Must read clearly at small sizes (24–48px). |
| **Color Washes** | Each pose gets a single dominant color wash. Rotate through palette-adjacent tones: indigo, teal, coral, amber, sage, lavender, terracotta. No outlines. |
| **Diversity** | Figures represent diverse body types, skin tones, genders, hair textures, and clothing. The practice is for everyone. |
| **Backgrounds** | MUST be transparent. Icons float on the app's `#030303` Void background — black on black, no visible square or container behind the figure. When exporting or regenerating icons, always strip dark pixels (r<45, g<45, b<55) to ensure transparency. |
| **Sizes** | 24px (inline label), 48px (sequence list card), 96px (Live Teach active pose), 150px (library/detail hero). |
| **Format** | PNG with transparency, generated from AI watercolor prompts. Source `.pen` file at `docs/design/pose-icons.pen`. |

**Pose Library (Phase 0)**

All icons exported as 2x PNG with transparency at `assets/poses/`.

| Pose | Sanskrit | File |
|------|----------|------|
| Easy Seat | sukhasana | `assets/poses/sukhasana.png` |
| Garland | mālāsana | `assets/poses/malasana.png` |
| Warrior II | vīrabhadrāsana II | `assets/poses/virabhadrasana-ii.png` |
| Lotus | padmāsana | `assets/poses/padmasana.png` |
| Tree | vṛkṣāsana | `assets/poses/vrksasana.png` |
| Crow | bakāsana | `assets/poses/bakasana.png` |
| Low Lunge | añjaneyāsana | `assets/poses/anjaneyasana.png` |
| Downward Dog | adho mukha śvānāsana | `assets/poses/adho-mukha-svanasana.png` |
| Hero | vīrāsana | `assets/poses/virasana.png` |
| Butterfly | baddha koṇāsana | `assets/poses/baddha-konasana.png` |
| Low Plank | caturaṅga daṇḍāsana | `assets/poses/chaturanga-dandasana.png` |
| Wheel | ūrdhva dhanurāsana | `assets/poses/urdhva-dhanurasana.png` |
| Whisper Cue (logo) | — | `assets/poses/whisper-cue.png` |

### Style Notes

The UI is almost entirely borderless. Hierarchy is established through typography scale and ambient, heavily blurred (100px blur) radial gradients acting as backlights for active elements.

### Design Tokens

```
bg-base:        #030303   (Void)
surface-1:      #0d1117   (Cave)
surface-2:      #131820   (Dusk)
surface-3:      #1a2230   (Twilight)
accent-primary: #43B1E8   (Akasha)
accent-alert:   #7999C1   (Vayu)
accent-data:    #AAA8D6   (Chandra)
accent-warm:    #F59E0B   (Agni)
text:           #F8F9FA

font-display:   Cormorant Garamond
font-heading:   SQ Market
font-body:      Circular

radius-sm:   8px
radius-md:   16px
radius-full: 9999px

spacing-sm:  8px
spacing-md:  16px
spacing-lg:  24px
spacing-xl:  40px
```

---

## Screen Specifications

### Home (index.tsx)

**Purpose:** The main landing screen. Simple entry point to begin teaching.

**Layout:** Centered content within SafeAreaView. `#030303` background. Strictly dark mode.

**Key Elements:**
- **Logo Icon:** WhisperCue watercolor icon (120px, circular clip), centered
- **Title:** Cormorant Garamond Light Italic, 36px, `#F8F9FA`, "Whisper Cue"
- **Subtitle:** 9px, weight 500, tracking 3, `#7999C1`, uppercase, "REAL-TIME CUEING FOR YOGA TEACHERS"
- **Sequence Card:** `#0d1117` background, 16px radius, full width, 24px padding. Contains:
  - Eyebrow: 9px, `#43B1E8`, tracking 3.5, weight 500, "READY TO TEACH"
  - Title: Cormorant Garamond Bold, 20px, `#F8F9FA`
  - Meta: 9px, `#7999C1`, tracking 2, "133 CUES . ~60 MIN"

**Interactions:**
- **Tap Sequence Card:** Pushes to Sequence Overview (`/sequence`)

### Library

**Purpose:** Select a sequence to teach or edit.

**Layout:** Standard mobile list layout. Clean top header, scrollable list of cards. A soft `#AAA8D6` radial gradient bleeds from the top right corner. Strictly dark mode.

**Key Elements:**
- **Header:** SQ Market Bold, 28px, "My Sequences", left-aligned
- **Sequence Card:** `#0d1117` background, 16px radius. Contains title (SQ Market Bold, 16px, white), illustrative icon of the flow's peak pose (`#43B1E8`), and duration/type (SQ Market Regular, 9px, `#7999C1`, uppercase)
- **Create FAB:** Bottom right, `#43B1E8` background, `+` icon in `#030303`

**States:**
- **Empty:** "No sequences yet. Tap + to create your first flow." vertically centered
- **Loading:** Skeleton cards with pulsing `#0d1117` background

**Interactions:**
- **Tap Card:** Navigates to Sequence Detail. Slide-left transition.
- **Tap FAB:** Opens Sequence Builder. Slide-up transition.

### Sequence Builder

**Purpose:** Create new sequences or modify existing templates.

**Layout:** Split view. Top half allows editing the sequence title and settings. Bottom half is a drag-and-drop list of cues/poses. Strictly dark mode.

**Key Elements:**
- **Header Inputs:** Title text input (SQ Market Bold, 28px, borderless), total duration estimate
- **Pose List:** Vertically sortable list of text inputs alongside small illustrative pose icons. Each row has a drag handle and duration selector
- **Add Pose Button:** Minimalist text button (SQ Market Regular, 10px, uppercase, `#43B1E8`) "+ Add Cue"
- **Save CTA:** Primary bottom button to finalize the sequence

**Interactions:**
- **Drag & Drop:** Reorder cues
- **Save:** Returns to Library or proceeds to Sequence Detail

### Sequence Overview (sequence.tsx)

**Purpose:** Review the class plan before hitting "Begin."

**Layout:** Back arrow top-left, title area with eyebrow/title/stats, scrollable section cards, sticky bottom CTA. Strictly dark mode.

**Key Elements:**
- **Back Arrow:** Feather `arrow-left`, 20px, `#43B1E8`
- **Eyebrow:** 9px, `#7999C1`, tracking 3.5, "SEQUENCE"
- **Class Title:** Cormorant Garamond Bold, 26px, `#F8F9FA`
- **Stats Row:** Four stats (Cues, Poses, Sections, Minutes) separated by 1px `#1a2230` dividers. Values: 20px light weight. Labels: 8px, `#7999C1`, tracking 2
- **Section Cards:** `#0d1117` background, 12px radius. Each has a Feather icon in a `#131820` pill (32px), section name (13px, weight 600, tracking 2), and pose/cue count. Chevron toggles expand/collapse.
- **Expanded Pose List:** Indented under card header. 4px `#1a2230` dots, pose name (14px, 0.8 opacity), Sanskrit in uppercase `#43B1E8` 9px
- **Begin CTA:** Full-width `#43B1E8` button, 16px radius, "BEGIN CLASS" in `#030303`

**Interactions:**
- **Tap Back Arrow:** Returns to Home
- **Tap Section Card:** Expands/collapses pose list within that section
- **Tap Begin CTA:** Pushes to Live Teach screen

### Live Teach (live-teach.tsx)

**Purpose:** The core teleprompter. Ultra-glanceable cueing.

**Layout:** Edge-to-edge full screen (`paddingTop: 60`). Strictly dark mode. Central ring is the focal point containing pose info. Cue text below. Up Next card and back hint at bottom.

**Top Bar:**
- **Left cluster:** List icon button (`#0d1117` pill, 36px) to return to sequence overview + section name (12px, weight 600) + step counter (11px, `#7999C1`, tabular nums, e.g., "42 / 133")
- **Right cluster:** Elapsed class timer (15px, `#7999C1`, weight 300, tabular nums) + pause/play button (`#0d1117` pill, 36px). Paused state shows "PAUSED" banner (9px, `#43B1E8`, tracking 4)

**Progress Bar:**
- 2px horizontal bar below top bar, `marginHorizontal: 24`
- Track: `#1a2230`, Fill: `#43B1E8` -- width proportional to `(currentIndex + 1) / totalSteps`

**Central Ring (focal point):**
- Circle ~72% of screen width, `#43B1E8` 2.5px stroke (progress arc via SVG `stroke-dashoffset`)
- Dashed inner decorative ring: `#1a2230`, 1px, dash pattern 4/6
- Contents vertically centered inside:
  - **Breath Label (conditional):** 10px, `#43B1E8`, weight 500, tracking 3 (e.g., "HOLD 5 BREATHS")
  - **Pose Name:** Cormorant Garamond Bold, 30px, `#F8F9FA`, centered
  - **Sanskrit Label:** Cormorant Garamond Italic, 16px, `#AAA8D6` (Chandra), centered

**Cue Text (below ring):**
- System sans, 16px, `#F8F9FA`, weight 400, line-height 27, centered, opacity 0.85
- All cues for the step joined with spaces

**Adjustment Callout (conditional):**
- Lightning bolt emoji + 10px, `#F59E0B` (Agni), weight 500, tracking 2, uppercase, centered, max-width 300
- Only shown when step has an `adjustment` field

**Up Next Card (tappable -- primary navigation):**
- `#0d1117` background, 12px radius, 1px `#1a2230` border, `marginHorizontal: 24`
- **Eyebrow row:** "UP NEXT" (9px, `#7999C1`, weight 500, tracking 3) + arrow (16px, `#43B1E8`)
- **Pose Name:** Cormorant Garamond Bold, 18px, `#F8F9FA`
- **Sanskrit:** Cormorant Garamond Italic, 13px, `#43B1E8`

**Back Hint (bottom):**
- Centered "PREVIOUS" text, 9px, `#7999C1`, weight 500, tracking 2, opacity 0.4

**States:**
- **End of Sequence:** Up Next card reads "PRACTICE COMPLETE" / "Return to stillness". Tapping navigates to practice-complete screen via `router.replace`.
- **Paused:** Timer stops, play icon replaces pause icon (turns `#43B1E8`), "PAUSED" banner appears

**Transitions:**
- Pose changes use a 150ms fade-out / 200ms fade-in Animated sequence on the ring area and cue text

**Interactions:**
- **Tap Up Next card:** Advances to next pose (or to Practice Complete on last step)
- **Tap back hint:** Go back to previous pose
- **Tap pause/play button:** Toggle timer pause
- **Tap list icon:** Return to sequence overview

### Practice Complete (practice-complete.tsx)

**Purpose:** Confirmation the class is done. Warm, quiet celebration.

**Layout:** Centered content, highly minimalist. Strictly dark mode. `SafeAreaView` with 32px padding.

**Key Elements:**
- **Floating Icon:** Sukhasana watercolor pose image (120px) inside a 180px area with a continuous gentle float animation (translateY oscillates +/-6px over 8s). Icon pops in with spring scale (0.6 to 1).
- **Glow Ring:** 180px circle, 1.5px `#43B1E8` border, scales from 0.8 to 1 with spring animation. Appears with 400ms delay.
- **Message:** Cormorant Garamond Italic, 20px, `#7999C1`, centered, line-height 32, max-width 280. Text: "You gave your students a beautiful practice." Fades in at 900ms.
- **Return CTA:** Outline button, 1px `#7999C1` border, 16px radius, "RETURN HOME" in 10px, weight 600, `#F8F9FA`, tracking 3. Fades in at 1800ms.

**Animation Sequence:**
1. Icon and scale pop (0ms)
2. Ring expands (400ms delay)
3. Message text fades in (900ms delay)
4. Button fades in (1800ms delay)
5. Continuous gentle float loop (ongoing)

**Interactions:**
- **Tap Return CTA:** Replaces to Home screen (`/`).

---

## Voice & Tone

WhisperCue speaks with the voice of an experienced teacher who trusts their students. Not authoritative — _authoritative_. The difference is the presence of warmth. Instructions are direct and embodied. Sanskrit names are always included, always lowercase in secondary position. Error states are gentle. Encouragement is earned, not automatic.

| Context | Example |
|---------|---------|
| Primary Cue | "Root through the four corners of your back foot. Let the hip open as you exhale." |
| Adjustment | "Watch the front knee — let it track over the second toe." |
| Transition | "On your next exhale, we'll move forward into Warrior I…" |
| Empty State | "Your sequence is waiting. Begin when you're ready." |
| Error (gentle) | "Something shifted. Take a breath — we'll pick up where you left off." |

---

## Core UI Components

_Each component is a dharana — a single point of concentration._

### Live Teach — Pose Card

Vertical stack, centered:
1. **Hold Label:** SQ Market Regular, 9–10px, uppercase, tracking 0.35em, `#43B1E8`
2. **Pose Name:** SQ Market Bold, 28–32px, `#F8F9FA`
3. **Sanskrit Name:** Cormorant Garamond Italic, 14–16px, `#43B1E8`
4. **Timer Arc:** SVG circle with stroke-dashoffset, SQ Market Light, 32–48px, tabular nums, `#43B1E8`
5. **Cue Text:** Circular Regular, 14–16px, `#7999C1`, leading 1.7, max-width 480px
6. **Adjustment:** SQ Market Regular, 9–10px, uppercase, `#F59E0B` (Agni) with lightning icon prefix
7. **Up Next Card:** `#131820` (Dusk) background, eyebrow label "UP NEXT · RIGHT SIDE", pose name SQ Market Regular, 16px

### Pranayama — Breath Guide

Vertical stack, centered:
1. **Sanskrit Name:** Cormorant Garamond Italic, 14–16px, `#43B1E8`
2. **Phase Label:** SQ Market Bold, 28–32px, `#F8F9FA` (e.g., "Inhale", "Exhale", "Hold")
3. **Breath Circle:** Animated circle, `#43B1E8` stroke, expands/contracts with breath phase
4. **Count Label:** SQ Market Regular, 9–10px, uppercase, `#7999C1` (e.g., "4 counts · Breath 3 of 10")
5. **Guidance Text:** Cormorant Garamond Italic, 14px, `#7999C1`

---

## Spacing & Layout — Krama

_Krama — the systematic, step-by-step progression that leads to mastery._

### Base Unit

4px. All spacing uses multiples: 4, 8, 12, 16, 24, 32, 48, 64, 96.

### Live Teach

Single column. Max content width 480px, centered. Nothing competes with the pose name. Generous vertical rhythm — at least 32px between sections.

### Library / Browse

2-column grid on mobile (card per pose). 3-column on tablet. Cards are square with 1:1 aspect ratio, figure centered in upper 60%.

### Insights / Data

Full-bleed charts with generous padding. Data labels float; grid lines are near-invisible. Information density is low.

### Negative Space

Considered sacred. If a layout feels crowded, remove something. Silence (space) is where awareness lives.

### Safe Zones

16px from screen edges on mobile. 24px on tablet. Never crowd the nav or the breath circle.

---

## Motion & Animation — Spanda

_Spanda — the divine vibration underlying all movement in the universe._

| Property | Rule |
|----------|------|
| **Easing** | `ease-in-out` for all transitions. Default: `cubic-bezier(0.4, 0, 0.2, 1)`. The breath does not start or stop abruptly. |
| **Duration** | UI micro: 150–200ms. Page transitions: 350ms. Breath animations: 4–6s loops. Never faster than a breath. |
| **Entrance** | Elements fade up gently — `opacity 0→1 + translateY(8px)→0`. Stagger children by 60ms. Never slide in from the side. |
| **Timer Arc** | SVG circle stroke-dashoffset animates linearly — the only linear easing permitted. It represents unwavering time. |
| **Hover States** | Subtle brightening of border opacity. No scale transforms on functional elements. Cards may lift with a faint box-shadow glow. |
| **During Practice** | **Zero non-essential animation.** In live teach mode, the UI is still. Only the timer moves. Respect the state of concentration (dharana). |
| **Hand-Drawn Feel** | Use SVG path animations for decorative elements — thin strokes that draw themselves in on load. The mark of the hand is sacred. |

---

## Build Guide

**Stack:** React Native + Expo SDK 54 (managed workflow), TypeScript, Expo Router v6

**Build Order (MVP Phase 0):**
1. **Home** — Entry point (index). Establishes surface cards, navigation framework, and nocturnal design language.
2. **Live Teach** — Core product experience. Nail the typography scale, karaoke dimming effect, thin glowing progress ring, centered layout, and ambient blurred nocturnal gradients.
3. **Library** — Select a sequence to teach or edit.
4. **Sequence Builder** — Create and modify templates.
5. **Sequence Detail** — Connects Library to Live Teach, builds the timeline component.
6. **Post-Class Wrap** — Finalizes the user loop.

---

## Notes

_Add design decisions, feedback, and iteration notes here._
