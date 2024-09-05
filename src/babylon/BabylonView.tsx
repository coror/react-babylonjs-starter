import React, { useEffect, useRef, useState } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine.js';
import { Scene } from '@babylonjs/core/scene.js';
import { Nullable } from '@babylonjs/core/types.js';
import { SceneContext, SceneContextType } from './scene';
import { EngineCanvasContext, EngineCanvasContextType } from './engine';
import { BabylonjsProps } from './types';

export const BabylonView = (
  props: BabylonjsProps & React.CanvasHTMLAttributes<HTMLCanvasElement>
) => {
  const reactCanvas = useRef<Nullable<HTMLCanvasElement>>(null);
  const {
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    renderChildrenWhenReady,
    children,
    observeCanvasResize,
    ...rest
  } = props;

  const [sceneContext, setSceneContext] = useState<SceneContextType>({
    scene: null,
    sceneReady: false,
  });

  const [engineContext, setEngineContext] = useState<EngineCanvasContextType>({
    engine: null,
    canvas: null,
  });

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(
        reactCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      );
      setEngineContext(() => ({
        engine,
        canvas: reactCanvas.current,
      }));

      let resizeObserver: Nullable<ResizeObserver> = null;

      const scene = new Scene(engine, sceneOptions);

      if (observeCanvasResize !== false && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          engine.resize();
          if (scene.activeCamera /* needed for rendering */) {
            // render to prevent flickering on resize
            if (typeof onRender === 'function') {
              onRender(scene);
            }
            scene.render();
          }
        });
        resizeObserver.observe(reactCanvas.current);
      }

      const sceneIsReady = scene.isReady();
      if (sceneIsReady) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => {
          onSceneReady(scene);
          setSceneContext(() => ({
            canvas: reactCanvas.current,
            scene,
            engine,
            sceneReady: true,
          }));
        });
      }

      engine.runRenderLoop(() => {
        if (scene.activeCamera) {
          if (typeof onRender === 'function') {
            onRender(scene);
          }
          scene.render();
        } else {
          // @babylonjs/core throws an error if you attempt to render with no active camera.
          // if we attach as a child React component we have frames with no active camera.
          console.warn('no active camera..');
        }
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener('resize', resize);
      }

      setSceneContext(() => ({
        canvas: reactCanvas.current,
        scene,
        engine,
        sceneReady: sceneIsReady,
      }));

      return () => {
        // cleanup
        if (resizeObserver !== null) {
          resizeObserver.disconnect();
        }

        if (window) {
          window.removeEventListener('resize', resize);
        }

        scene.getEngine().dispose();
      };
    }
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    observeCanvasResize,
  ]);

  return (
    <>
      <canvas ref={reactCanvas} {...rest} />
      <EngineCanvasContext.Provider value={engineContext}>
        <SceneContext.Provider value={sceneContext}>
          {(renderChildrenWhenReady !== true ||
            (renderChildrenWhenReady === true && sceneContext.sceneReady)) &&
            children}
        </SceneContext.Provider>
      </EngineCanvasContext.Provider>
    </>
  );
};
