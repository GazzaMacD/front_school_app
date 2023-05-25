import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import globalStyles from "./styles/global.css";
import elementStyles from "./styles/element.css";
import rootStyles from "./styles/root.css";

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
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: elementStyles },
  { rel: "stylesheet", href: rootStyles },
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

          <div>
            <input type="checkbox" id="navi-toggle" className="checkbox" />
            <label htmlFor="navi-toggle" className="menu-button">
              <span className="icon">&nbsp;</span>
            </label>
            <div className="background">&nbsp;</div>
            <nav className="nav">
              <ul className="list">
                <li className="item">
                  <a className="link">Link 1 </a>
                </li>
                <li className="item">
                  <a className="link">Link 1 </a>
                </li>
                <li className="item">
                  <a className="link">Link 1 </a>
                </li>
                <li className="item">
                  <a className="link">Link 1 </a>
                </li>
                <li className="item">
                  <a className="link">Link 1 </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="header-space"></div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
