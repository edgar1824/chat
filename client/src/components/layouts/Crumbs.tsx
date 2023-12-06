import { Container } from "components/reusable";
import { FC, Fragment, ReactNode } from "react";
import { Link, UIMatch, useLocation, useMatches } from "react-router-dom";

export const Crumbs: FC = () => {
  const location = useLocation();
  const matches = useMatches() as UIMatch<
    unknown,
    { crumb?: (data?: any) => ReactNode; path?: string }
  >[];
  const filteredCrumbs = matches.filter((m) => !!m?.handle?.crumb);

  if (!location.pathname.includes("/post")) {
    return null;
  }
  return (
    <Container className="pt-4">
      {filteredCrumbs.map((m, i) => (
        <Fragment key={i}>
          {" "}
          {filteredCrumbs.length > 1 && i > 0 && "> "}{" "}
          {!!m.handle.path ? (
            <Link to={m.handle.path} className="italic text-gray-700 underline">
              {m.handle?.crumb?.(m.data)}
            </Link>
          ) : (
            <span className="italic text-gray-700 underline">
              {m.handle?.crumb?.(m.data)}
            </span>
          )}
        </Fragment>
      ))}
    </Container>
  );
};
