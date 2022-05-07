import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { FixedCallback, RenderCallback, UpdateCallback } from './types';
import { useStoreApi } from './store';

export const stage = {
  earlyUpdate: -300,
  fixedUpdate: -200,
  lateFixedUpdate: -100,
  update: 0,
  lateUpdate: 100,
  render: 200,
};

export function useEarlyUpdate(callback: UpdateCallback) {
  const store = useStoreApi();
  useFrame((state, delta, frame) => {
    if (callback) callback(state, delta, store.getState().fixed, frame);
  }, stage.earlyUpdate);
}

export function useFixedUpdate(callback: FixedCallback) {
  const subscribe = useStoreApi().getState().fixed.subscribe;
  const ref = useRef<FixedCallback>(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback: UpdateCallback) {
  const store = useStoreApi();
  useFrame((state, delta, frame) => {
    if (callback) callback(state, delta, store.getState().fixed, frame);
  }, stage.update);
}

export function useLateUpdate(callback: UpdateCallback) {
  const store = useStoreApi();
  useFrame((state, delta, frame) => {
    if (callback) callback(state, delta, store.getState().fixed, frame);
  }, stage.lateUpdate);
}

export function useRenderUpdate(callback: RenderCallback) {
  const subscribe = useStoreApi().getState().render.subscribe;
  const ref = useRef<RenderCallback>(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}
