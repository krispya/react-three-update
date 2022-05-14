import { useFrame } from '@react-three/fiber';
import { useStoreApi } from '../store';
import { Subscription, UpdateCallbackRef } from 'types';

let subscription: Subscription<UpdateCallbackRef>;

export function useLoop() {
  const store = useStoreApi();

  useFrame((state, delta) => {
    const stages = store.getState().stages;
    console.log(stages);

    for (let i = 0; i < stages.length; i++) {
      const { subscribers } = stages[i];

      for (let j = 0; j < subscribers.length; j++) {
        subscription = subscribers[j];
        subscription.ref.current(state, delta);
      }
    }
  });
}
