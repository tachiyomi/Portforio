import * as CANNON from 'cannon';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {useRender} from 'react-three-fiber';

const context = React.createContext();
export function Provider({children}) {
  const [world] = useState(() => new CANNON.World());
  useEffect(() => {
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    world.gravity.set(0, 0, -5);
  }, [world]);

  useRender(() => world.step(1 / 60));
  return <context.Provider value={world} children={children}/>
}

export function useCannon({
  ...props
}, fn, deps = []) {
  const ref = useRef();
  const world = useContext(context);
  const [body] = useState(() => new CANNON.Body(props))
  useEffect(() => {
    fn(body);
    world.addBody(body);
    return() => world.removeBody(body);
  }, deps);

  useRender(() => {
    if (ref.current) {
      ref.current.position.copy(body.position);
      ref.current.quaternion.copy(body.quaternion);
    }
  });

  return ref;
}
