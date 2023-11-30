import { FC, ReactNode, useEffect, useState } from "react";
import { Link, To, useNavigate } from "react-router-dom";
import styles from "./pagination.module.css";

interface Props {
  paginationCount: number;
  maxItems?: number; // MIN 3
  mainPath: string;
  dots?: boolean;
}

const changeFstAndLastElems = (arr: any[]) =>
  arr.map((elem, i) => {
    if (i === arr.length - 1) return { ...elem, isPrev: false };
    if (i === 0) return { ...elem, isPrev: true };
    return elem;
  });

export const Pagination: FC<Props> = ({
  paginationCount,
  maxItems = 7,
  mainPath,
  dots = false,
}) => {
  const page = +Object.fromEntries(new URL(window.location.href).searchParams)
    .page;

  const [isDots, setIsDots] = useState({
    next:
      paginationCount > maxItems &&
      page <= paginationCount - Math.floor(maxItems / 2),
    prev: paginationCount > maxItems && page > Math.floor(maxItems / 2),
  });
  const [items, setItems] = useState(
    changeFstAndLastElems(
      Array.from({ length: paginationCount })
        .map((_, i) => ({ num: i + 1 }))
        .slice(
          paginationCount < maxItems
            ? 0
            : Math.min(
                paginationCount - maxItems,
                Math.max(0, page - Math.ceil(maxItems / 2))
              ),
          paginationCount < maxItems
            ? maxItems
            : Math.min(
                paginationCount - maxItems,
                Math.max(0, page - Math.ceil(maxItems / 2))
              ) + maxItems
        )
    )
  );

  useEffect(() => {
    if (
      page === items[items.length - 1]?.num &&
      !items[items.length - 1]?.isPrev &&
      page < paginationCount
    ) {
      const start = page - maxItems + 1;
      const end = start + maxItems;
      setItems(
        changeFstAndLastElems(
          Array.from({ length: paginationCount })
            .map((_, i) => ({ num: i + 1 }))
            .slice(start, end)
        )
      );
    } else if (page === items[0]?.num && items[0]?.isPrev && page > 1) {
      const start = page - 2;
      const end = start + maxItems;
      setItems(
        changeFstAndLastElems(
          Array.from({ length: paginationCount })
            .map((_, i) => ({ num: i + 1 }))
            .slice(start, end)
        )
      );
    }
  }, [page]);

  useEffect(() => {
    if (paginationCount > maxItems) {
      setIsDots({ next: page < paginationCount - 1, prev: page > 2 });
    }
  }, [items]);

  if (!paginationCount || paginationCount === 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <Prev {...{ mainPath, page }} />
      {dots && isDots.prev && (
        <Item active={false} noHover>
          ...
        </Item>
      )}
      {items.map(({ num }, i) => (
        <Item active={page === num} key={i} to={`${mainPath}?page=${num}`}>
          {num}
        </Item>
      ))}
      {dots && isDots.next && (
        <Item active={false} noHover>
          ...
        </Item>
      )}
      <Next {...{ paginationCount, mainPath, page }} />
    </div>
  );
};

const Item = ({
  to,
  children,
  active,
  noHover,
  ...props
}: {
  to?: To;
  children?: ReactNode;
  active?: boolean;
  noHover?: boolean;
}) => {
  return (
    <Link
      {...props}
      to={to as To}
      className={[
        styles.item,
        active ? styles.active : "",
        noHover ? "pointer-events-none" : "",
      ].join(" ")}
    >
      {children}
    </Link>
  );
};

const Prev = ({ mainPath, page }: { mainPath: string; page: number }) => {
  const navigate = useNavigate();
  const prev = () => {
    if (page > 1) {
      navigate(`${mainPath}?page=${page - 1}`);
    }
  };
  return (
    <div
      className={[
        styles.item,
        styles.prev,
        page === 1 ? "pointer-events-none" : "",
      ].join(" ")}
      onClick={prev}
    >
      ‹‹
    </div>
  );
};
const Next = ({
  paginationCount,
  mainPath,
  page,
}: {
  paginationCount: number;
  mainPath: string;
  page: number;
}) => {
  const navigate = useNavigate();
  const next = () => {
    if (page < paginationCount) {
      navigate(`${mainPath}?page=${page + 1}`);
    }
  };
  return (
    <div
      className={[
        styles.item,
        styles.next,
        page === paginationCount ? "pointer-events-none" : "",
      ].join(" ")}
      onClick={next}
    >
      ››
    </div>
  );
};
