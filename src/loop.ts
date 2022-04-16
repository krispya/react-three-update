import { useFrame } from '@react-three/fiber';
import { stage } from './hooks';
import { FixedUpdateState, Subscription, useStoreApi } from './store';

let subscribers: Subscription[];
let subscription: Subscription;
let stepSize: number;
let maxSubsteps: number;

export function useFixedLoop() {
  let accumulator = 0;
  const store = useStoreApi();

  useFrame((state, delta) => {
    const storeState = store.getState() as FixedUpdateState;
    stepSize = storeState.stepSize;
    subscribers = storeState.subscribers;
    maxSubsteps = storeState.maxSubsteps;

    accumulator += delta;
    const initialTime = performance.now();
    let substeps = 0;

    while (accumulator >= stepSize && substeps < maxSubsteps) {
      accumulator -= stepSize;
      substeps++;

      for (let i = 0; i < subscribers.length; i++) {
        subscription = subscribers[i];
        subscription.current(state, stepSize, storeState);
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
    store.setState(() => ({
      factor: factor,
      remainder: accumulator,
    }));
  }, stage.fixedUpdate);
}
