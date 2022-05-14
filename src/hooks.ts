import { useLayoutEffect, useRef } from 'react';
import { FixedCallback, UpdateCallback } from './types';
import { useStoreApi } from './store';

export function useSubscribeUpdate(callback: UpdateCallback, name: string, priority?: number) {
  const store = useStoreApi().getState();
  const index = store.stages.findIndex((stage) => stage.name === name);
  const subscribe = store.stages[index].subscribe;
  const ref = useRef<UpdateCallback>(callback);
  useLayoutEffect(() => subscribe(ref, priority ?? 0, index), [index, priority, subscribe]);
}

export function useEarlyUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'early', priority);
}

export function useFixedUpdate(callback: FixedCallback) {
  // const subscribe = useStoreApi().getState().fixed.subscribe;
  // const ref = useRef<FixedCallback>(callback);
  // useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'default', priority);
}

export function useLateUpdate(callback: UpdateCallback, priority?: number) {
  useSubscribeUpdate(callback, 'late', priority);
}

export function useRenderUpdate(callback: any, priority?: number) {
  useSubscribeUpdate(callback, 'render', priority);
}
