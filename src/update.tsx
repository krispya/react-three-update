import React, { useLayoutEffect, useMemo } from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { useFixedLoop } from './loops/fixed-loop';
import { useRenderLoop } from './loops/render-loop';
import { ConfigureProps, UpdateProps } from './types';
import { useStore as useStoreR3F } from '@react-three/fiber';

export const Update = React.memo(({ fixedStep = 1 / 50, maxSubsteps = 10, frameloop, children }: UpdateProps) => {
  return (
    <Provider createStore={createStore(fixedStep, maxSubsteps, frameloop)}>
      <Configure fixedStep={fixedStep} maxSubsteps={maxSubsteps} frameloop={frameloop} />
      <Loop>{children}</Loop>
      <FrameOverrides />
    </Provider>
  );
});

function Configure({ fixedStep, maxSubsteps, frameloop }: ConfigureProps) {
  const storeR3F = useStoreApi();
  const fixedState = storeR3F.getState().fixed;
  const renderState = storeR3F.getState().render;

  fixedState.setFixedStep(fixedStep!);
  fixedState.setMaxSubsteps(maxSubsteps!);
  renderState.setFrameloop(frameloop);

  return null;
}

function Loop({ children }: { children: React.ReactElement }) {
  useFixedLoop();
  useRenderLoop();
  return children;
}

// Credits to Cody Bennett for this brilliant workaround.
// https://codesandbox.io/s/summer-glitter-3lirnp
function FrameOverrides() {
  const storeR3F = useStoreR3F();
  const frameloopR3F = useMemo(() => storeR3F.getState().frameloop, [storeR3F]);
  const store = useStoreApi();
  const frameloop = useMemo(() => store.getState().render.frameloop, [store]);

  const mode = frameloop?.mode ?? frameloopR3F ?? 'always';
  const manual = frameloop?.manual ?? false;

  // Set frameloop mode
  useLayoutEffect(() => storeR3F.getState().setFrameloop(mode), [storeR3F, mode]);

  // Stop R3F from calling gl.render with manual
  useLayoutEffect(() => {
    const overridePriority = (state: any) => {
      if (state.internal.priority !== manual) {
        state.set(({ internal }: { internal: any }) => ({
          internal: { ...internal, priority: manual },
        }));
      }
    };
    overridePriority(storeR3F.getState());

    return storeR3F.subscribe(overridePriority);
  }, [storeR3F, manual]);

  return null;
}
