import createContext from 'zustand/context';
import { subscribeWithSelector } from 'zustand/middleware';
import create, { GetState, Mutate, SetState, StateSelector, StoreApi } from 'zustand';
import { RootState } from '@react-three/fiber';
import { MutableRefObject } from 'react';

export interface FixedCallback {
  (state: RootState, stepSize: number, fixedState: FixedUpdateState): void;
}

export type Subscription = MutableRefObject<FixedCallback>;

export type FixedUpdateState = {
  stepSize: number;
  maxSubsteps: number;
  factor: number;
  remainder: number;
  subscribers: Subscription[];
  subscribe: (ref: Subscription) => () => void;
  setStepSize: (v: number) => void;
  setMaxSubsteps: (v: number) => void;
};

type FixedUpdateSelector = StateSelector<FixedUpdateState, Partial<FixedUpdateState>>;

export const { Provider, useStore, useStoreApi } = createContext<FixedUpdateState>();
export const createStore = (stepSize: number, maxSubsteps: number) => () =>
  create<
    FixedUpdateState,
    SetState<FixedUpdateState>,
    GetState<FixedUpdateState>,
    Mutate<StoreApi<FixedUpdateState>, [['zustand/subscribeWithSelector', never]]>
  >(
    subscribeWithSelector((set) => ({
      stepSize: stepSize,
      maxSubsteps: maxSubsteps,
      factor: 0,
      remainder: 0,
      subscribers: [],
      subscribe: (ref: Subscription) => {
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
      setStepSize: (v: number) => set({ stepSize: v }),
      setMaxSubsteps: (v: number) => set({ maxSubsteps: v }),
    })),
  );

export const useFixedUpdateApi = (selector: FixedUpdateSelector) => useStore(selector);
