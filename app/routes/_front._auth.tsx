import { type LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { Swoosh1 } from "~/components/swooshes";
import authStyles from "../styles/auth.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: authStyles },
];

export default function AuthParentRoute() {
  return (
    <>
      <div className="au-wrapper">
        <Outlet />
      </div>
      <Swoosh1 swooshColor="beige" backColor="cream" />
    </>
  );
}
