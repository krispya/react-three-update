import { useFrame } from '@react-three/fiber';
import { useStoreApi } from '../store';
import { stage } from '../hooks';
import { Subscription, RenderCallbackRef } from 'types';

let subscription: Subscription<RenderCallbackRef>;

export function useRenderLoop() {
  const store = useStoreApi();

  useFrame((state, delta) => {
    const renderState = store.getState().render;
    const fixedState = store.getState().fixed;
    const { subscribers } = renderState;

    for (let i = 0; i < subscribers.length; i++) {
      subscription = subscribers[i];
      subscription.ref.current(state, delta, fixedState);
    }
  }, stage.render);
}
