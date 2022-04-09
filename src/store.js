import createContext from "zustand/context";
import { subscribeWithSelector } from "zustand/middleware";
import create from "zustand";

export const { Provider, useStore, useStoreApi } = createContext();
export const createStore = (stepSize, maxSubsteps) => () =>
  create(
    subscribeWithSelector((set) => ({
      stepSize: stepSize,
      maxSubsteps: maxSubsteps,
      factor: 0,
      remainder: 0,
      subscribers: [],
      subscribe: (ref) => {
        set((state) => ({
          ...state,
          subscribers: [...state.subscribers, ref]
        }));
        return () => {
          set((state) => ({
            ...state,
            subscribers: state.subscribers.filter((s) => s !== ref)
          }));
        };
      },
      setStepSize: (v) => set({ stepSize: v }),
      setMaxSteps: (v) => set({ maxSteps: v })
    }))
  );
