import { createContext, useContext } from 'react';
import { Scene } from '@babylonjs/core/scene.js';
import { Nullable } from '@babylonjs/core/types.js';

// Type for the scene context
export type SceneContextType = {
  scene: Nullable<Scene>;
  sceneReady: boolean;
};

// Create the scene context with default values
export const SceneContext = createContext<SceneContextType>({
  scene: null,
  sceneReady: false,
});

// Hook to get the scene from the context
export const useScene = (): Nullable<Scene> => useContext(SceneContext).scene;
