import { RootState } from '@react-three/fiber';
import { MutableRefObject } from 'react';

export type RenderOptions = 'auto' | 'manual';
export type StageTypes = 'standard' | 'fixed';

export type StageOptions = {
  name: string;
  type: StageTypes;
};

export type UpdateProps = {
  render?: RenderOptions;
  children: React.ReactElement;
};

export type ConfigureProps = Omit<UpdateProps, 'children'>;

export interface UpdateCallback {
  (state: RootState, delta: number, frame?: THREE.XRFrame): void;
}
export interface FixedCallback {
  (state: RootState, fixedStep: number, frame?: THREE.XRFrame): void;
}
export interface UpdateCallback {
  (state: RootState, delta: number, frame?: THREE.XRFrame): void;
}

export type FixedCallbackRef = MutableRefObject<FixedCallback>;
export type UpdateCallbackRef = MutableRefObject<UpdateCallback>;

export type FixedSubscription = FixedCallbackRef;
export type Subscription<T> = {
  ref: T;
  priority: number;
};

export type StageState<T> = {
  name: string;
  subscribers: Subscription<T>[];
  subscribe: (ref: T, priority: number, index: number) => void;
};

export type UpdateState = {
  render: RenderOptions;
  setRender: (v: RenderOptions) => void;
  stages: StageState<UpdateCallbackRef>[];
  addStage: (stage: string | StageOptions, index?: number) => void;
};
