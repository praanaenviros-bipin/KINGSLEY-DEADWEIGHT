export interface CalculationResult {
  id: string;
  timestamp: number;
  pressure: number;
  diameter: number;
  gravity: number;
  weight: number;
  effectiveArea: number;
  pascalsEquivalent: number;
}

export type View = 'estimator' | 'history' | 'settings';
