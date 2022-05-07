import { RootState } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { StateSelector } from 'zustand';

export type FrameloopOverload = {
  mode?: 'always' | 'demand' | 'never';
  manual?: boolean;
};
export type FrameLoop = 'always' | 'demand' | 'never';

export type UpdateProps = {
  frameloop?: FrameloopOverload;
  fixedStep?: number;
  maxSubsteps?: number;
  children: React.ReactElement;
};

export type ConfigureProps = Omit<UpdateProps, 'children'>;

export interface UpdateCallback {
  (state: RootState, delta: number, fixedState: FixedState, frame?: THREE.XRFrame): void;
}

export interface FixedCallback {
  (state: RootState, fixedStep: number, fixedState: FixedState, frame?: THREE.XRFrame): void;
}

export interface RenderCallback {
  (state: RootState, delta: number, fixedState: FixedState, frame?: THREE.XRFrame): void;
}

export type FixedSubscription = MutableRefObject<FixedCallback>;
export type RenderSubscription = MutableRefObject<RenderCallback>;

export type FixedState = {
  fixedStep: number;
  maxSubsteps: number;
  factor: number;
  remainder: number;
  subscribers: FixedSubscription[];
  subscribe: (ref: FixedSubscription) => () => void;
  setFixedStep: (v: number) => void;
  setMaxSubsteps: (v: number) => void;
};

export type FixedSlice = {
  fixed: FixedState;
};

export type RenderState = {
  frameloop?: FrameloopOverload;
  setFrameloop: (v?: FrameloopOverload) => void;
  subscribers: RenderSubscription[];
  subscribe: (ref: RenderSubscription, isRenderFunc?: boolean) => () => void;
};

export type RenderSlice = {
  render: RenderState;
};

export type UpdateState = FixedSlice & RenderSlice;
export type UpdateSelector = StateSelector<UpdateState, Partial<UpdateState>>;
