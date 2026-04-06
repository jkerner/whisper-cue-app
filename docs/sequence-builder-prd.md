# WhisperQ Sequence Builder PRD

## Document Info

- Product: WhisperQ
- Feature: Sequence Builder, Sections, and Pose Authoring
- Status: Draft
- Intended implementation area: sequence creation, editing, validation, and sequence-backed Live Teach preparation

## Overview

WhisperQ allows teachers to create and edit class sequences that they can later use in Live Teach mode. In sequence creation, users define a sequence title, manage sections, add or create poses within sections, and edit all pose content. The builder should be flexible while also enforcing a minimum level of structure so teachers can create complete, usable flows.

## Goal

Enable teachers to create a usable, editable sequence with clear validation rules, editable sections, and editable pose content that can power Live Teach mode.

## User Problem

Teachers need a fast but structured way to build sequences. They want to create a sequence from scratch, customize the structure of that sequence, add pre-programmed poses or create their own, edit any pose content, and get clear feedback when required information is missing.

Without validation and clear editing rules, users may create incomplete sequences or poses that are not usable in Live Teach mode.

## Primary User Story

As a yoga teacher, I want to build and edit a sequence with sections and poses so I can prepare a class flow and use it later while teaching.

## Secondary User Stories

- As a yoga teacher, I want to add and remove sections so my sequence matches how I teach.
- As a yoga teacher, I want to reorder sections so I can structure the flow in my preferred order.
- As a yoga teacher, I want to relabel sections so the sequence feels personal and adaptable.
- As a yoga teacher, I want to add pre-programmed poses to a section and still edit them for my own teaching style.
- As a yoga teacher, I want to create my own custom pose if the existing library does not fit my needs.
- As a yoga teacher, I want validation and error messaging so I know exactly what is missing before saving.

## Scope

This PRD covers:

- sequence creation
- sequence editing
- section management
- pose selection within sections
- custom pose creation
- pose editing
- validation and error messaging

This PRD does not cover:

- AI-generated sequence creation
- sharing sequences
- template duplication
- Live Teach playback behavior beyond the pose card fields referenced here

## Functional Requirements

### 1. Create Sequence

The user can start a new sequence.

A sequence must include:

- a title
- at least one valid section with at least one pose in that section

The user cannot save the sequence unless validation requirements are met.

Required fields for saving a sequence:

- Sequence title is required.
- Each existing section must contain at least one pose.
- If a section is empty, the user must either add a pose or remove the section before saving.

Validation behavior:

- If the sequence title is missing, show an inline or top-level error message: `Sequence title is required.`
- If one or more sections are empty, show an error message: `Each section must include at least one pose, or be removed before saving.`
- If both issues exist, show both messages.

### 2. View and Edit Sequence Structure

The user can view all sections in the sequence.

For each section, the user can:

- see the section name
- see the poses currently assigned to that section
- add a pose
- remove a pose
- edit a pose
- rename the section
- delete the section
- reorder the section by dragging it above or below another section

All section labels must be editable.

Default sections may be pre-populated, but they should not be locked. The user should be able to:

- keep them
- rename them
- delete them
- reorder them
- add new ones

### 3. Add Pose to Section

When the user clicks into a section, such as Integration, they can add a pose.

The user can:

- select from pre-programmed poses
- create a new custom pose

When a pre-programmed pose is added to a section, it remains editable within the sequence context.

The user should not be forced to use the default pose text as-is.

### 4. Edit Pose Content

Any pose added to a section must be editable.

Editable content should include any content shown on the pose card in Live Teach mode.

At minimum, this includes:

- Title (required)
- Sanskrit name (auto-generated based on Title)
- Description (required)
  - Help text: `What you will say while you're teaching.`
- Deepening information (optional)
- Any other pose-card fields used in Live Teach mode

All text fields should be editable after a pose is added, whether the pose came from the pre-programmed library or was created by the user.

### 5. Create Custom Pose

The user can create a custom pose from within a section flow.

A custom pose should support the same editable fields that appear on the Live Teach mode card.

At minimum, the user can add:

- Title (required)
- Sanskrit name (auto-generated based on Title)
- Description (required)
  - Help text: `What you will say while you're teaching.`
- Deepening information (optional)
- Any other Live Teach card content fields as applicable

Required fields for saving a custom pose:

- Title
- Description

Validation behavior:

- If the user tries to save a custom pose without a Title or Description, show: `You must add a title and description in order to save.`

### 6. Sequence Save Behavior

The user can save a sequence only if:

- the sequence has a title
- all remaining sections contain at least one pose
- all custom poses added have passed their own validation rules

If the sequence is invalid, save should be blocked and the user should see clear error messaging.

Error messages should be shown close to the relevant field when possible, and also surfaced in a persistent or summary state if needed.

## Validation Summary

Sequence-level validation:

- Title is required.
- No empty sections allowed at save time.

Section-level validation:

- A section must contain at least one pose to remain in the sequence.
- An empty section must be completed or removed.

Custom pose validation:

- Custom pose must include a Title.
- Custom pose must include a Description.

## Error Messages

Use plain, direct language.

Sequence title missing:

`Sequence title is required.`

Empty section exists:

`Each section must include at least one pose, or be removed before saving.`

Custom pose invalid:

`You must add a title and description in order to save.`

Optional more specific inline variants:

- `Add a title.`
- `Add a description.`
- `This section is empty. Add a pose or remove the section.`

## UX Requirements

### Sequence Builder Screen

Should show:

- sequence title field
- section list
- visible poses within each section
- controls to add section
- controls to edit section name
- controls to reorder sections
- controls to delete section
- controls to add a pose inside each section
- save action

### Section Interaction

Clicking a section should let the user:

- browse or search pre-programmed poses
- add a custom pose
- view current poses in the section

### Pose Editing

Once a pose is added to a section, the user can open the pose card or edit view and change all text-based content.

A pre-programmed pose should not be treated as locked reference content in this flow. It should behave like editable sequence content.

### States

Empty state for new sequence:

Prompt the user to enter a title and begin adding or editing sections.

Empty section state:

Show clear CTA such as `Add pose` and supporting text like `This section needs at least one pose before you can save.`

Error state:

Show validation messaging when the user attempts to save invalid content or leaves required fields blank.

## Acceptance Criteria

### Sequence Creation

- A user can create a new sequence.
- A user cannot save without a sequence title.
- A user cannot save if any section is empty.
- A user sees error messaging when save is blocked.

### Section Management

- A user can add a section.
- A user can rename a section.
- A user can remove a section.
- A user can reorder sections via drag and drop.
- A user can see which poses are in each section.

### Pose Management

- A user can add a pre-programmed pose to a section.
- A user can edit a pre-programmed pose after adding it to a section.
- A user can create a custom pose from within a section.
- A user can edit custom pose content after creation.
- A user can remove a pose from a section.

### Custom Pose Validation

- A user cannot save a custom pose without a Title.
- A user cannot save a custom pose without a Description.
- A user sees the error message: `You must add a title and description in order to save.`

## Open Questions

1. Should editing a pre-programmed pose edit only the pose instance inside that sequence, or update the original pose template?
Recommended answer: edit only the sequence instance, not the master library pose.

2. Which additional fields beyond Title, Sanskrit name, Description, and Deepening information should appear on the pose card in Live Teach mode?
Recommended answer: define this based on the final Live Teach card design, then make all displayed fields editable in sequence builder.

3. Should default sections always be added at sequence creation or should the user start from a blank canvas?
Recommended answer: start with sensible defaults, but keep all sections fully editable and removable.

## Recommended Data Model Notes

### Sequence

- id
- title
- description optional
- sections[]

### Section

- id
- title
- orderIndex
- poses[]

### SequencePose

- id
- sourcePoseId optional
- title
- sanskrit autoGenerated
- description
- deepening optional
- additionalNotes optional
- orderIndex
- isCustom boolean

## Validation Logic Summary

Sequence save is enabled only when:

- title is not empty
- every section has at least one pose

Custom pose save is enabled only when:

- Title is not empty
- Description is not empty

## Nice-to-Have Later

- Draft autosave
- Unsaved changes warning
- Duplicate section
- Duplicate pose
- Section templates
- Search and filter in pose library
- Inline preview of Live Teach card while editing
