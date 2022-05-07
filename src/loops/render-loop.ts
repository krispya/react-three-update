import { useFrame } from '@react-three/fiber';
import { useStoreApi } from '../store';
import { stage } from '../hooks';
import { RenderSubscription } from 'types';

let subscription: RenderSubscription;

export function useRenderLoop() {
  const store = useStoreApi();

  useFrame((state, delta) => {
    const renderState = store.getState().render;
    const { subscribers } = renderState;

    for (let i = 0; i < subscribers.length; i++) {
      subscription = subscribers[i];
      subscription.current(state, delta, renderState);
    }
  }, stage.render);
}
