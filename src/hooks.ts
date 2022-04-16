import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { FixedUpdateState, FixedCallback, useStoreApi } from './store';

export const stage = {
  earlyUpdate: -400,
  fixedUpdate: -300,
  update: -200,
  lateUpdate: -100,
};

export function useEarlyUpdate(callback: FixedCallback) {
  const store = useStoreApi();
  useFrame((state, delta) => {
    callback && callback(state, delta, store.getState());
  }, stage.earlyUpdate);
}

export function useFixedUpdate(callback) {
  const storeState = useStoreApi().getState();
  const subscribe = storeState.subscribe;
  const ref = useRef<FixedCallback>(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback: FixedCallback) {
  const store = useStoreApi();
  useFrame((state, delta) => {
    callback && callback(state, delta, store.getState());
  }, stage.update);
}

export function useLateUpdate(callback: FixedCallback) {
  const store = useStoreApi();
  useFrame((state, delta) => {
    callback && callback(state, delta, store.getState());
  }, stage.lateUpdate);
}
