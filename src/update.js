import React, { useEffect } from 'react';
import { createStore, context, useStore } from './store';
import { useFixedLoop } from './loop';

export const Update = React.memo(({ stepSize = 1 / 50, maxSubsteps = 10, children }) => {
  const store = createStore(stepSize, maxSubsteps);
  return (
    <context.Provider value={store}>
      <FixedLoop>{children}</FixedLoop>
    </context.Provider>
  );
});

function FixedLoop({ children }) {
  const store = useStore().getState();

  useEffect(
    () =>
      store.subscribe(
        (state) => state.subscribers,
        (subscribers) => {
          console.log(subscribers);
        },
      ),
    [store],
  );

  useEffect(
    () =>
      store.subscribe(
        (state) => state.factor,
        (factor) => console.log(factor),
      ),
    [store],
  );

  useFixedLoop();
  return children;
}
