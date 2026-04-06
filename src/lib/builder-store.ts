import { Pose } from "../types";

export interface Section {
  id: string;
  name: string;
  poses: Pose[];
}

let nextId = 1;
export function makeId() {
  return `section-${nextId++}`;
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
      s.id === sectionId ? { ...s, poses: [...s.poses, pose] } : s
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

  addCustomPose: (name: string, sanskritName?: string): Pose => {
    const pose: Pose = {
      id: `custom-${Date.now()}`,
      kind: "pose",
      englishName: name,
      sanskritName: sanskritName || undefined,
    } as Pose;
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
