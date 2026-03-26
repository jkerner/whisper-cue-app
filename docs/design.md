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
| **Backgrounds** | Transparent. Icons float on the app's dark surfaces — no card or container background behind the figure. |
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

### Home

**Purpose:** The main landing experience offering quick starts, templates, and inspiration.

**Layout:** Top greeting, followed by horizontally scrolling sections for AI Recommendations and Templates. Strictly dark mode.

**Key Elements:**
- **Greeting Header:** SQ Market Bold, 28px, "Good Evening"
- **AI Recommendations Section:** Section title (SQ Market Regular, 9px, `#7999C1`, uppercase, tracking 0.35em), followed by cards suggesting sequences based on time of day or past habits
- **Templates List:** Pre-built sequence bases (e.g., "Morning Flow", "Deep Rest") paired with custom illustrative yoga figure icons that can be cloned and modified

**Interactions:**
- **Tap Template:** Opens the Sequence Builder with the template pre-loaded
- **Tap AI Recommendation:** Navigates directly to Sequence Detail

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

### Sequence Detail

**Purpose:** Review the class plan before hitting "Begin."

**Layout:** Sticky top header with title and duration. Scrollable timeline of poses in the middle. Sticky bottom CTA. Strictly dark mode.

**Key Elements:**
- **Class Title:** SQ Market Bold, 36px
- **Pose Timeline:** Vertical line (`#7999C1`, 2px wide) on the left. Nodes for each pose (8px dot, `#43B1E8`)
- **Pose Item:** Illustrative icon alongside Name (SQ Market Bold, 24px) with Sanskrit label (Cormorant Garamond Italic, 13px, `#43B1E8`) and Duration (SQ Market Regular, 9px, uppercase, `#7999C1`)
- **Begin CTA:** 100% width button pinned to bottom, `#43B1E8` background, black text, "Begin Class"

**Interactions:**
- **Tap Begin CTA:** Fades instantly to Live Teach screen. Hides status bar.

### Live Teach

**Purpose:** The core teleprompter. Ultra-glanceable cueing.

**Layout:** Edge-to-edge full screen. Strictly dark mode. Central ring is the focal point containing pose info and timer. Cue text below. Transport controls pinned to bottom.

**Top Bar:**
- **Section Label (left):** SQ Market Regular, 14px, `#F8F9FA` for current step, `#7999C1` for total (e.g., "SUN B | 42:15" or "1 of 123")
- **Class Timer (right):** SQ Market Light, 15px, `#7999C1`, tabular nums — overall elapsed time

**Progress Bar:**
- Thin 2px horizontal bar spanning full width below top bar
- Track: `#1a2230`, Fill: `#43B1E8` — represents overall sequence progress

**Central Ring (focal point):**
- Large circle, ~72% of screen width, `#43B1E8` 2.5px stroke
- Dashed inner decorative ring: `#1a2230`, 1px, dash pattern 4/6
- Contents vertically centered inside:
  - **Hold Label:** SQ Market Regular, 10px, `#43B1E8`, uppercase, tracking 0.35em (e.g., "HOLD 5 BREATHS")
  - **Pose Name:** SQ Market Bold, 30px, `#F8F9FA`, centered
  - **Sanskrit Label:** Cormorant Garamond Italic, 15px, `#43B1E8`, centered
  - **Step Timer:** SQ Market Light, 36px, tabular nums, `#43B1E8` for elapsed / `#7999C1` for total (e.g., "0:12 / 0:30")

**Cue Text (below ring):**
- Cormorant Garamond Regular, 20px, `#F8F9FA`, opacity 0.9, centered, leading 1.6, max-width 480px
- Cues joined with " · " separator for glanceability

**Adjustment Callout (optional):**
- Lightning bolt icon (`#F59E0B` Agni) + SQ Market Regular, 9px, `#F59E0B`, uppercase, tracking 0.35em
- Only shown when step has an adjustment cue

**Up Next Card:**
- `#0d1117` (Cave) background, 12px radius, 1px `#1a2230` border
- **Eyebrow:** SQ Market Regular, 9px, `#7999C1`, tracking 3px, "UP NEXT"
- **Pose Name:** SQ Market Bold, 17px, `#F8F9FA`
- **Side Indicator (optional):** Cormorant Garamond Italic, 14px, `#7999C1` (e.g., "Right Side")
- **Arrow:** `#43B1E8`, 16px, right-aligned

**Back Hint (bottom):**
- Subtle "← previous" text link, 12px, `#7999C1`, opacity 0.4
- Unobtrusive — the teacher shouldn't need to go back often

**States:**
- **End of Sequence:** Up Next card reads "PRACTICE COMPLETE" / "Return to stillness". Tapping advances to Post-Class Wrap.

**Interactions:**
- **Tap Up Next card:** Primary navigation — advances to the next pose with fade transition
- **Tap "← previous":** Go back to previous pose
- **Long Press:** Pauses timer, pulses `#43B1E8` ring

### Post-Class Wrap

**Purpose:** Confirmation the class is done, log the actual time taught.

**Layout:** Centered content, highly minimalist. Strictly dark mode.

**Key Elements:**
- **Completion Graphic:** Soft pulsing `#43B1E8` glowing orb in center, with an overlaid illustrative icon representing rest
- **Congrats Text:** Cormorant Garamond Light Italic, 48px, "Practice Complete"
- **Stats:** Actual duration vs Planned duration
- **Done CTA:** Outline button, 1px `#7999C1` border, "Return to Library"

**Interactions:**
- **Tap Done CTA:** Fades to Library.

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
