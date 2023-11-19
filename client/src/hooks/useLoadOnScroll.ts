import { useAppContext } from "contexts";
import { convertSearchParamsStr } from "helpers";
import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router-dom";
import instance from "request/api";
import { DBDocument, IResponse } from "types/requests";

// pagination api query number must be "page"
export const useLoadOnScroll = ({
  url,
  query,
}: {
  url: string;
  query?: Record<string, any>;
}) => {
  const { setError } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DBDocument[]>([]);
  const [docsCount, setDocsCount] = useState(0);
  const observer = useRef<IntersectionObserver>();
  const { state } = useNavigation();

  const lastElementRef: LegacyRef<HTMLElement> = useCallback(
    (node: HTMLElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !loading && data?.length < docsCount) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [page, loading, docsCount, data]
  );

  useEffect(() => {
    let controller = new AbortController();
    const fetchData = async () => {
      if (state === "idle") {
        setLoading(true);
        const search = convertSearchParamsStr({ ...query, page });
        try {
          const res = await instance.get(`${url}?${search}`, {
            signal: controller.signal,
          });
          setData((p) => [
            ...p.filter(
              (u) =>
                !res.data?.items?.some((n?: DBDocument) => n?._id === u?._id)
            ),
            ...res.data?.items,
          ]);
          if (!!res.data?.docsCount && !docsCount) {
            setDocsCount(res.data?.docsCount);
          }
        } catch (err) {
          if (!controller.signal.aborted) setError(err as IResponse);
        }
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [page]);

  return { data, lastElementRef, loading, hasMore: data?.length < docsCount };
};
