import {
  type LinksFunction,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
} from "@remix-run/react";

import { authenticatedUser } from "~/common/session.server";
import { createGlobalEnvObj } from "./env";
import errorStyles from "~/styles/errors.css?url";
import fontStyles from "~/styles/fonts.css?url";
import globalStyles from "~/styles/global.css?url";

/**
 * helpers, loaders, actions
 */
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: errorStyles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userData = await authenticatedUser(request);
  const user = userData ? userData.user : null;
  const GLOBAL_ENV = createGlobalEnvObj();
  return json({ user, GLOBAL_ENV });
}

/**
 * Page
 */
export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>XLingual</h1>
        <p>Update XLingual app to remix 2.13.1</p>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
