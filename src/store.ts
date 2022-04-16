import createContext from 'zustand/context';
import { subscribeWithSelector } from 'zustand/middleware';
import create, { GetState, Mutate, SetState, StateSelector, StoreApi } from 'zustand';
import { RootState } from '@react-three/fiber';
import { MutableRefObject } from 'react';

export interface FixedCallback {
  (state: RootState, fixedStep: number, fixedState: FixedUpdateState): void;
}

export type Subscription = MutableRefObject<FixedCallback>;

export type FixedUpdateState = {
  fixedStep: number;
  maxSubsteps: number;
  factor: number;
  remainder: number;
  subscribers: Subscription[];
  subscribe: (ref: Subscription) => () => void;
  setfixedStep: (v: number) => void;
  setMaxSubsteps: (v: number) => void;
};

type FixedUpdateSelector = StateSelector<FixedUpdateState, Partial<FixedUpdateState>>;

export const { Provider, useStore, useStoreApi } = createContext<FixedUpdateState>();
export const createStore = (fixedStep: number, maxSubsteps: number) => () =>
  create<
    FixedUpdateState,
    SetState<FixedUpdateState>,
    GetState<FixedUpdateState>,
    Mutate<StoreApi<FixedUpdateState>, [['zustand/subscribeWithSelector', never]]>
  >(
    subscribeWithSelector((set) => ({
      fixedStep: fixedStep,
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
      setfixedStep: (v: number) => set({ fixedStep: v }),
      setMaxSubsteps: (v: number) => set({ maxSubsteps: v }),
    })),
  );

export const useFixedUpdateApi = (selector: FixedUpdateSelector) => useStore(selector);
