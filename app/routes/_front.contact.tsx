import type { LinksFunction } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import React from "react";
import { json } from "@remix-run/node";
import { getGlobalEnv } from "~/common/utils";

import contactStyles from "~/styles/contact.css";
import { BASE_API_URL } from "~/common/constants.server";
import pageCStyles from "~/styles/components/pages.css";
import cardStyles from "~/styles/components/cards.css";

/* Types */

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contactStyles },
  { rel: "stylesheet", href: pageCStyles },
  { rel: "stylesheet", href: cardStyles },
];

export default function ContactParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
