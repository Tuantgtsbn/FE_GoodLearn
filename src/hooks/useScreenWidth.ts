import { useEffect, useState } from 'react';

const useScreenWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);
  return width;
};

export default useScreenWidth;
