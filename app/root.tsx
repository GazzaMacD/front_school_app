import { cssBundleHref } from "@remix-run/css-bundle";
import { type LinksFunction, type LoaderArgs, json } from "@remix-run/node";
import { AiFillPhone } from "react-icons/ai";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

import { authenticatedUser } from "./common/session.server";
import baseStyles from "./styles/base.css";
import baseElementStyles from "./styles/base-elements.css";
import { createGlobalEnvObj } from "./env.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: baseStyles },
  { rel: "stylesheet", href: baseElementStyles },
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
        <header className="header">
          <img
            className="header__logo"
            src="/img/xlingual_only_logo.svg"
            alt=""
          ></img>
          <div className="right-menu">
            <nav className="right-menu__nav">
              <ul className="right-menu__list">
                <li className="right-menu__item">
                  <a className="right-menu__link" href="tel:0561-42-5707">
                    <AiFillPhone />
                    <span>0561-42-5707</span>
                  </a>
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
                    <li className="right-menu__item">
                      <a className="right-menu__link" href="/login">
                        Login
                      </a>
                    </li>
                    <li className="right-menu__item">
                      <a className="right-menu__register-btn" href="/register">
                        Sign up
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
                  <span className="mburger__icon">&nbsp;</span>
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
        </header>
        <div className="content-wrapper">
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
