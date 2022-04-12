import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { useStore } from './store';

export const stage = {
  earlyUpdate: -400,
  fixedUpdate: -300,
  update: -200,
  lateUpdate: -100,
};

export function useEarlyUpdate(callback = null) {
  const store = useStore().getState();
  useFrame((state, delta, frame) => {
    callback && callback(state, delta, store);
  }, stage.earlyUpdate);
}

export function useFixedUpdate(callback = null) {
  const subscribe = useStore().getState().subscribe;
  const ref = useRef(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback = null) {
  const store = useStore().getState();
  useFrame((state, delta, frame) => {
    callback && callback(state, delta, store);
  }, stage.update);
}

export function useLateUpdate(callback = null) {
  const store = useStore().getState();
  useFrame((state, delta) => {
    callback && callback(state, delta, store);
  }, stage.lateUpdate);
}
