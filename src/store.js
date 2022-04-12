import { subscribeWithSelector } from 'zustand/middleware';
import create from 'zustand';
import { useContext, createContext } from 'react';

export const context = createContext();

export function useStore() {
  const store = useContext(context);
  if (!store) throw `react-three-update hooks can only be used within the Update component!`;
  return store;
}

export const createStore = (stepSize, maxSubsteps) =>
  create(
    subscribeWithSelector((set) => ({
      set,
      stepSize: stepSize,
      maxSubsteps: maxSubsteps,
      factor: 0,
      remainder: 0,
      subscribers: [],
      subscribe: (ref) => {
        set((state) => ({
          ...state,
          subscribers: [...state.subscribers, ref],
        }));
        return () => {
          set((state) => ({
            ...state,
            subscribers: state.subscribers.filter((s) => s !== ref),
          }));
        };
      },
      setStepSize: (v) => set({ stepSize: v }),
      setMaxSubsteps: (v) => set({ maxSubsteps: v }),
    })),
  );
