import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import pricePlansStyles from "../styles/price-plans.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pricePlansStyles },
];

/*
 * client side code
 */
export default function PricePlansParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
