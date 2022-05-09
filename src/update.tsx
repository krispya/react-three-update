import React, { useLayoutEffect, useMemo } from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { useFixedLoop } from './loops/fixed-loop';
import { useRenderLoop } from './loops/render-loop';
import { ConfigureProps, UpdateProps } from './types';
import { useStore as useStoreR3F } from '@react-three/fiber';

export const Update = React.memo(({ fixedStep = 1 / 50, maxSubsteps = 10, render, children }: UpdateProps) => {
  return (
    <Provider createStore={createStore(fixedStep, maxSubsteps, render)}>
      <Configure fixedStep={fixedStep} maxSubsteps={maxSubsteps} render={render} />
      <Loop>{children}</Loop>
      <FrameOverrides />
    </Provider>
  );
});

function Configure({ fixedStep, maxSubsteps, render }: ConfigureProps) {
  const storeR3F = useStoreApi();
  const fixedState = storeR3F.getState().fixed;
  const renderState = storeR3F.getState().render;

  fixedState.setFixedStep(fixedStep!);
  fixedState.setMaxSubsteps(maxSubsteps!);
  renderState.setRender(render);

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
  const store = useStoreApi();
  const render = useMemo(() => store.getState().render.render, [store]);

  const demand = render === 'demand' ? true : false;

  // Stop R3F from calling gl.render with demand
  useLayoutEffect(() => {
    const overridePriority = (state: any) => {
      if (state.internal.priority !== demand) {
        state.set(({ internal }: { internal: any }) => ({
          internal: { ...internal, priority: demand },
        }));
      }
    };
    overridePriority(storeR3F.getState());

    return storeR3F.subscribe(overridePriority);
  }, [storeR3F, demand]);

  return null;
}
