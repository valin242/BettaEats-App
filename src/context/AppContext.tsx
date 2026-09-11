import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

import type { AppAction, AppState, Meal } from '@/types';

const KEYS = {
  onboarded: '@bettaeats/hasOnboarded',
  meals: '@bettaeats/meals',
  streak: '@bettaeats/streak',
  lastLogDate: '@bettaeats/lastLogDate',
} as const;

const initialState: AppState = {
  hasOnboarded: false,
  hydrated: false,
  meals: [],
  streak: 0,
  lastLogDate: null,
};

function computeStreak(lastLogDate: string | null, currentStreak: number): number {
  if (!lastLogDate) return 0;
  const last = new Date(lastLogDate);
  const today = new Date();
  const diffMs = today.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1; // streak broken; today counts as day 1
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true };
    case 'SET_ONBOARDED':
      return { ...state, hasOnboarded: true };
    case 'ADD_MEAL': {
      const today = new Date().toISOString().split('T')[0];
      const newStreak = computeStreak(state.lastLogDate, state.streak);
      return {
        ...state,
        meals: [action.payload, ...state.meals],
        streak: newStreak,
        lastLogDate: today,
      };
    }
    default:
      return state;
  }
}

interface ContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  setOnboarded: () => void;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const results = await AsyncStorage.multiGet([
          KEYS.onboarded,
          KEYS.meals,
          KEYS.streak,
          KEYS.lastLogDate,
        ]);
        const map = Object.fromEntries(results);
        dispatch({
          type: 'HYDRATE',
          payload: {
            hasOnboarded: map[KEYS.onboarded] === 'true',
            meals: map[KEYS.meals] ? JSON.parse(map[KEYS.meals]!) : [],
            streak: map[KEYS.streak] ? parseInt(map[KEYS.streak]!, 10) : 0,
            lastLogDate: map[KEYS.lastLogDate] ?? null,
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
      [KEYS.meals, JSON.stringify(state.meals)],
      [KEYS.streak, String(state.streak)],
      [KEYS.lastLogDate, state.lastLogDate ?? ''],
    ]).catch(() => {});
  }, [state.hasOnboarded, state.meals, state.streak, state.lastLogDate, state.hydrated]);

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    dispatch({ type: 'ADD_MEAL', payload: { ...meal, id: Date.now() } });
  };

  const setOnboarded = () => dispatch({ type: 'SET_ONBOARDED' });

  return (
    <AppContext.Provider value={{ state, dispatch, addMeal, setOnboarded }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
