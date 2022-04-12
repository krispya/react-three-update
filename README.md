# react-three-update

React hooks for Unity-like updates in [react-three-fiber](https://github.com/pmndrs/react-three-fiber).

```bash
npm install react-three-update # or yarn add react-three-update
```

Unity provides a [strict ordering of events](https://docs.unity3d.com/Manual/ExecutionOrder.html) that many game developers are familiar with. Meanwhile, react-three-fiber only has `useFrame` and lacks a fixed update method. react-three-update solves this by extending `useFrame` to have a strict sequence of update hooks along with a fixed frame loop. The updates are executed in the following order: `useEarlyUpdate`, `useFixedUpdate`, `useUpdate`, `useLateUpdate` and then rendering.

👉 Note: By default `useFrame` will execute after `useLateUpdate` and before rendering. This means most react-three-fiber and Drei components will occur after `useLateUpdate`.

## How it works

Wrap your game in the Update component and then subscribe your business logic to update events with the hooks.

```jsx
import { Canvas } from '@react-three/fiber';
import { Update, useEarlyUpdate, useFixedUpdate, useUpdate, useLateUpdate } from 'react-three-update';

function App() {
  return (
    <Canvas>
      <Update>
        <Game />
      </Update>
    </Canvas>
  );
}

function Game() {
  useEarlyUpdate((state, delta, fixedState) => {
    // Do early updates here like input polling.
  });

  useFixedUpdate((state, stepSize, fixedState) => {
    // Updates on a fixed step happen here. This is often physics
    // and mutations that need to be deterministic.
    // physics.step(stepSize);
  });

  useUpdate((state, delta, fixedState) => {
    // The bulk of your business logic will go here.
  });

  useLateUpdate((state, delta, fixedState) => {
    // Any updates you want to occur right before rendering.
    // For example having a camera follow a character who might
    // be moved by input, physics or other interactions.
  });

  return {
    /* children */
  };
}
```

## More about `useFixedUpdate`

There is a single fixed update loop that any callback passed into `useFixedUpdate` subscribes to, like `useFrame` in react-three-fiber. You can set the `stepSize` and `maxSubsteps` on `Update`.

```jsx
<Update stepSize={1 / 60} maxSubsteps={8}></Update>
```

| Prop          | Description                                                                                                       | Type     | Default |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `stepSize`    | The rate of the fixed update. 1/60 is 60 frames per second.                                                       | `number` | `1/50`  |
| `maxSubsteps` | The maximum amount of substeps before the loop bails. Only relevant when the framerate drops below the step size. | `number` | `10`    |

👉 Note: These properties can be updated dynamically during runtime.

### Accessing the fixedState

A `fixedState` can be accessed from any update hook.

```jsx
useUpdate((state, delta, fixedState) => { const factor = fixedState.factor }
```

And has the following properties:
| Prop | Description | Type |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| `stepSize` | The rate of the fixed update. 1/60 is 60 frames per second. | `number` |
| `maxSubsteps` | The maximum amount of substeps before the loop bails. Only relevant when the framerate drops below the step size. | `number` |
| `remainder` | The time remaining after a fixed loop is complete. See [Fix Your Step](https://gafferongames.com/post/fix_your_timestep#the-final-touch). | `number` |
| `factor` | The interpolation factor. Calculated by `remainder / stepSize`. See [Fix Your Step](https://gafferongames.com/post/fix_your_timestep#the-final-touch). | `number` |

This can be useful for manually implementing interpolation for physics or other effects that rely on a fixed update.

### Imperative updates with useFixedUpdateApi

You can update the fixed update state imperatively with `useFixedUpdateApi`. Like `useThree`, the hook is reactive and accepts selectors.

```jsx
import { useFixedUpdateApi } from 'react-three-update'

// For full state.
function Foo() {
  const state = useFixedUpdateApi()

// Or with selector.
function Foo() {
  const setStepSize = useFixedUpdateApi((state) => state.setStepSize);
```
