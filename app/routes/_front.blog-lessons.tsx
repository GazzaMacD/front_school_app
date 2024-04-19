import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Link,
} from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import blStyles from "~/styles/blog-lessons.css";
import { SwooshErrorPage } from "~/components/errors";
import { MESSAGES } from "~/common/languageDictionary";

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
          title={MESSAGES.ja.statusCode.HTTP404}
          text={MESSAGES.ja.errorBoundaryText.clickLink}
          linkUrl="/"
          linkText={MESSAGES.ja.errorBoundaryLinkTexts.home}
        />
      );
    } else if (error.status !== 500) {
      return (
        <SwooshErrorPage
          title={MESSAGES.ja.statusCode.HTTP500}
          text={MESSAGES.ja.errorBoundaryText.clickLink}
          linkUrl="/"
          linkText={MESSAGES.ja.errorBoundaryLinkTexts.home}
        />
      );
    } else {
      return (
        <SwooshErrorPage
          title={MESSAGES.ja.statusCode.HTTP500}
          text={MESSAGES.ja.errorBoundaryText.tryLater}
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
    return <h1>500 - Sorry looks like something went wrong on the server</h1>;
  }
}
