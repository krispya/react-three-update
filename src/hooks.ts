import { useLayoutEffect, useRef } from 'react';
import { UpdateCallback } from './types';
import { useStoreApi } from './store';

function useMutableCallback<T>(fn: T) {
  const ref = useRef<T>(fn);
  useLayoutEffect(() => void (ref.current = fn), [fn]);
  return ref;
}

export function useSubscribeUpdate(callback: UpdateCallback, name: string, priority?: number) {
  const store = useStoreApi().getState();
  const index = store.stages.findIndex((stage) => stage.name === name);
  const subscribe = store.stages[index].subscribe;
  const ref = useMutableCallback<UpdateCallback>(callback);
  useLayoutEffect(() => subscribe(ref, priority ?? 0, index), [priority, subscribe]);
}

export function useEarlyUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'early', priority);
}

export function useFixedUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'fixed', priority);
}

export function useUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'default', priority);
}

export function useLateUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'late', priority);
}

export function useRenderUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'render', priority);
}
