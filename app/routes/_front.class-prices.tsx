import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import classPriceStyles from "../styles/class-prices.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: classPriceStyles },
];

/*
 * client side code
 */
export default function ClassPricesParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
