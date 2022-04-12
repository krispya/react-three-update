import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { useStoreApi } from './store';

export const stage = {
  earlyUpdate: -400,
  fixedUpdate: -300,
  update: -200,
  lateUpdate: -100,
};

export function useEarlyUpdate(callback = null) {
  const store = useStoreApi();
  useFrame((state, delta) => {
    callback && callback(state, delta, store.getState());
  }, stage.earlyUpdate);
}

export function useFixedUpdate(callback = null) {
  const subscribe = useStoreApi().getState().subscribe;
  const ref = useRef(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback = null) {
  const store = useStoreApi();
  useFrame((state, delta) => {
    callback && callback(state, delta, store.getState());
  }, stage.update);
}

export function useLateUpdate(callback = null) {
  const store = useStoreApi();
  useFrame((state, delta) => {
    callback && callback(state, delta, store.getState());
  }, stage.lateUpdate);
}
