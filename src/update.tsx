import React from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { useFixedLoop } from './loops/fixed-loop';
import { useRenderLoop } from './loops/render-loop';
import { ConfigureProps, UpdateProps } from './types';

export const Update = React.memo(
  ({ fixedStep = 1 / 50, maxSubsteps = 10, autoRender = true, children }: UpdateProps) => {
    return (
      <Provider createStore={createStore(fixedStep, maxSubsteps, autoRender)}>
        <Configure fixedStep={fixedStep} maxSubsteps={maxSubsteps} autoRender={autoRender} />
        <Loop>{children}</Loop>
      </Provider>
    );
  },
);

function Configure({ fixedStep, maxSubsteps, autoRender }: ConfigureProps) {
  const store = useStoreApi();
  const fixed = store.getState().fixed;
  const render = store.getState().render;

  fixed.setFixedStep(fixedStep!);
  fixed.setMaxSubsteps(maxSubsteps!);
  render.setAutoRender(autoRender!);

  return null;
}

function Loop({ children }: { children: React.ReactElement }) {
  useFixedLoop();
  useRenderLoop();
  return children;
}
