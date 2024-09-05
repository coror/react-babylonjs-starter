import  { createContext, useContext } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine.js';
import { Nullable } from '@babylonjs/core/types.js';

// Type for the context
export type EngineCanvasContextType = {
  engine: Nullable<Engine>;
  canvas: Nullable<HTMLCanvasElement | WebGLRenderingContext>;
};

// Create the context with default values
export const EngineCanvasContext = createContext<EngineCanvasContextType>({
  engine: null,
  canvas: null,
});

// Hook to get the engine from the context
export const useEngine = (): Nullable<Engine> =>
  useContext(EngineCanvasContext).engine;

// Hook to get the canvas DOM element from the context
export const useCanvas = (): Nullable<
  HTMLCanvasElement | WebGLRenderingContext
> => useContext(EngineCanvasContext).canvas;
