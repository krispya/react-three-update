import createContext from 'zustand/context';
import create, { SetState, StateSelector } from 'zustand';
import { RenderOptions, StageState, UpdateCallbackRef, UpdateState } from './types';

const createStage = (name: string, set: SetState<UpdateState>): StageState<UpdateCallbackRef> => {
  return {
    name: name,
    subscribers: [],
    subscribe: (ref: UpdateCallbackRef, priority: number, index: number) => {
      set(({ stages }) => {
        stages[index].subscribers = [...stages[index].subscribers, { ref, priority }].sort(
          (a, b) => a.priority - b.priority,
        );
        return { stages: stages };
      });
    },
  };
};

export const { Provider, useStore, useStoreApi } = createContext<UpdateState>();
export const createStore = (render: RenderOptions) => () =>
  create<UpdateState>((set) => ({
    render: render,
    setRender: (v: RenderOptions) => set({ render: v }),
    stages: [
      createStage('early', set),
      createStage('default', set),
      createStage('late', set),
      createStage('render', set),
    ],
    addStage: (stage, index) =>
      set(({ stages }) => {
        const name = typeof stage === 'string' ? stage : stage.name;
        if (index) {
          stages.splice(index, 0, createStage(name, set));
        } else {
          stages.push(createStage(name, set));
        }
      }),
    // removeStage: () => {}
  }));

export function useUpdateApi<T = UpdateState>(
  selector: StateSelector<UpdateState, T> = (state) => state as unknown as T,
) {
  return useStore(selector);
}
