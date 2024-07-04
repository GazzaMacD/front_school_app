import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

import { SOCIAL_URLS } from "~/common/constants";
import { HOME_URL } from "~/common/constants.server";
import { ErrorPage } from "~/components/errors";

export default function FrontParentRoute() {
  return (
    <>
      <div className="content-wrapper">
        <Outlet />
      </div>
      <footer className="g-footer">
        <div className="g-grid-container1">
          <div className="g-footer__branding-col">
            <div className="g-footer__logo">
              <Link to="/">
                <img src="/img/logo_with_tagline.svg" alt="XLingual logo"></img>
              </Link>
            </div>
            <div className="g-footer__socials">
              <div>
                <Link
                  className="g-footer__social instagram"
                  to={SOCIAL_URLS.instagram_learn}
                >
                  <FaInstagram />
                  <span>Instagram | Language Learning</span>
                </Link>
                <Link
                  className="g-footer__social instagram"
                  to={SOCIAL_URLS.instagram_news}
                >
                  <FaInstagram />
                  <span>Instagram | News</span>
                </Link>
              </div>
              <div>
                <Link
                  to={SOCIAL_URLS.facebook}
                  className="g-footer__social regular"
                >
                  <FaFacebookF />
                  <span>Facebook</span>
                </Link>
                <Link
                  to={SOCIAL_URLS.youtube}
                  className="g-footer__social regular"
                >
                  <FaYoutube />
                  <span>Youtube</span>
                </Link>
              </div>
            </div>
            <div className="g-footer__copyright">
              <p>
                © Copyright 2024 株式会社XLingual | All Rights Reserved |
                Website by digital4.green
              </p>
            </div>
          </div>
          <div className="g-footer__links-col">
            <div>
              <h3>言語学習</h3>
              <ul>
                <li>
                  ― <Link to="/courses">語学コース一覧</Link>
                </li>
                <li>
                  ― <Link to="/price-plans">料金プラン</Link>
                </li>
                <li>
                  ―{" "}
                  <Link to="/learning-experiences">
                    ラーニング・エクスペリエンス
                  </Link>
                </li>
                <li>
                  ― <Link to="/blog-lessons">読んで学べるブログ</Link>
                </li>
              </ul>

              <h3>会社案内</h3>
              <ul>
                <li>
                  ― <Link to="/about">私たちについて</Link>
                </li>
                <li>
                  ― <Link to="/language-schools">スクール一覧</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>お問い合わせ</h3>
              <ul>
                <li>
                  ― <Link to="/contact#form">フォームでのお問い合わせ</Link>
                </li>
                <li>
                  ― <Link to="/contact#telephone">電話でのお問い合わせe</Link>
                </li>
                <li>
                  ―{" "}
                  <Link to="mailto:contact@xlingual.co.jp">
                    Eメールでのお問い合わせ
                  </Link>
                </li>
              </ul>
              <h3>その他</h3>
              <ul>
                <li>
                  ― <Link to="/my-page">マイページ</Link>
                </li>
                <li>
                  <Link to="/privacy">― プライバシーポリシー</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
