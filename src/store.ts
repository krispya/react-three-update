import createContext from 'zustand/context';
import { subscribeWithSelector } from 'zustand/middleware';
import create, { GetState, Mutate, SetState, StateSelector, StoreApi } from 'zustand';
import { RootState } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import * as THREE from 'three';

export interface UpdateCallback {
  (state: RootState, delta: number, fixedState: FixedUpdateState, frame?: THREE.XRFrame): void;
}

export interface FixedCallback {
  (state: RootState, fixedStep: number, fixedState: FixedUpdateState, frame?: THREE.XRFrame): void;
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

export const { Provider, useStore, useStoreApi } = createContext<FixedUpdateState>();
export const createStore = (fixedStep: number, maxSubsteps: number) => () =>
  create(
    subscribeWithSelector<FixedUpdateState>((set) => ({
      fixedStep: fixedStep,
      maxSubsteps: maxSubsteps,
      factor: 0,
      remainder: 0,
      subscribers: [] as Subscription[],
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
  );

export const useFixedUpdateApi = (selector: FixedUpdateSelector) => useStore(selector);
