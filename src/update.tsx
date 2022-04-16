import React from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { useFixedLoop } from './loop';

type UpdateProps = {
  stepSize?: number;
  maxSubsteps?: number;
  children: React.ReactNode;
};

export const Update = React.memo(({ stepSize = 1 / 50, maxSubsteps = 10, children }: UpdateProps) => {
  return (
    <Provider createStore={createStore(stepSize, maxSubsteps)}>
      <Configure stepSize={stepSize} maxSubsteps={maxSubsteps} />
      <FixedLoop>{children}</FixedLoop>
    </Provider>
  );
});

function Configure({ stepSize, maxSubsteps }: { stepSize: number; maxSubsteps: number }) {
  const store = useStoreApi();
  store.setState(() => ({
    stepSize: stepSize,
    maxSubsteps: maxSubsteps,
  }));
  return null;
}

function FixedLoop({ children }) {
  useFixedLoop();
  return children;
}
