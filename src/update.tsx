import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { Provider, createStore, useStoreApi } from './store';
import { ConfigureProps, UpdateProps } from './types';
import { useStore as useStoreR3F } from '@react-three/fiber';
import { useLoop } from './loops/loop';

export const Update = React.memo(({ render = 'auto', children }: UpdateProps) => {
  return (
    <Provider createStore={createStore(render)}>
      <Configure render={render} />
      <Loop>{children}</Loop>
      <FrameOverrides />
    </Provider>
  );
});

function Configure({ render = 'auto' }: ConfigureProps) {
  const store = useStoreApi();
  const setRender = store.getState().setRender;

  useEffect(() => setRender(render), [render, setRender]);

  return null;
}

function Loop({ children }: { children: React.ReactElement }) {
  useLoop();
  return children;
}

// Credits to Cody Bennett for this brilliant workaround.
// https://codesandbox.io/s/summer-glitter-3lirnp
function FrameOverrides() {
  const storeR3F = useStoreR3F();
  const store = useStoreApi();
  const render = useMemo(() => store.getState().render, [store]);

  const demand = render === 'manual' ? true : false;

  // Stop R3F from calling gl.render with manual
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
