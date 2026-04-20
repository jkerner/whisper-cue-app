# WhisperCue — Feature Briefs
*Captures product feedback and feature ideas for prioritization*

---

## 1. Sequence Persistence + Editing
**Status: Partially live**
**Priority: P1 — complete now**

Teachers can already edit pose cues in the builder. The question is whether edits save back to their profile.

**Current behavior:** Edits in the builder exist in memory during the session. Tapping Save writes the full sequence (with all edited cues) to Supabase under the teacher's account. Saved sequences appear on the home screen and can be reopened in the builder.

**Still needed:**
- When reopening a saved sequence from home, edits should update the existing record (not create a duplicate). The builder currently only does `insert` — needs an `upsert` or `update` when `sequenceId` is present.
- Confirmation that the teacher is editing vs. creating a new sequence.

---

## 2. Audio Cues + Wearable Integration
**Status: Not started**
**Priority: P2**

Teachers spend class looking at their students, not their phone. The core hypothesis: cues should come *to* the teacher, not require them to look down.

**Three delivery modes to explore:**

### 2a. Audio (text-to-speech)
- Cues read aloud through AirPods/headset as the class progresses
- Teacher advances through poses manually (Apple Watch tap) or on a timer
- Voice should feel like a whisper — low, calm, not distracting
- Use iOS `AVSpeechSynthesizer` or a higher-quality TTS API (ElevenLabs, etc.)

### 2b. Apple Watch
- Glanceable cue cards on the wrist — next pose name + 1-line cue
- Haptic pulse as a signal to transition (light = suggest, strong = move)
- Digital Crown or side button to advance
- Requires a WatchKit extension target in the Xcode project

### 2c. Haptic-only
- Lightest lift: iPhone in pocket, gentle vibration patterns = timing signals
- Pattern library: 1 tap = breathe, 2 taps = transition, long = hold

**Open question:** Does audio feel helpful or disorienting mid-class? Could be a toggle the teacher sets per sequence (audio on/off, watch on/off).

---

## 3. Share a Sequence
**Status: Not started**
**Priority: P2 — growth lever**

**The insight:** When a teacher wants feedback on their sequence, they bring people into the ecosystem. Same dynamic as Figma share links or Notion pages.

**How it works:**
- Teacher taps "Share" on any saved sequence
- Generates a public link: `whispercue.app/s/[short-id]`
- Recipient can view the full sequence (read-only) without an account
- CTA: "Build your own sequence" → signs them up
- Optional: recipient can "save a copy" to their own library (requires account)

**Teacher training use case:** Trainers share template sequences with students. Students save to their library, customize, teach.

**Viral loop:** Teacher → shares with colleague → colleague joins → colleague shares with their students → repeat.

---

## 4. Sequence Tags + Class Marketplace
**Status: Not started**
**Priority: P3 — longer term**

**Tags** let teachers organize their library and eventually discover others' work.

**Tag categories to start:**
- Style: `power-flow`, `yin`, `restorative`, `beginner`, `prenatal`, `meditation`
- Duration: `30-min`, `45-min`, `60-min`, `75-min`, `90-min`
- Level: `all-levels`, `beginner`, `intermediate`, `advanced`
- Focus: `backbends`, `hip-openers`, `inversions`, `core`, `balance`

**Marketplace vision:**
- Teachers can publish tagged sequences publicly
- Other teachers browse/search by tag
- "Inspired by" attribution when someone saves a copy
- Could become a revenue layer (premium sequences, teacher training packs)

**Starting point:** Add tag field to sequence builder and profile. Tags live in Supabase. Marketplace is a future screen.

---

## 5. Post-Class Rating + AI Improvement Loop
**Status: Not started**
**Priority: P2 — retention + product intelligence**

**The flow:**
1. Class ends → "Practice Complete" screen prompts: *How did this one feel?* (1–5)
2. Optional follow-up: *What could have been better?* (free text or multi-select: pacing, transitions, peak pose, closing)
3. Ratings + notes saved to Supabase against the sequence

**AI improvement suggestions:**
- After 3+ ratings, surface patterns: *"Your students tend to feel rushed in the peak section"*
- Offer specific suggestions: *"Try adding a preparatory pose before Half Moon"* or *"Your wind-down is shorter than average for a 60-min class"*
- Claude API call with sequence structure + ratings as context → returns 2-3 specific suggestions
- Teacher can apply suggestions directly (modifies sequence in builder)

**Data this unlocks:**
- Which templates perform best
- Which pose transitions feel rough
- Aggregate insights across all teachers (anonymized) to improve templates

---

## Summary Table

| Feature | Priority | Effort | Impact |
|---|---|---|---|
| Save edits back to profile (upsert) | P1 | Small | High |
| Audio cues via headset | P2 | Medium | High |
| Apple Watch integration | P2 | Large | High |
| Share a sequence | P2 | Medium | Very High (growth) |
| Post-class rating | P2 | Small | High (retention) |
| AI improvement suggestions | P2 | Medium | High |
| Sequence tags | P3 | Small | Medium |
| Class marketplace | P3 | Large | Very High (long-term) |
