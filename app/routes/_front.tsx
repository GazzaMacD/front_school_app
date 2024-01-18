import { Outlet } from "@remix-run/react";
import { Link } from "@remix-run/react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function FrontParentRoute() {
  return (
    <>
      <div className="content-wrapper">
        <Outlet />
      </div>
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__branding-col one">
            <Link to="/">
              <h2>XLingual</h2>
            </Link>
            <p>Experts in language learning</p>
            <div className="footer__social">
              <Link to="#">
                <FaInstagram className="footer__social-icon" />
              </Link>
              <Link to="#">
                <FaFacebookF className="footer__social-icon" />
              </Link>
              <Link to="#">
                <FaYoutube className="footer__social-icon" />
              </Link>
            </div>
            <div className="footer__copyright">
              <p>
                © Copyright 2023 株式会社XLingual | All Rights Reserved |
                Website by digital4.green
              </p>
            </div>
          </div>
          <div className="footer__col">
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
          <div className="footer__col">
            <h3>お問い合わせ</h3>
            <ul>
              <li>
                ―{" "}
                <Link to="/contact/form#contact">フォームでのお問い合わせ</Link>
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
      </footer>
    </>
  );
}
