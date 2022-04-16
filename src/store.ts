import { subscribeWithSelector } from 'zustand/middleware';
import create, { GetState, Mutate, SetState, StateSelector, StoreApi, createStore } from 'zustand';
import { RootState } from '@react-three/fiber';
import { createContext, MutableRefObject, useContext } from 'react';

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
  setFixedStep: (v: number) => void;
  setMaxSubsteps: (v: number) => void;
};

type FixedUpdateSelector = StateSelector<FixedUpdateState, Partial<FixedUpdateState>>;

export const createUpdateStore = createStore(
  (fixedStep: number, maxSubsteps: number) => () =>
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
        setFixedStep: (v: number) => set({ fixedStep: v }),
        setMaxSubsteps: (v: number) => set({ maxSubsteps: v }),
      })),
    ),
);

export const StoreContext = createContext<FixedUpdateState>(null);

export const useUpdateContext = () => {
  const context = useContext(StoreContext);
  if (!context)
    throw new Error(
      'Update context not found. react-three-update and components can only be used within an Update provider',
    );
  return context;
};

// export const useFixedUpdateApi = (selector: FixedUpdateSelector) => useStore(selector);
