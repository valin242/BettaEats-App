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

/** Kinds of record a reader can bookmark. Compounds and indications join these
 *  once the phase-1 schema lands. */
export type SavedKind = 'food' | 'organ';

export interface SavedItem {
  kind: SavedKind;
  id: string;
  savedAt: string;
}

export interface AppState {
  hasOnboarded: boolean;
  hydrated: boolean;
  saved: SavedItem[];
}

export type AppAction =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'SET_ONBOARDED' }
  | { type: 'TOGGLE_SAVED'; payload: { kind: SavedKind; id: string } };
