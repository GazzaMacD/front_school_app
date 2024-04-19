import type { LinksFunction } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";

import contactStyles from "~/styles/contact.css";
import pageCStyles from "~/styles/components/pages.css";
import cardStyles from "~/styles/components/cards.css";
import { ErrorPage } from "~/components/errors";

/**
 *  Utils and helper functions
 */

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contactStyles },
  { rel: "stylesheet", href: pageCStyles },
  { rel: "stylesheet", href: cardStyles },
];

/**
 * Page
 */

export default function ContactParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
