import { cssBundleHref } from "@remix-run/css-bundle";
import {
  type LinksFunction,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaMobileAlt,
} from "react-icons/fa";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
  useLoaderData,
} from "@remix-run/react";

import { authenticatedUser } from "~/common/session.server";
import { createGlobalEnvObj } from "~/env.server";
import { ErrorPage } from "~/components/errors";
import globalStyles from "~/styles/global.css";
import fontStyles from "~/styles/fonts.css";
import errorStyles from "~/styles/errors.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
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

export default function App() {
  const { user, GLOBAL_ENV } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
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
        <LiveReload />
      </body>
    </html>
  );
}

function HamburgerMenu() {
  return (
    <div>
      <form>
        <input type="checkbox" id="navi-toggle" className="g-sm__checkbox" />
        <label htmlFor="navi-toggle" className="g-sm__button" role="button">
          <div>
            <span className="g-sm__button__icon">&nbsp;</span>
            <span className="g-sm__button__text">メニュー</span>
          </div>
        </label>
        <div className="g-sm">
          <nav className="g-sm__inner">
            <div className="g-sm__inner__menus">
              <h3>言語学習</h3>
              <ul>
                <li>
                  <Link to="/courses">― コース紹介</Link>
                </li>
                <li>
                  <Link to="/prices">― 料金</Link>
                </li>
                <li>
                  <Link to="/learning-experiences">
                    ― ランゲージ・エクスペリエンス
                  </Link>
                </li>
                <li>
                  <Link to="/courses">― 読んで学べるブログ</Link>
                </li>
              </ul>

              <h3>会社案内</h3>
              <ul>
                <li>
                  <Link to="/about">― 私たちについて</Link>
                </li>
                <li>
                  <Link to="/language-schools">― スクール一覧</Link>
                </li>
                <li>
                  <Link to="/news">― 最新情報</Link>
                </li>
              </ul>
              <h3>お問い合わせ</h3>
              <ul>
                <li>
                  <Link to="/contact#form">― フォームでのお問い合わせ</Link>
                </li>
                <li>
                  <Link to="/contact#telephone">― 電話でのお問い合わせe</Link>
                </li>
                <li>
                  <Link to="mailto:contact@xlingual.co.jp">
                    ― Eメールでのお問い合わせ
                  </Link>
                </li>
              </ul>
              <h3>その他</h3>
              <ul>
                <li>
                  <Link to="/privacy-policy">― プライバシーポリシー</Link>
                </li>
              </ul>
            </div>
            <div className="g-sm__inner__socials">
              <Link className="g-sm__social instagram" to="#">
                <FaInstagram />
                <div>Instagram | Language Learning</div>
              </Link>
              <Link to="#" className="g-sm__social regular">
                <FaFacebookF />
                <div>Facebook</div>
              </Link>
              <Link className="g-sm__social instagram" to="#">
                <FaInstagram />
                <div>Instagram | News</div>
              </Link>
              <Link className="g-sm__social regular" to="#">
                <FaYoutube />
                <div>Youtube</div>
              </Link>
            </div>
          </nav>
        </div>
      </form>
    </div>
  );
}

function ErrorDoc({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>Oh no...</title>
        <Links />
        <Meta />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// best effort, last ditch error boundary. This should only catch root errors
// all other errors should be caught by the index route which will include
// the footer and menu which is much better.
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorDoc>
          <ErrorPage
            title="404 - Sorry that page seems to be missing."
            text="Please click the link below"
            linkUrl="/"
            linkText="Home"
          />
        </ErrorDoc>
      );
    } else if (error.status !== 500) {
      return (
        <ErrorDoc>
          <ErrorPage
            title={`${error.status} - Sorry there seems to be a problem.`}
            text="Please click the link below"
            linkUrl="/"
            linkText="Home"
          />
        </ErrorDoc>
      );
    } else {
      return (
        <ErrorDoc>
          <ErrorPage
            title="500 - Server Error."
            text="We apologize for the inconvenience. We are working on this problem, please try again later."
          />
        </ErrorDoc>
      );
    }
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
        <Link to="/">Go home</Link>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
