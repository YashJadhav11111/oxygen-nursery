import { useCallback, useEffect, useState } from 'react';
import type { Result } from '@/types';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Runs a service call and exposes loading / error / empty states so every page
 * can render them consistently. Because services return `Result<T>`, an API
 * failure later behaves exactly like a demo-data failure today.
 */
export function useAsync<T>(fn: () => Promise<Result<T>>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    run()
      .then((res) => {
        if (!active) return;
        if (res.ok) setState({ data: res.data ?? null, loading: false, error: null });
        else setState({ data: null, loading: false, error: res.error ?? 'Something went wrong.' });
      })
      .catch(() => {
        if (active) setState({ data: null, loading: false, error: 'Something went wrong.' });
      });
    return () => {
      active = false;
    };
  }, [run]);

  return state;
}
