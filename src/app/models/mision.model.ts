export interface BackendMission {
  id: number;
  category: string | number | null;
  misionInfo: string;
  misionReward: number;
  created: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  currency: string;
  icon: string;
  completed: boolean;
  category?: string | null;
}

// MisionState enum from backend (integer)
export enum MisionState {
  Pending = 0,
  Completed = 1,
  Failed = 2,
}

// Known properties of the Misions object returned by the backend.
// Avoid [key: string]: unknown to maintain type safety — extend explicitly if new fields appear.
export interface MisionsInfo {
  id?: number;
  name?: string | null;
  description?: string | null;
  reward?: number;
  icon?: string | null;
  category?: string | number | null;
}

// MisionReport — response from GET /Misions/GetCompletedMisions
export interface MisionReport {
  id: number;
  userId: number;
  misionsId: number;
  state: MisionState | null;
  mision: MisionsInfo | null;
  created: string;
}

// MissionState values that qualify as "visible" in the history UI
export const VISIBLE_MISSION_STATES: MisionState[] = [
  MisionState.Completed,
  MisionState.Failed,
];