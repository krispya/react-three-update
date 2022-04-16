import React from 'react';
import { createUpdateStore, StoreContext } from './store';
import { useFixedLoop } from './loop';

type UpdateProps = {
  fixedStep?: number;
  maxSubsteps?: number;
  children: React.ReactNode;
};

export const Update = React.memo(({ fixedStep = 1 / 50, maxSubsteps = 10, children }: UpdateProps) => {
  const store = createUpdateStore(fixedStep, maxSubsteps);
  return (
    <StoreContext.Provider value={store}>
      <Configure fixedStep={fixedStep} maxSubsteps={maxSubsteps} />
      <FixedLoop>{children}</FixedLoop>
    </StoreContext.Provider>
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
