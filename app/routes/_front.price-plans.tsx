import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import pricePlansStyles from "~/styles/price-plans.css";
import pricesStyles from "~/styles/components/prices.css";
import swipperStyles from "swiper/css";
import swipperNavStyles from "swiper/css/navigation";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swipperStyles },
  { rel: "stylesheet", href: swipperNavStyles },
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
