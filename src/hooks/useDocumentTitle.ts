import { useMatches } from "react-router-dom";
import { useEffect } from "react";

type RouteHandle = {
    title?: string;
};

export default function useDocumentTitle(): void {
    const matches = useMatches();

    useEffect(() => {
        const lastMatch = matches[matches.length - 1];

        const handle = lastMatch?.handle as RouteHandle | undefined;

        if (handle?.title) {
            document.title = handle.title;
        }
    }, [matches]);
}