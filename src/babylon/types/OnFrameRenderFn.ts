import { Scene } from '@babylonjs/core';
import { EventState } from '@babylonjs/core';

export type OnFrameRenderFn = (
  eventData: Scene,
  eventState: EventState
) => void;
