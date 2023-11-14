import { useState, useEffect } from 'react';

export const useViewportWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', throttle(handleResize, 200));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
};
