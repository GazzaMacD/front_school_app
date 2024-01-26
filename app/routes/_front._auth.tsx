import { type LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { Swoosh1 } from "~/components/swooshes";
import authStyles from "../styles/auth.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: authStyles },
];

export default function AuthParentRoute() {
  return (
    <div>
      <div className="auth-wrapper">
        <div className="auth">
          <Outlet />
        </div>
      </div>

      <Swoosh1 swooshColor="beige" backColor="cream" />
    </div>
  );
}
