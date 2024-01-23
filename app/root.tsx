import { cssBundleHref } from "@remix-run/css-bundle";
import { type LinksFunction, type LoaderArgs, json } from "@remix-run/node";
import { AiFillPhone } from "react-icons/ai";
import { FaMobileAlt } from "react-icons/fa";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

import { authenticatedUser } from "./common/session.server";
import globalStyles from "./styles/global.css";
import fontStyles from "./styles/fonts.css";
import { SolidPillButtonLink } from "./components/buttons";
import { createGlobalEnvObj } from "./env.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: fontStyles },
  { rel: "stylesheet", href: globalStyles },
];

export async function loader({ request }: LoaderArgs) {
  const userData = await authenticatedUser(request);
  const user = userData ? userData.user : null;
  const GLOBAL_ENV = createGlobalEnvObj();
  return json({ user, GLOBAL_ENV });
}

export default function App() {
  const { user, GLOBAL_ENV } = useLoaderData<typeof loader>();
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="base-wrapper">
          <header className="g-header">
            <div className="g-header__inner">
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
                    <li className="g-menu__item">
                      <SolidPillButtonLink
                        to="/contact/form#contact"
                        color="brown"
                      >
                        お問い合わせフォーム
                      </SolidPillButtonLink>
                    </li>
                    {user ? (
                      <li>
                        <form
                          className="right-menu__form"
                          action="/logout"
                          method="post"
                        >
                          <button className="right-menu__logout" type="submit">
                            Logout
                          </button>
                        </form>
                      </li>
                    ) : (
                      <>
                        <li className="g-menu__item">
                          <a className="g-menu__reglog-link" href="/register">
                            <div className="g-menu__reglog reg">新規登録</div>
                          </a>
                          <a className="g-menu__reglog-link" href="/login">
                            <div className="g-menu__reglog log">ログイン</div>
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>
                <div className="mburger">
                  <form>
                    <input
                      type="checkbox"
                      id="navi-toggle"
                      className="mburger__checkbox"
                    />
                    <label
                      htmlFor="navi-toggle"
                      className="mburger__button"
                      role="button"
                    >
                      <div className="g-burger__button-inner">
                        <span className="mburger__icon">&nbsp;</span>
                        <span className="mburger__text">メニュー</span>
                      </div>
                    </label>
                    <div className="mburger__background">&nbsp;</div>
                    <div className="mburger__menu">
                      <div className="mburger__left">
                        <ul className="mburger__list">
                          <li className="mburger__item">
                            <a className="mb__link">Courses</a>
                          </li>
                          <li className="mburger__item">
                            <a className="mb__link">Experiences</a>
                          </li>
                          <li className="mburger__item">
                            <a className="mb__link">Prices</a>
                          </li>
                          <li className="mburger__item">
                            <a className="mb__link">About us</a>
                          </li>
                          <li className="mburger__item">
                            <a className="mb__link">Free Lessons</a>
                          </li>
                          <li className="mburger__item">
                            <a className="mb__link">News</a>
                          </li>
                        </ul>
                      </div>
                      <div className="mburger__right">
                        <h3 className="mburger__subheading">Other Links</h3>
                        <div className="mburger__subblock">
                          <nav>
                            <ul className="mburger__list">
                              <li className="mburger__item">
                                <a className="mb__link mb__link--secondary">
                                  Link 1{" "}
                                </a>
                              </li>
                              <li className="mburger__item">
                                <a className="mb__link mb__link--secondary">
                                  Link 1{" "}
                                </a>
                              </li>
                              <li className="mburger__item">
                                <a className="mb__link mb__link--secondary">
                                  Link 1{" "}
                                </a>
                              </li>
                              <li className="mburger__item">
                                <a className="mb__link mb__link--secondary">
                                  Link 1{" "}
                                </a>
                              </li>
                              <li className="mburger__item">
                                <a className="mb__link mb__link--secondary">
                                  Link 1{" "}
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                        <h3 className="mburger__subheading">Social</h3>
                        <div className="mburger__subblock">
                          <nav>
                            <ul className="mburger__social">
                              <li>
                                <a className="mburger__social-link">
                                  <FaInstagram className="mburger__social-icon" />
                                </a>
                              </li>
                              <li>
                                <a className="mburger__social-link">
                                  <FaFacebookF className="mburger__social-icon" />
                                </a>
                              </li>
                              <li>
                                <a className="mburger__social-link">
                                  <FaYoutube className="mburger__social-icon" />
                                </a>
                              </li>
                              <li>
                                <a className="mburger__social-link">
                                  <FaLinkedinIn className="mburger__social-icon" />
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
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
        <LiveReload />
      </body>
    </html>
  );
}
