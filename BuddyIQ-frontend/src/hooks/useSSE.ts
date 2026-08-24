import { useEffect } from "react";

interface Props {
  onStatus?: (data: any) => void;
  onEvaluation?: (data: any) => void;
  onResources?: (data: any) => void;
  onCheatsheet?: (data: any) => void;
  onDone?: () => void;
}

export function useSSE(url: string | null, handlers: Props) {
  useEffect(() => {
    if (!url) return;

    const eventSource = new EventSource(url);

    eventSource.addEventListener("status", (e: any) => {
      handlers.onStatus?.(JSON.parse(e.data));
    });

    eventSource.addEventListener("evaluation", (e: any) => {
      handlers.onEvaluation?.(JSON.parse(e.data));
    });

    eventSource.addEventListener("resources", (e: any) => {
      handlers.onResources?.(JSON.parse(e.data));
    });

    eventSource.addEventListener("cheatsheet", (e: any) => {
      handlers.onCheatsheet?.(JSON.parse(e.data));
    });

    eventSource.addEventListener("done", () => {
      handlers.onDone?.();
      eventSource.close();
    });

    return () => eventSource.close();
  }, [url]);
}