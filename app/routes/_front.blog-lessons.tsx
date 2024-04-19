import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import blStyles from "~/styles/blog-lessons.css";
import { SwooshErrorPage } from "~/components/errors";

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
    if (error.status === 404) {
      return (
        <SwooshErrorPage
          title="404 - Sorry that page seems to be missing."
          text="Please click the link below"
          linkUrl="/"
          linkText="Home"
        />
      );
    } else if (error.status !== 500) {
      return (
        <SwooshErrorPage
          title={`${error.status} - Sorry there seems to be a problem.`}
          text="Please click the link below"
          linkUrl="/"
          linkText="Home"
        />
      );
    } else {
      return (
        <SwooshErrorPage
          title="500 - Server Error."
          text="We apologize for the inconvenience. We are working on this problem, please try again later."
        />
      );
    }
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
        <Link to="/">Go home</Link>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
