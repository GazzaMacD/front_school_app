import * as React from "react";

import {
  type LoaderFunctionArgs,
  type LinksFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Outlet, Link, useLocation } from "@remix-run/react";
import { BsHouse, BsCalendarWeek, BsX } from "react-icons/bs";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

import { authenticatedUser } from "../common/session.server";
import { hasSchedulePermissions } from "../common/permissions.server";
import myPageStyles from "~/styles/my-page.css";
import { SOCIAL_URLS } from "~/common/constants";
import { type TUser } from "~/common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: myPageStyles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userData = await authenticatedUser(request);
  //if null get path and redirect to login route with redirect parameter
  if (!userData) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  const user: TUser = userData.user;
  const perms = {
    classSchedules: hasSchedulePermissions(user.groups, user.is_staff),
  };
  return json({ user, perms });
}

export default function MyPageParentRoute() {
  const { user, perms } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <header className="mp-p-header">
        <div className="mp-p-header__button" onClick={() => setMenuOpen(true)}>
          <span>&nbsp;</span>
        </div>
        <h2>マイページ</h2>
        <p>
          <span>こんにちは、</span>
          <span>{user?.contact?.name ? user.contact.name : user.email}</span>
        </p>
      </header>
      <Menu
        key={pathname}
        classSchedules={perms.classSchedules}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main className={`mp-p-main ${menuOpen ? "active" : ""}`}>
        <Outlet />
      </main>
    </>
  );
}

type TMenuProps = {
  menuOpen: boolean;
  setMenuOpen: (x: boolean) => void;
  classSchedules: boolean;
};

function Menu({ menuOpen, setMenuOpen, classSchedules }: TMenuProps) {
  return (
    <>
      <aside className={`mp-p-sidebar ${menuOpen ? "active" : ""}`}>
        <ul className="mp-p-sidebar__menu">
          <li
            onClick={() => setMenuOpen(false)}
            className="mp-p-sidebar__menu__close"
          >
            <BsX />
            メニューを閉じる
          </li>
          <li>
            <Link to="/my-page" onClick={() => setMenuOpen(false)}>
              <BsHouse />
              マイページTOP
            </Link>
          </li>
          {classSchedules && (
            <li>
              <Link onClick={() => setMenuOpen(false)} to="/my-page/schedules">
                <BsCalendarWeek />
                スケジュール
              </Link>
            </li>
          )}
        </ul>
        <div className="mp-p-sidebar__socials">
          <Link
            className="mp-p-sidebar__social instagram"
            to={SOCIAL_URLS.instagram_learn}
          >
            <FaInstagram />
            <span>Instagram | Language Learning</span>
          </Link>
          <Link
            className="mp-p-sidebar__social instagram"
            to={SOCIAL_URLS.instagram_learn}
          >
            <FaInstagram />
            <span>Instagram | News</span>
          </Link>
          <Link
            className="mp-p-sidebar__social facebook"
            to={SOCIAL_URLS.facebook}
          >
            <FaFacebookF />
            <span>Facebook</span>
          </Link>
          <Link
            className="mp-p-sidebar__social 
          youtube"
            to={SOCIAL_URLS.youtube}
          >
            <FaYoutube />
            <span>Youtube</span>
          </Link>
        </div>
      </aside>
      <div className={`mp-p-overlay ${menuOpen ? "active" : ""}`}></div>
    </>
  );
}
