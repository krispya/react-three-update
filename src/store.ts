import createContext from 'zustand/context';
import { subscribeWithSelector } from 'zustand/middleware';
import create from 'zustand';
import { FixedSubscription, RenderCallbackRef, RenderOptions, UpdateSelector, UpdateState } from './types';

export const { Provider, useStore, useStoreApi } = createContext<UpdateState>();
export const createStore = (fixedStep: number, maxSubsteps: number, render?: RenderOptions) => () =>
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
        render: render,
        setRender: (v?: RenderOptions) => set(({ render }) => ({ render: { ...render, render: v } })),
        subscribers: [],
        subscribe: (ref: RenderCallbackRef, priority: number) => {
          set(({ render }) => ({
            render: {
              ...render,
              subscribers: [...render.subscribers, { ref, priority }].sort((a, b) => a.priority - b.priority),
            },
          }));
          return () => {
            set(({ render }) => ({
              render: {
                ...render,
                subscribers: render.subscribers.filter((s) => s.ref !== ref),
              },
            }));
          };
        },
      },
    })),
  );

export const useUpdateApi = (selector: UpdateSelector) => useStore(selector);
