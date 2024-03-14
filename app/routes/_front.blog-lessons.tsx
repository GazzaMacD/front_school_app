import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import blStyles from "~/styles/blog-lessons.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: blStyles },
];

/*
 * client side code
 */
export default function LessonsParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ textAlign: "center", padding: "120px" }}>
        <h1>{error.status} Error</h1>
        <p>{error.data}</p>
        <Link to="/">Go home</Link>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <Link to="/">Go home</Link>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
