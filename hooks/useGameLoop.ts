import { useEffect, useRef } from 'react';

export const useGameLoop = (
  callback: (deltaTime: number) => void
) => {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef(callback);

  // Keep callback ref fresh so we don't need to restart the effect
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        // Calculate delta time
        let deltaTime = time - previousTimeRef.current;
        
        // Cap delta time to ~60ms (approx 15fps) to prevent physics explosions 
        // if the tab was backgrounded or the system lagged significantly.
        if (deltaTime > 64) deltaTime = 64;

        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
};