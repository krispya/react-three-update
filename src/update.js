import React, { useLayoutEffect } from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { useStore as useThreeStore } from '@react-three/fiber';
import { useFixedLoop } from './loop';

export function Update({ stepSize = 1 / 50, maxSubsteps = 10, children }) {
  return (
    <Provider createStore={createStore(stepSize, maxSubsteps)}>
      <InnerLoop stepSize={stepSize} maxSubsteps={maxSubsteps}>
        {children}
      </InnerLoop>
    </Provider>
  );
}

const InnerLoop = React.memo(({ stepSize, maxSubsteps, children }) => {
  const store = useStoreApi();
  const state = store.getState();
  const threeStore = useThreeStore().getState();

  useLayoutEffect(() => {
    threeStore.set(() => ({
      fixedState: {
        ...state,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(
    () =>
      store.subscribe(
        (state) => state.subscribers,
        (subscribers) => {
          threeStore.set(({ fixedState }) => ({
            fixedState: {
              ...fixedState,
              subscribers,
            },
          }));
        },
      ),
    [store, threeStore],
  );

  useLayoutEffect(() => {
    state.setStepSize(stepSize);
    threeStore.set(({ fixedState }) => ({
      fixedState: {
        ...fixedState,
        stepSize: stepSize,
      },
    }));
  }, [stepSize, state, threeStore]);

  useLayoutEffect(() => {
    state.setMaxSubsteps(maxSubsteps);
    threeStore.set(({ fixedState }) => ({
      fixedState: {
        ...fixedState,
        maxSubsteps: maxSubsteps,
      },
    }));
  }, [maxSubsteps, state, threeStore]);

  useFixedLoop();

  return children;
});
