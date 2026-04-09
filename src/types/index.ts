/** The kind of entry in the pose library */
export type PoseKind = "pose" | "flow" | "practice";

/** A single pose/flow/practice from the library */
export interface Pose {
  id: string;
  kind: PoseKind;
  englishName: string;
  sanskritName: string | null;
}

/** A pose instance within a sequence section (editable copy, not the library original) */
export interface SequencePose {
  id: string;
  sourcePoseId?: string;
  title: string;
  sanskrit?: string;
  description: string;
  deepening?: string;
  additionalNotes?: string;
  orderIndex: number;
  isCustom: boolean;
}

/** A step within a sequence (a pose + cues for that context) */
export interface SequenceStep {
  poseId: string;
  orderIndex: number;
  section: string;
  cues: string[];
  adjustment?: string;
  breaths?: number;
}

/** A teaching sequence made up of ordered poses */
export interface Sequence {
  id: string;
  name: string;
  steps: SequenceStep[];
}
