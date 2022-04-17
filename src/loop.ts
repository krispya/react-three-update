import { useFrame } from '@react-three/fiber';
import { stage } from './hooks';
import { FixedUpdateState, Subscription, useUpdateContext } from './store';

let subscribers: Subscription[];
let subscription: Subscription;
let fixedStep: number;
let maxSubsteps: number;

export function useFixedLoop() {
  let accumulator = 0;
  const store = useUpdateContext();

  useFrame((state, delta) => {
    const storeState = store.getState() as FixedUpdateState;
    fixedStep = storeState.fixedStep;
    subscribers = storeState.subscribers;
    maxSubsteps = storeState.maxSubsteps;

    accumulator += delta;
    const initialTime = performance.now();
    let substeps = 0;

    while (accumulator >= fixedStep && substeps < maxSubsteps) {
      accumulator -= fixedStep;
      substeps++;

      for (let i = 0; i < subscribers.length; i++) {
        subscription = subscribers[i];
        subscription.current(state, fixedStep, storeState);
      }

      if (performance.now() - initialTime > fixedStep * 1000) {
        // The framerate is not interactive anymore. Better bail out.
        break;
      }
    }

    // If the accumulator is bigger than delta, set it to 1.
    // It should never be bigger than delta unless something went wrong.
    accumulator = accumulator % fixedStep;

    const factor = accumulator / fixedStep;
    store.setState(() => ({
      factor: factor,
      remainder: accumulator,
    }));
  }, stage.fixedUpdate);
}
