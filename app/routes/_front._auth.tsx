import { type LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import authStyles from "../styles/auth.css";
import pageCStyles from "~/styles/components/pages.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: authStyles },
  { rel: "stylesheet", href: pageCStyles },
];

export default function AuthParentRoute() {
  return (
    <>
      <Outlet />
    </>
  );
}
