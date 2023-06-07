import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import baseStyles from "./styles/base.css";
import baseElementStyles from "./styles/base-elements.css";
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

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: baseStyles },
  { rel: "stylesheet", href: baseElementStyles },
];

export default function App() {
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
            <nav>
              <ul className="right-menu__list">
                <li className="right-menu__item">
                  <a className="right-menu__link" href="tel:0561-42-5707">
                    <AiFillPhone />
                    <span>0561-42-5707</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div className="mburger">
              <input
                type="checkbox"
                id="navi-toggle"
                className="mburger__checkbox"
              />
              <label htmlFor="navi-toggle" className="mburger__button">
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
                            <FaInstagram size={"28px"} />
                          </a>
                        </li>
                        <li>
                          <a className="mburger__social-link">
                            <FaFacebookF size={"26px"} />
                          </a>
                        </li>
                        <li>
                          <a className="mburger__social-link">
                            <FaYoutube size={"32px"} />
                          </a>
                        </li>
                        <li>
                          <a className="mburger__social-link">
                            <FaLinkedinIn size={"28px"} />
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="content-wrapper">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
