import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { useStoreApi } from "./store";

export const stage = {
  earlyUpdate: -400,
  fixedUpdate: -300,
  update: -200,
  lateUpdate: -100
};

export function useEarlyUpdate(callback = null) {
  useFrame((state, delta) => {
    callback && callback(state, delta);
  }, stage.earlyUpdate);
}

export function useFixedUpdate(callback = null) {
  const subscribe = useStoreApi().getState().subscribe;
  const ref = useRef(callback);
  useLayoutEffect(() => subscribe(ref), [subscribe]);
}

export function useUpdate(callback = null) {
  useFrame((state, delta) => {
    callback && callback(state, delta);
  }, stage.update);
}

export function useLateUpdate(callback = null) {
  useFrame((state, delta) => {
    callback && callback(state, delta);
  }, stage.lateUpdate);
}
