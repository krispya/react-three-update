import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { FixedCallback, RenderCallback, UpdateCallback } from './types';
import { useStoreApi } from './store';

export enum stage {
  early = -200,
  fixed = -100,
  default = 0,
  late = 100,
  render = 200,
}

export function useEarlyUpdate(callback: UpdateCallback) {
  const store = useStoreApi();
  useFrame((state, delta, frame) => {
    callback(state, delta, store.getState().fixed, frame);
  }, stage.early);
}

export function useFixedUpdate(callback: FixedCallback) {
  const subscribe = useStoreApi().getState().fixed.subscribe;
  const ref = useRef<FixedCallback>(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback: UpdateCallback) {
  const store = useStoreApi();
  useFrame((state, delta, frame) => {
    callback(state, delta, store.getState().fixed, frame);
  }, stage.default);
}

export function useLateUpdate(callback: UpdateCallback) {
  const store = useStoreApi();
  useFrame((state, delta, frame) => {
    callback(state, delta, store.getState().fixed, frame);
  }, stage.late);
}

export function useRenderUpdate(callback: RenderCallback, priority?: number) {
  const subscribe = useStoreApi().getState().render.subscribe;
  const ref = useRef<RenderCallback>(callback);
  useLayoutEffect(() => subscribe(ref, priority ?? 0), [priority, subscribe]);
}
