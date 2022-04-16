import React from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { useFixedLoop } from './loop';

type UpdateProps = {
  fixedStep?: number;
  maxSubsteps?: number;
  children: React.ReactNode;
};

export const Update = React.memo(({ fixedStep = 1 / 50, maxSubsteps = 10, children }: UpdateProps) => {
  return (
    <Provider createStore={createStore(fixedStep, maxSubsteps)}>
      <Configure fixedStep={fixedStep} maxSubsteps={maxSubsteps} />
      <FixedLoop>{children}</FixedLoop>
    </Provider>
  );
});

function Configure({ fixedStep, maxSubsteps }: { fixedStep: number; maxSubsteps: number }) {
  const store = useStoreApi();
  store.setState(() => ({
    fixedStep: fixedStep,
    maxSubsteps: maxSubsteps,
  }));
  return null;
}

function FixedLoop({ children }) {
  useFixedLoop();
  return children;
}
