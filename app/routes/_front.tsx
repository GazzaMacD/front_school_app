import { Outlet } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

export default function FrontParentRoute() {
  return (
    <>
      <div className="content-wrapper">
        <Outlet />
      </div>
      <footer className="g-footer">
        <div className="container g-footer__inner">
          <div className="g-footer__branding-col one">
            <Link className="g-footer__logo" to="/">
              <img src="/img/logo_with_tagline.svg" alt="XLingual logo"></img>
            </Link>
            <div className="g-footer__socials">
              <Link className="g-footer__social instagram" to="#">
                <FaInstagram />
                <span>Instagram | Language Learning</span>
              </Link>
              <Link to="#" className="g-footer__social regular">
                <FaFacebookF />
                <span>Facebook</span>
              </Link>
              <Link className="g-footer__social instagram" to="#">
                <FaInstagram />
                <span>Instagram | News</span>
              </Link>
              <Link className="g-footer__social regular" to="#">
                <FaYoutube />
                <span>Youtube</span>
              </Link>
            </div>
            <div className="g-footer__copyright">
              <p>
                © Copyright 2023 株式会社XLingual | All Rights Reserved |
                Website by digital4.green
              </p>
            </div>
          </div>
          <div className="g-footer__links-col">
            <div>
              <h3>言語学習</h3>
              <ul>
                <li>
                  ― <Link to="/courses">コース紹介</Link>
                </li>
                <li>
                  ― <Link to="/prices">料金</Link>
                </li>
                <li>
                  ―{" "}
                  <Link to="/learning-experiences">
                    ランゲージ・エクスペリエンス
                  </Link>
                </li>
                <li>
                  ― <Link to="/courses">読んで学べるブログ</Link>
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
                <li>
                  ― <Link to="/news">最新情報</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>お問い合わせ</h3>
              <ul>
                <li>
                  ―{" "}
                  <Link to="/contact/form#contact">
                    フォームでのお問い合わせ
                  </Link>
                </li>
                <li>
                  ―{" "}
                  <Link to="/contact/telephone#contact">
                    電話でのお問い合わせe
                  </Link>
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
                  ― <Link to="/privacy-policy">プライバシーポリシー</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
