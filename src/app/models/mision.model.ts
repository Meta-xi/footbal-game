// Nuevo formato de respuesta del backend
export interface MisionInfoObject {
  id: number;
  category: number;
  misionInfo: string;
  misionReward: number;
  created: string;
}

export interface BackendMission {
  state: MisionState | null;
  misionInfo: MisionInfoObject | string;
  misionReportDetails: unknown | null;
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

export interface ActivateMisionRequest {
  misionId: number | string;
  timestamp: number | string;
}

export interface ActivateMisionResponse {
  // The spec says text/plain for 200 OK. It could be just "OK" or an empty body.
  // We'll assume a successful response means the operation was completed.
  // If the backend returns structured data, this interface will need to be updated.
}

export interface ApiMessageResponse {
  message: string;
}
