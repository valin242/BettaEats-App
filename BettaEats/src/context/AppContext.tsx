import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import type { AppAction, AppState, SavedKind } from '@/types';

const KEYS = {
  onboarded: '@bettaeats/hasOnboarded',
  saved: '@bettaeats/saved',
} as const;

const initialState: AppState = {
  hasOnboarded: false,
  hydrated: false,
  saved: [],
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true };
    case 'SET_ONBOARDED':
      return { ...state, hasOnboarded: true };
    case 'TOGGLE_SAVED': {
      const { kind, id } = action.payload;
      const existing = state.saved.find((s) => s.kind === kind && s.id === id);
      return {
        ...state,
        saved: existing
          ? state.saved.filter((s) => !(s.kind === kind && s.id === id))
          : [{ kind, id, savedAt: new Date().toISOString() }, ...state.saved],
      };
    }
    default:
      return state;
  }
}

interface ContextValue {
  state: AppState;
  toggleSaved: (kind: SavedKind, id: string) => void;
  isSaved: (kind: SavedKind, id: string) => boolean;
  setOnboarded: () => void;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const results = await AsyncStorage.multiGet([KEYS.onboarded, KEYS.saved]);
        const map = Object.fromEntries(results);
        dispatch({
          type: 'HYDRATE',
          payload: {
            hasOnboarded: map[KEYS.onboarded] === 'true',
            saved: map[KEYS.saved] ? JSON.parse(map[KEYS.saved]!) : [],
          },
        });
      } catch {
        dispatch({ type: 'HYDRATE', payload: {} });
      }
    })();
  }, []);

  // Persist on relevant state changes (after hydration)
  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.multiSet([
      [KEYS.onboarded, String(state.hasOnboarded)],
      [KEYS.saved, JSON.stringify(state.saved)],
    ]).catch(() => {});
  }, [state.hasOnboarded, state.saved, state.hydrated]);

  const toggleSaved = useCallback(
    (kind: SavedKind, id: string) => dispatch({ type: 'TOGGLE_SAVED', payload: { kind, id } }),
    []
  );

  const isSaved = useCallback(
    (kind: SavedKind, id: string) => state.saved.some((s) => s.kind === kind && s.id === id),
    [state.saved]
  );

  const setOnboarded = useCallback(() => dispatch({ type: 'SET_ONBOARDED' }), []);

  const value = useMemo(
    () => ({ state, toggleSaved, isSaved, setOnboarded }),
    [state, toggleSaved, isSaved, setOnboarded]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
