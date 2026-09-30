/** Kinds of record a reader can bookmark. Compounds and indications join these with their phase-3 pages. */
export type SavedKind = 'group' | 'system';

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
