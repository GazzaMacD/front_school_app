import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import pricePlansStyles from "~/styles/price-plans.css";
import pricesStyles from "~/styles/components/prices.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pricePlansStyles },
  { rel: "stylesheet", href: pricesStyles },
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
