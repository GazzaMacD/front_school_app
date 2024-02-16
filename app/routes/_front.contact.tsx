import type { LinksFunction } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import React from "react";
import { json } from "@remix-run/node";
import { getGlobalEnv } from "~/common/utils";

import contactStyles from "~/styles/contact.css";
import { BASE_API_URL } from "~/common/constants.server";

/* Types */

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contactStyles },
];

export default function ContactParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
