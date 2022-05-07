# react-three-update

### 🚨 Warning: The API is currently unstable. It works, but there will be breaking changes!

React hooks for Unity-like updates in [react-three-fiber](https://github.com/pmndrs/react-three-fiber).

```bash
npm install react-three-update # or yarn add react-three-update
```

Unity provides a [strict ordering of events](https://docs.unity3d.com/Manual/ExecutionOrder.html) that many game developers are familiar with. Meanwhile, react-three-fiber only has `useFrame` with priority that is coupled to the frameloop being in manual mode and lacks a fixed update method. react-three-update solves this by extending `useFrame` to have a strict sequence of update hooks along with a fixed frame loop. The updates are executed in the following order: `useEarlyUpdate`, `useFixedUpdate`, `useUpdate`, `useLateUpdate` and then `useRenderUpdate`. It also overrides the default react-three-fiber priority behavior with `useFrame` such that the priority going into positive numbers no longer puts it into manual mode. This means we are gree to set priorities how we like and configure manual mode separately!

👉 Note: The default `useFrame` priority aligns with the default update stage (priority of 0). This means Drei components will generally occur during the update stage along with most other business logic.

## How it works

Wrap your game in the Update component and then subscribe your business logic to update events with the hooks.

```jsx
import { Canvas } from '@react-three/fiber';
import { Update, useEarlyUpdate, useFixedUpdate, useUpdate, useLateUpdate, useRenderUpdate } from 'react-three-update';

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

  useFixedUpdate((state, fixedStep, fixedState) => {
    // Updates on a fixed step happen here. This is often physics
    // and mutations that need to be deterministic.
    // physics.step(fixedStep);
  });

  useUpdate((state, delta, fixedState) => {
    // The bulk of your business logic will go here.
  });

  useLateUpdate((state, delta, fixedState) => {
    // Any updates you want to occur right before rendering.
    // For example having a camera follow a character who might
    // be moved by input, physics or other interactions.
  });

  useRenderUpdate((state, delta, fixedState) => {
    // These updates happen during the rendering stage such as for
    // postprocessing. You can use an optional second paramter to define
    // a render function to be run at the end. Combine this with
    // frameloop={{ manual: true }} on Update.
  }, isRenderFunc);

  return {
    /* children */
  };
}
```

## More about `useRenderUpdate` and manual mode

R3F no longer relies on the `useFrame` priority to infer when the frameloop goes into manual mode when using react-three-update. This is true even if you are invoking `useFrame` directly. In order to use manual mode, you can set `frameloop` on `Update`. If undefined, the default `Canvas` properties are used instead.

```tsx
<Update frameloop= { mode?: 'always' | 'demand' | 'never', manual?: boolean } />
```

You will need to invoke a render function manually, either from R3F or from a prostprocessing library. [See here for more](https://docs.pmnd.rs/react-three-fiber/api/hooks#taking-over-the-render-loop). You can tell react-three-update which invocation of `useRenderUpdate` is meant to be the render function (and therefore called last) with an optional second parameter. When set to true, that function will be run last.

```jsx
useRenderUpdate(({ gl, scene, camera }) => gl.render(scene, camera), true);
```

## More about `useFixedUpdate`

There is a single fixed update loop that any callback passed into `useFixedUpdate` subscribes to. You can set the `fixedStep` and `maxSubsteps` on `Update`.

```jsx
<Update fixedStep={1 / 60} maxSubsteps={8}></Update>
```

| Prop          | Description                                                                                                       | Type     | Default |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `fixedStep`   | The rate of the fixed update. 1/60 is 60 frames per second.                                                       | `number` | `1/50`  |
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
| `fixedStep` | The rate of the fixed update. 1/60 is 60 frames per second. | `number` |
| `maxSubsteps` | The maximum amount of substeps before the loop bails. Only relevant when the framerate drops below the step size. | `number` |
| `remainder` | The time remaining after a fixed loop is complete. See [Fix Your Step](https://gafferongames.com/post/fix_your_timestep#the-final-touch). | `number` |
| `factor` | The interpolation factor. Calculated by `remainder / fixedStep`. See [Fix Your Step](https://gafferongames.com/post/fix_your_timestep#the-final-touch). | `number` |

This can be useful for manually implementing interpolation for physics or other effects that rely on a fixed update.

## Imperative updates with useUpdateApi

You can update the fixed update state imperatively with `useUpdateApi`. Like `useThree`, the hook is reactive and accepts selectors. You can access the fixed or render state.

```jsx
import { useUpdateApi } from 'react-three-update'

// For full state.
function Foo() {
  const state = useUpdateApi()
  ...

// Or with selector.
function Foo() {
  const setFixedStep = useUpdateApi((state) => state.fixed.setFixedStep);
  ...
```
