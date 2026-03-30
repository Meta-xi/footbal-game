export interface BackendMission {
  id: number;
  category: string | number | null;
  misionInfo: string;
  misionReward: number;
  created: string;
}

export interface CompletedMissionBackend {
  id: number;
  userId: number;
  misionesId: number;
  mision: string;
  created: string;
}

export interface CompletedMission {
  id: string;
  userId: string;
  missionId: string;
  mission: string;
  created: Date;
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