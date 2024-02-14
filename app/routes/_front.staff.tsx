import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import staffStyles from "~/styles/staff.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: staffStyles },
];

/*
 * client side code
 */
export default function StaffParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
