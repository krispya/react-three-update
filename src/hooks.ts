import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { FixedCallback, UpdateCallback, useUpdateContext } from './store';

export const stage = {
  earlyUpdate: -400,
  fixedUpdate: -300,
  update: -200,
  lateUpdate: -100,
};

export function useEarlyUpdate(callback: UpdateCallback) {
  const store = useUpdateContext();
  useFrame((state, delta, frame) => {
    callback && callback(state, delta, store.getState(), frame);
  }, stage.earlyUpdate);
}

export function useFixedUpdate(callback) {
  const subscribe = useUpdateContext().getState().subscribe;
  const ref = useRef<FixedCallback>(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback: UpdateCallback) {
  const store = useUpdateContext();
  useFrame((state, delta, frame) => {
    callback && callback(state, delta, store.getState(), frame);
  }, stage.update);
}

export function useLateUpdate(callback: UpdateCallback) {
  const store = useUpdateContext();
  useFrame((state, delta, frame) => {
    callback && callback(state, delta, store.getState(), frame);
  }, stage.lateUpdate);
}
