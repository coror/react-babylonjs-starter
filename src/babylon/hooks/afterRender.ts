import { OnFrameRenderFn } from '../types';
import { useContext, useEffect } from 'react';
import { SceneContext } from '../scene';
import { Observer, Nullable, Scene } from '@babylonjs/core';

/**
 * Register a callback for after the scene renders.
 *
 * @param callback called using onBeforeRender functionality of scene
 * @param mask the mask used to filter observers
 * @param insertFirst if true will be inserted at first position, if false (default) will be last position.
 * @param callOnce only call the callback once
 */
export const useAfterRender = (
  callback: OnFrameRenderFn,
  mask?: number,
  insertFirst?: boolean,
  callOnce?: boolean
): void => {
  const { scene } = useContext(SceneContext);

  useEffect(() => {
    if (scene === null) {
      return;
    }

    const unregisterOnFirstCall: boolean = callOnce === true;
    const sceneObserver: Nullable<Observer<Scene>> =
      scene.onAfterRenderObservable.add(
        callback,
        mask,
        insertFirst,
        undefined,
        unregisterOnFirstCall
      );

    if (unregisterOnFirstCall !== true) {
      return () => {
        scene.onAfterRenderObservable.remove(sceneObserver);
      };
    }
  });
};
