import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError, Link } from "@remix-run/react";

import { SwooshErrorPage } from "~/components/errors";
import { redirects } from "~/common/utils";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const filePath = params["*"];
  if (filePath && filePath in redirects) {
    return redirect(redirects[filePath].path, redirects[filePath].statusCode);
  }
  throw new Response("Use other route", { status: 404 });
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
