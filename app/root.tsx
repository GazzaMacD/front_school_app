import {
  type LinksFunction,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  Links,
  Link,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLocation,
  useLoaderData,
} from "@remix-run/react";
import { FaMobileAlt } from "react-icons/fa";

import { authenticatedUser } from "~/common/session.server";
import { createGlobalEnvObj } from "./env";
import errorStyles from "~/styles/errors.css?url";
import fontStyles from "~/styles/fonts.css?url";
import globalStyles from "~/styles/global.css?url";
import { HamburgerMenu } from "~/components/menus";

/**
 * helpers, loaders, actions
 */
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: errorStyles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userData = await authenticatedUser(request);
  const user = userData ? userData.user : null;
  const GLOBAL_ENV = createGlobalEnvObj();
  return json({ user, GLOBAL_ENV });
}

/**
 * Page
 */
export default function App() {
  const { user, GLOBAL_ENV } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="base-wrapper">
          <header className="g-header">
            <div className="g-header__inner">
              <div className="g-header__tagline-background"></div>
              <div className="g-header__branding">
                <Link to="/" className="g-header__logo-link">
                  <img
                    className="g-header__logo"
                    src="/img/xlingual_logo_without tagline.svg"
                    alt="XLingual logo"
                  ></img>
                </Link>
                <div className="g-header__tagline">
                  エクスリンガル｜Experts in Language Learning
                </div>
              </div>
              <div className="g-menu">
                <nav className="g-menu__nav">
                  <ul className="g-menu__list">
                    <li className="g-menu__item">
                      <a className="g-menu__phone" href="tel:0561-42-5707">
                        <FaMobileAlt />
                        <span>0561-42-5707</span>
                      </a>
                    </li>
                    <li className="g-menu__item g-menu__contact">
                      <Link to="/contact#form">
                        <span>問合せ</span>
                        <span>お問い合わせ</span>
                      </Link>
                    </li>
                    {user ? (
                      <li className="g-menu__item">
                        <form
                          className="right-menu__form"
                          action="/logout"
                          method="post"
                        >
                          <button className="g-menu__logout" type="submit">
                            ログアウト
                          </button>
                        </form>
                      </li>
                    ) : (
                      <>
                        <li className="g-menu__item">
                          <a className="g-menu__reglog-link" href="/register">
                            <div className="g-menu__reglog reg">
                              <span>新規</span>登録
                            </div>
                          </a>
                          <a className="g-menu__reglog-link" href="/login">
                            <div className="g-menu__reglog log">ログイン</div>
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
                <HamburgerMenu key={pathname} />
              </div>
            </div>
          </header>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.GLOBAL_ENV = ${JSON.stringify(GLOBAL_ENV)}`,
          }}
        />
      </body>
    </html>
  );
}
