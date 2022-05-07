import { useFrame } from '@react-three/fiber';
import { useStoreApi } from '../store';
import { stage } from '../hooks';
import { RenderSubscription } from 'types';

let subscription: RenderSubscription;

export function useRenderLoop() {
  const store = useStoreApi();

  useFrame((state, delta) => {
    const renderState = store.getState().render;
    const { subscribers, autoRender } = renderState;
    const { gl, scene, camera } = state;

    for (let i = 0; i < subscribers.length; i++) {
      subscription = subscribers[i];
      subscription.current(state, delta, renderState);
    }

    if (autoRender) gl.render(scene, camera);
  }, stage.render);
}
