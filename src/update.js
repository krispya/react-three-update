import React from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { useFixedLoop } from './loop';

export const Update = React.memo((props) => {
  const { stepSize = 1 / 50, maxSubsteps = 10, children } = props;
  return (
    <Provider createStore={createStore(stepSize, maxSubsteps)}>
      <Configure {...props} />
      <FixedLoop>{children}</FixedLoop>
    </Provider>
  );
});

function Configure({ stepSize, maxSubsteps }) {
  const store = useStoreApi();
  store.setState(() => ({
    stepSize: stepSize,
    maxSubsteps: maxSubsteps,
  }));
}

function FixedLoop({ children }) {
  useFixedLoop();
  return children;
}
