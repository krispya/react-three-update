import { RootState, useFrame } from '@react-three/fiber';
import { FixedStage, useStoreApi } from '../store';
import { Subscription, UpdateCallbackRef } from 'types';

let subscription: Subscription<UpdateCallbackRef>;

const fixedLoop = (stage: FixedStage, state: RootState, delta: number) => {
  let accumulator = 0;
  const { subscribers, fixedStep, maxSubsteps } = stage;
  const initialTime = performance.now();
  let substeps = 0;

  accumulator += delta;

  while (accumulator >= fixedStep && substeps < maxSubsteps) {
    accumulator -= fixedStep;
    substeps++;

    for (let i = 0; i < subscribers.length; i++) {
      subscription = subscribers[i];
      subscription.ref.current(state, fixedStep);
    }
    if (performance.now() - initialTime > fixedStep * 1000) {
      // The framerate is not interactive anymore. Better bail out.
      break;
    }
  }
  // If the accumulator is bigger than delta, set it to 1.
  // It should never be bigger than delta unless something went wrong.
  accumulator = accumulator % fixedStep;
};

export function useLoop() {
  const store = useStoreApi();

  useFrame((state, delta) => {
    const stages = store.getState().stages;
    console.log(stages);

    for (let i = 0; i < stages.length; i++) {
      if (stages[i] instanceof FixedStage) {
        fixedLoop(stages[i] as FixedStage, state, delta);
      } else {
        const { subscribers } = stages[i];
        for (let j = 0; j < subscribers.length; j++) {
          subscription = subscribers[j];
          subscription.ref.current(state, delta);
        }
      }
    }
  });
}
