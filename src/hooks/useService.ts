
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type DependencyList,
  type Dispatch,
  type SetStateAction,
} from 'react';


export default <T>(
  promise: (() => Promise<T>) | false | undefined,
  deps: DependencyList = []
): [
  {
    data: T | undefined;
    loading: boolean;
    err: unknown;
    setErr: Dispatch<SetStateAction<unknown>>;
    count: number;
  },
  () => void
] => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T>();
  const [err, setErr] = useState<unknown>();
  const [count, setCount] = useState(0);
  const promiseCallback = useMemo(() => promise, deps);
  const refetch = useCallback(() => setCount((n) => n + 1), [setCount]);

  useEffect(() => {
    let mounted = true;
    const promiseCallbackPending = !!promiseCallback && promiseCallback();
    if (promiseCallbackPending) {
      setLoading(true);
      promiseCallbackPending
        .then((res) => {
          if (mounted) {
            setLoading(false);
            setData(res);
            setErr(undefined);
          }
        })
        .catch((reson) => {
          if (mounted) {
            setLoading(false);
            setErr(reson);
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [promiseCallback, count]);

  return [{ data, loading, err, setErr, count }, refetch];
};
