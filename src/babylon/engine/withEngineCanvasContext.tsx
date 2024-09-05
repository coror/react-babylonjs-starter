import React from 'react';
import {
  EngineCanvasContext,
  EngineCanvasContextType,
} from './engineCanvasContext';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withEngineCanvasContext<
  P extends { engineCanvasContext: EngineCanvasContextType },
  R = Omit<P, 'engineCanvasContext'>
>(
  Component: React.ComponentClass<P> | React.FunctionComponent<P>
): React.FunctionComponent<R> {
  return function BoundComponent(props: R) {
    return (
      <EngineCanvasContext.Consumer>
        {(ctx) => (
          <Component {...(props as unknown as P)} engineCanvasContext={ctx} />
        )}
      </EngineCanvasContext.Consumer>
    );
  };
}
