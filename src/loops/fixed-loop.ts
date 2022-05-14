import { useFrame } from '@react-three/fiber';
import { FixedSubscription } from '../types';
import { useStoreApi } from '../store';

let subscribers: FixedSubscription[];
let subscription: FixedSubscription;
let fixedStep: number;
let maxSubsteps: number;

export function useFixedLoop() {
  // let accumulator = 0;
  const store = useStoreApi();

  useFrame((state, delta) => {
    // const fixedState = store.getState().fixed;
    // fixedStep = fixedState.fixedStep;
    // subscribers = fixedState.subscribers;
    // maxSubsteps = fixedState.maxSubsteps;
    // accumulator += delta;
    // const initialTime = performance.now();
    // let substeps = 0;
    // while (accumulator >= fixedStep && substeps < maxSubsteps) {
    //   accumulator -= fixedStep;
    //   substeps++;
    //   for (let i = 0; i < subscribers.length; i++) {
    //     subscription = subscribers[i];
    //     subscription.current(state, fixedStep, fixedState);
    //   }
    //   if (performance.now() - initialTime > fixedStep * 1000) {
    //     // The framerate is not interactive anymore. Better bail out.
    //     break;
    //   }
    // }
    // // If the accumulator is bigger than delta, set it to 1.
    // // It should never be bigger than delta unless something went wrong.
    // accumulator = accumulator % fixedStep;
    // const factor = accumulator / fixedStep;
    // store.setState(({ fixed }) => ({ fixed: { ...fixed, factor: factor, remainder: accumulator } }));
  });
}
