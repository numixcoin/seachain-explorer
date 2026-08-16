import { useEffect, useState } from "react";

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[], intervalMs?: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      fn()
        .then((value) => {
          if (cancelled) return;
          setData(value);
          setError(null);
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(err instanceof Error ? err.message : String(err));
        })
        .finally(() => !cancelled && setLoading(false));
    };
    run();
    const timer = intervalMs ? window.setInterval(run, intervalMs) : undefined;
    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}

export function Panel({
  error,
  loading,
  children,
}: {
  error: string | null;
  loading: boolean;
  children: React.ReactNode;
}) {
  if (error) return <div className="error">{error}</div>;
  if (loading) return <p className="muted">Loading…</p>;
  return <>{children}</>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return <span className="mono">{children}</span>;
}
