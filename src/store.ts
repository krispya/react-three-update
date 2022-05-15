import createContext from 'zustand/context';
import create, { SetState, StateSelector } from 'zustand';
import { FixedStageOptions, RenderOptions, Subscription, UpdateCallbackRef, UpdateState } from './types';

export class Stage {
  name: string;
  subscribers: Subscription<UpdateCallbackRef>[];
  subscribe: (ref: UpdateCallbackRef, priority: number, index: number) => void;

  constructor(name: string, set: SetState<UpdateState>) {
    this.name = name;
    this.subscribers = [];
    this.subscribe = (ref: UpdateCallbackRef, priority: number, index: number) => {
      set(({ stages }) => {
        stages[index].subscribers = [...stages[index].subscribers, { ref, priority }].sort(
          (a, b) => a.priority - b.priority,
        );
        return { stages: stages };
      });
      return () => {
        set(({ stages }) => {
          stages[index].subscribers = stages[index].subscribers.filter((s) => s.ref !== ref);
          return { stages: stages };
        });
      };
    };
  }
}

export class FixedStage extends Stage {
  fixedStep: number;
  maxSubsteps: number;

  constructor(stage: string | FixedStageOptions, set: SetState<UpdateState>) {
    const _stage = typeof stage === 'string' ? ({ name: stage } as FixedStageOptions) : stage;
    super(_stage.name, set);
    this.fixedStep = _stage.fixedStep ?? 1 / 50;
    this.maxSubsteps = _stage.maxSubsteps ?? 10;
  }
}

export const { Provider, useStore, useStoreApi } = createContext<UpdateState>();
export const createStore = (render: RenderOptions) => () =>
  create<UpdateState>((set) => ({
    render: render,
    setRender: (v: RenderOptions) => set({ render: v }),
    stages: [
      new Stage('early', set),
      new FixedStage('fixed', set),
      new Stage('default', set),
      new Stage('late', set),
      new Stage('render', set),
    ],
    addStage: (name, index) =>
      set(({ stages }) => {
        if (index) {
          stages.splice(index, 0, new Stage(name, set));
        } else {
          stages.push(new Stage(name, set));
        }
      }),
    addFixedStage: (stage, index) =>
      set(({ stages }) => {
        if (index) {
          stages.splice(index, 0, new FixedStage(stage, set));
        } else {
          stages.push(new FixedStage(stage, set));
        }
      }),
    // removeStage: () => {}
  }));

export function useUpdateApi<T = UpdateState>(
  selector: StateSelector<UpdateState, T> = (state) => state as unknown as T,
) {
  return useStore(selector);
}
