import createContext from 'zustand/context';
import { subscribeWithSelector } from 'zustand/middleware';
import create from 'zustand';
import { FixedSubscription, FrameloopOverload, RenderSubscription, UpdateSelector, UpdateState } from './types';

export const { Provider, useStore, useStoreApi } = createContext<UpdateState>();
export const createStore = (fixedStep: number, maxSubsteps: number, frameloop?: FrameloopOverload) => () =>
  create(
    subscribeWithSelector<UpdateState>((set) => ({
      // Fixed update state
      fixed: {
        fixedStep: fixedStep,
        maxSubsteps: maxSubsteps,
        factor: 0,
        remainder: 0,
        subscribers: [] as FixedSubscription[],
        subscribe: (ref: FixedSubscription) => {
          set(({ fixed }) => ({
            fixed: { ...fixed, subscribers: [...fixed.subscribers, ref] },
          }));
          return () => {
            set(({ fixed }) => ({
              fixed: {
                ...fixed,
                subscribers: fixed.subscribers.filter((s) => s !== ref),
              },
            }));
          };
        },

        setFixedStep: (v: number) => set(({ fixed }) => ({ fixed: { ...fixed, fixedStep: v } })),
        setMaxSubsteps: (v: number) => set(({ fixed }) => ({ fixed: { ...fixed, maxSubsteps: v } })),
      },
      // Render update state
      render: {
        frameloop: frameloop,
        setFrameloop: (v?: FrameloopOverload) => set(({ render }) => ({ render: { ...render, frameloop: v } })),
        subscribers: [] as RenderSubscription[],
        subscribe: (ref: RenderSubscription) => {
          set(({ render }) => ({
            render: {
              ...render,
              subscribers: [...render.subscribers, ref],
            },
          }));
          return () => {
            set(({ render }) => ({
              render: {
                ...render,
                subscribers: render.subscribers.filter((s) => s !== ref),
              },
            }));
          };
        },
      },
    })),
  );

export const useUpdateApi = (selector: UpdateSelector) => useStore(selector);
