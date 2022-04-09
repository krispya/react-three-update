import { useFrame } from '@react-three/fiber';
import { stage } from './hooks';

let subscribers;
let subscription;
let stepSize;
let maxSubsteps;

export function useFixedLoop() {
  let accumulator = 0;

  useFrame((state, delta) => {
    stepSize = state.fixedState.stepSize;
    subscribers = state.fixedState.subscribers;
    maxSubsteps = state.fixedState.maxSubsteps;

    accumulator += delta;
    const initialTime = performance.now();
    let substeps = 0;

    while (accumulator >= stepSize && substeps < maxSubsteps) {
      accumulator -= stepSize;
      substeps++;

      for (let i = 0; i < subscribers.length; i++) {
        subscription = subscribers[i];
        subscription.current(state, stepSize);
      }

      if (performance.now() - initialTime > stepSize * 1000) {
        // The framerate is not interactive anymore. Better bail out.
        break;
      }
    }

    // If the accumulator is bigger than delta, set it to 1.
    // It should never be bigger than delta unless something went wrong.
    accumulator = accumulator % stepSize;

    const factor = accumulator / stepSize;
    state.set((state) => ({
      fixedState: {
        ...state.fixedState,
        factor: factor,
        remainder: accumulator,
      },
    }));
  }, stage.fixedUpdate);
}
