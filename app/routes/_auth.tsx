import { type LinksFunction } from "@remix-run/node";
import authStyles from "../styles/auth.css";
import { Outlet } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: authStyles },
];

export default function AuthParentRoute() {
  return (
    <div className="auth-wrapper">
      <div className="auth">
        <Outlet />
      </div>
    </div>
  );
}
