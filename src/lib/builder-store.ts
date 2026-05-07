import { Pose, SequencePose } from "../types";
import sequencesData from "../data/sequences.json";
import poseCuesData from "../data/pose-cues.json";

export interface Section {
  id: string;
  name: string;
  poses: SequencePose[];
}

// Build a lookup of poseId → { description, deepening } from all sources
interface PoseContent {
  description: string;
  deepening?: string;
}
const poseContentLookup: Record<string, PoseContent> = {};

// 1. Load from pose-cues.json (standalone cue data)
for (const [poseId, data] of Object.entries(poseCuesData as Record<string, { cues: string[]; adjustment?: string }>)) {
  poseContentLookup[poseId] = {
    description: data.cues.join("\n"),
    deepening: data.adjustment || undefined,
  };
}

// 2. Load from sequences.json (first occurrence wins, overrides pose-cues if present)
for (const seq of sequencesData as any[]) {
  for (const step of seq.steps || []) {
    if (!poseContentLookup[step.poseId] && step.cues?.length) {
      poseContentLookup[step.poseId] = {
        description: step.cues.join("\n"),
        deepening: step.adjustment || undefined,
      };
    }
  }
}

let nextId = 1;
export function makeId() {
  return `section-${nextId++}`;
}

let nextPoseId = 1;
function makePoseId() {
  return `sp-${Date.now()}-${nextPoseId++}`;
}

/** Convert a library Pose into an editable SequencePose */
export function poseToSequencePose(pose: Pose, orderIndex: number): SequencePose {
  const content = poseContentLookup[pose.id];
  return {
    id: makePoseId(),
    sourcePoseId: pose.id,
    title: pose.englishName,
    sanskrit: pose.sanskritName || undefined,
    description: content?.description || "",
    deepening: content?.deepening,
    orderIndex,
    isCustom: false,
  };
}

// Simple module-level store shared between builder and section-editor
let sections: Section[] = [
  { id: makeId(), name: "Integration", poses: [] },
  { id: makeId(), name: "Warm-Up", poses: [] },
  { id: makeId(), name: "Sun Salutations", poses: [] },
  { id: makeId(), name: "Standing Series", poses: [] },
  { id: makeId(), name: "Peak Poses", poses: [] },
  { id: makeId(), name: "Cool Down", poses: [] },
  { id: makeId(), name: "Savasana + Close", poses: [] },
];

let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export const builderStore = {
  getSections: () => sections,

  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },

  setSections: (newSections: Section[]) => {
    sections = newSections;
    notify();
  },

  addSection: (name: string = "") => {
    sections = [...sections, { id: makeId(), name, poses: [] }];
    notify();
    return sections[sections.length - 1].id;
  },

  removeSection: (id: string) => {
    sections = sections.filter((s) => s.id !== id);
    notify();
  },

  updateSectionName: (id: string, name: string) => {
    sections = sections.map((s) => (s.id === id ? { ...s, name } : s));
    notify();
  },

  moveSection: (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const arr = [...sections];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    sections = arr;
    notify();
  },

  // Pose management within a section
  getSection: (id: string) => sections.find((s) => s.id === id),

  addPose: (sectionId: string, pose: Pose) => {
    sections = sections.map((s) =>
      s.id === sectionId
        ? { ...s, poses: [...s.poses, poseToSequencePose(pose, s.poses.length)] }
        : s
    );
    notify();
  },

  removePose: (sectionId: string, index: number) => {
    sections = sections.map((s) =>
      s.id === sectionId
        ? { ...s, poses: s.poses.filter((_, i) => i !== index) }
        : s
    );
    notify();
  },

  reorderPoses: (sectionId: string, from: number, to: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const arr = [...section.poses];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    sections = sections.map((s) =>
      s.id === sectionId ? { ...s, poses: arr } : s
    );
    notify();
  },

  movePose: (sectionId: string, index: number, direction: "up" | "down") => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= section.poses.length) return;
    const arr = [...section.poses];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    sections = sections.map((s) =>
      s.id === sectionId ? { ...s, poses: arr } : s
    );
    notify();
  },

  updatePose: (sectionId: string, poseId: string, updates: Partial<SequencePose>) => {
    sections = sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            poses: s.poses.map((p) =>
              p.id === poseId ? { ...p, ...updates } : p
            ),
          }
        : s
    );
    notify();
  },

  getPose: (sectionId: string, poseId: string): SequencePose | undefined => {
    const section = sections.find((s) => s.id === sectionId);
    return section?.poses.find((p) => p.id === poseId);
  },

  addCustomPoseToSection: (sectionId: string, pose: SequencePose) => {
    sections = sections.map((s) =>
      s.id === sectionId ? { ...s, poses: [...s.poses, pose] } : s
    );
    notify();
  },

  addCustomPose: (sectionId: string, name: string, sanskritName?: string): SequencePose => {
    const section = sections.find((s) => s.id === sectionId);
    const pose: SequencePose = {
      id: makePoseId(),
      title: name,
      sanskrit: sanskritName || undefined,
      description: "",
      orderIndex: section ? section.poses.length : 0,
      isCustom: true,
    };
    return pose;
  },

  reset: () => {
    nextId = 1;
    sections = [
      { id: makeId(), name: "Integration", poses: [] },
      { id: makeId(), name: "Warm-Up", poses: [] },
      { id: makeId(), name: "Sun Salutations", poses: [] },
      { id: makeId(), name: "Standing Series", poses: [] },
      { id: makeId(), name: "Peak Poses", poses: [] },
      { id: makeId(), name: "Cool Down", poses: [] },
      { id: makeId(), name: "Savasana + Close", poses: [] },
    ];
    notify();
  },
};
