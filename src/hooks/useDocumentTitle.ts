import { useMatches } from 'react-router-dom';
import { useEffect } from 'react';

type RouteHandle<T = any> = {
  title?: string | ((data: T) => string);
};

export default function useDocumentTitle(): void {
  const matches = useMatches();

  useEffect(() => {
    const lastMatch = matches[matches.length - 1];

    const handle = lastMatch?.handle as RouteHandle | undefined;

    if (handle?.title) {
      const title =
        typeof handle.title === 'function'
          ? handle.title(lastMatch.data)
          : handle.title;
      document.title = title;
    }
  }, [matches]);
}
