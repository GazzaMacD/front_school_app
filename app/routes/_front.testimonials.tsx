import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import testimonialStyles from "../styles/testimonials.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: testimonialStyles },
];

/*
 * client side code
 */
export default function TestimonialsParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
