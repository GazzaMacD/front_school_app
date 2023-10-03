import { Outlet } from "@remix-run/react";
import { type LinksFunction } from "@remix-run/node";

import lsStyles from "../styles/language-schools.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: lsStyles },
];

/*
 * client side code
 */
export default function LanguageSchoolsParentPage() {
  return (
    <>
      <Outlet />
    </>
  );
}
