import { useCallback, useEffect, useState } from "react";
import type { ApiResponse } from "../types";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: `http://localhost:4000/${string}`) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        const payload = (await response.json()) as ApiResponse<T>;

        if (!ignore)
          setState({ data: payload.data, loading: false, error: null });
      } catch (error) {
        if (!ignore)
          setState({
            data: null,
            loading: false,
            error: (error as Error).message,
          });
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [url, reloadKey]);

  return { ...state, reload };
}
