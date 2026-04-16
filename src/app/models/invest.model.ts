/**
 * API response from GET /Invest/getPlayers (isBuyed=false)
 */
export interface InvestApiPlayer {
  id: number;
  name: string;
  isVIP: boolean;
  isBuyed?: boolean;
  price: number;
  days: number;
  interest: number;
  age: number;
  lesions: number;
  goals: number;
  /** Populated from separate image endpoint */
  imagen?: string;
}

/**
 * Purchase Info - returned when isBuyed=true
 */
export interface InvestPurchaseInfo {
  id: number;
  userId: number;
  articleId: number;
  created: string;
}

/**
 * API response from GET /Invest/getPlayers?isBuyed=true
 */
export interface InvestBoughtPlayerResponse {
  pi: InvestPurchaseInfo;
  p: Omit<InvestApiPlayer, 'imagen'>;
}

/**
 * Enriched player with purchase info (for bought players)
 */
export interface InvestBoughtPlayer extends InvestApiPlayer {
  purchaseDate: string;
  purchaseId: number;
}
