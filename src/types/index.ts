export interface Food {
  id: string;
  group: string;
  emoji: string;
  items: string;
  hb: string;   // head background tint
  bd: string;   // border color
  ac: string;   // accent color
  compounds: string[];
  benefits: string[];
  prep: string;
  evidence: string;
  tags: string[];
}

export interface OrganCardData {
  title: string;
  body: string;
  foods: string;
}

export interface Organ {
  id: string;
  name: string;
  emoji: string;
  hb: string;
  bd: string;
  ac: string;
  topFoods: string[];
  cards: OrganCardData[];
}

export interface Meal {
  id: number;
  em: string;
  h: string;
  s: string;
  time: string;
}

export interface ProtectionRingData {
  id: string;
  em: string;
  nm: string;
  hb: string;
  ac: string;
  pct: number;
  lbl: string;
}

export interface DiversityData {
  count: number;
  goal: number;
  newThisWeek: string[];
}

export interface TipData {
  badge: string;
  text: string;
}

export interface TodayData {
  pct: number;
  streak: number;
  diversity: DiversityData;
  tip: TipData;
  rings: ProtectionRingData[];
  meals: Meal[];
}

export interface WeekDay {
  d: string;
  groups: number;
  today?: boolean;
}

export interface CoverageData {
  nm: string;
  pct: number;
}

export interface InsightsData {
  week: WeekDay[];
  maxGroups: number;
  coverage: CoverageData[];
  topCompounds: string[];
  gap: { nm: string; why: string; em: string };
}

export interface AppState {
  hasOnboarded: boolean;
  hydrated: boolean;
  meals: Meal[];
  streak: number;
  lastLogDate: string | null;
}

export type AppAction =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'SET_ONBOARDED' }
  | { type: 'ADD_MEAL'; payload: Meal };
