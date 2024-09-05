import { EngineOptions } from '@babylonjs/core';
import { Scene, SceneOptions } from '@babylonjs/core';

export type BabylonjsProps = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  renderChildrenWhenReady?: boolean;
  sceneOptions?: SceneOptions;
  onSceneReady: (scene: Scene) => void;
  /**
   * Automatically trigger engine resize when the canvas resizes (default: true)
   */
  observeCanvasResize?: boolean;
  onRender?: (scene: Scene) => void;
  children?: React.ReactNode;
};
