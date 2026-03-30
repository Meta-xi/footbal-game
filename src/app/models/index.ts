// Re-export all models
export * from './user.model';
export * from './game.model';
export * from './transaction.model';
export * from './player.model';

import { UserProfile, UserStats } from './user.model';
import { Boost, ActiveBoost, TapConfig, GameState } from './game.model';
import { Transaction, DepositMethod, CryptoAddress } from './transaction.model';
import { Player, PlayersData } from './player.model';

export interface LocalApiData {
  profile: UserProfile;
  stats: UserStats;
  // energy ahora viene del UserStatusService (API) - no se persiste
  boosts: Boost[];
  activeBoosts: ActiveBoost[];
  tapConfig: TapConfig;
  transactions: Transaction[];

  gameState: GameState;
  players: PlayersData;
}
