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
  (state: RootState, delta: number, fixedState: FixedUpdateState, frame?: THREE.XRFrame): void;
}

export interface FixedCallback {
  (state: RootState, fixedStep: number, fixedState: FixedUpdateState, frame?: THREE.XRFrame): void;
}

export interface RenderCallback {
  (state: RootState, delta: number, renderState: RenderState, frame?: THREE.XRFrame): void;
}

export type FixedSubscription = MutableRefObject<FixedCallback>;
export type RenderSubscription = MutableRefObject<RenderCallback>;

export type FixedUpdateState = {
  fixedStep: number;
  maxSubsteps: number;
  factor: number;
  remainder: number;
  subscribers: FixedSubscription[];
  subscribe: (ref: FixedSubscription) => () => void;
  setFixedStep: (v: number) => void;
  setMaxSubsteps: (v: number) => void;
};

export type FixedUpdateSlice = {
  fixed: FixedUpdateState;
};

export type RenderState = {
  frameloop?: FrameloopOverload;
  setFrameloop: (v?: FrameloopOverload) => void;
  subscribers: RenderSubscription[];
  subscribe: (ref: RenderSubscription) => () => void;
};

export type RenderSlice = {
  render: RenderState;
};

export type UpdateState = FixedUpdateSlice & RenderSlice;
export type UpdateSelector = StateSelector<UpdateState, Partial<UpdateState>>;
