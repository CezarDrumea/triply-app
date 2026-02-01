import { useEffect, useState } from "react";
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

  useEffect(() => {
    let ignore = false;

    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(url);
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
  }, [url]);

  return state;
}
