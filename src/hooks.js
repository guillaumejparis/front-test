import { useEffect, useState, useRef, useCallback } from 'react';
import { directions } from './utils';

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useWindowSize = () => {
  // default handles our use case only
  const [windowSize, setWindowSize] = useState({
    width: 10000,
    height: 10000,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};

// events hooks

// hook to avoid code duplicate for wheel & touch hooks
export const useDirection = (hook, animate, up, down) => {
  const direction = hook();
  const prevDirection = usePrevious(direction);

  useEffect(() => {
    if (animate === 0 && prevDirection === null && direction === directions.UP) up();
    else if (animate === 0 && prevDirection === null && direction === directions.DOWN) down();
  }, [direction, prevDirection, animate, up, down]);
};

let pauseListener = false;

// for touchpad and mouse wheel
export const useWheel = () => {
  const [wheelValue, setWheelValue] = useState(0);

  const handleWheel = useCallback(
    (e) => {
      if (pauseListener) return;
      // deltaY threshold can be ajusted depending on device to avoid passing two steps at once
      if ((wheelValue <= 0 && e.deltaY > 30) || (wheelValue >= 0 && e.deltaY < -30)) {
        pauseListener = true;
        setWheelValue(e.deltaY);
        // pause listener for 500ms (pause before passing to another step)
        setTimeout(() => {
          pauseListener = false;
          setWheelValue(0);
        }, 500);
      }
    },
    [wheelValue],
  );

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  if (wheelValue === 0) return null;
  return wheelValue > 0 ? directions.DOWN : directions.UP;
};

// for touch
export const useTouch = () => {
  const [firstTouchPosition, setFirstTouchPosition] = useState(null);
  const [moved, setMoved] = useState(false);
  const [direction, setDirection] = useState(null);

  const handleTouchStart = useCallback((e) => {
    if (pauseListener) return;
    setFirstTouchPosition(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (pauseListener) return;
    setMoved(true);
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (pauseListener) return;
      pauseListener = true;
      setFirstTouchPosition(null);
      setMoved(false);
      if (moved) setDirection(e.changedTouches[0].clientY - firstTouchPosition > 0 ? directions.UP : directions.DOWN);
      // pause listener for 100ms (pause before passing to another step, less time for mobile because of touch end you cannot pass two steps at once)
      setTimeout(() => {
        pauseListener = false;
        setDirection(null);
      }, 100);
    },
    [firstTouchPosition, moved],
  );

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return direction;
};
