import { Link } from "@remix-run/react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { SOCIAL_URLS } from "~/common/constants";

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
                  <Link to="/courses">― 語学コース一覧</Link>
                </li>
                <li>
                  <Link to="/price-plans">― 料金プラン</Link>
                </li>
                <li>
                  <Link to="/learning-experiences">
                    ― ラーニング・エクスペリエンス
                  </Link>
                </li>
                <li>
                  <Link to="/blog-lessons">― 読んで学べるブログ</Link>
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
              </ul>
              <h3>お問い合わせ</h3>
              <ul>
                <li>
                  <Link to="/contact#form">― フォームでのお問い合わせ</Link>
                </li>
                <li>
                  <Link to="/contact#telephone">― 電話でのお問い合わせ</Link>
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
                  <Link to="/my-page">― マイページ</Link>
                </li>
                <li>
                  <Link to="/privacy">― プライバシーポリシー</Link>
                </li>
              </ul>
            </div>
            <div className="g-sm__inner__socials">
              <Link
                className="g-sm__social instagram"
                to={SOCIAL_URLS.instagram_learn}
              >
                <FaInstagram />
                <div>Instagram | Language Learning</div>
              </Link>
              <Link to={SOCIAL_URLS.facebook} className="g-sm__social regular">
                <FaFacebook />
                <div>Facebook</div>
              </Link>
              <Link
                to={SOCIAL_URLS.instagram_news}
                className="g-sm__social instagram"
              >
                <FaInstagram />
                <div>Instagram | News</div>
              </Link>
              <Link to={SOCIAL_URLS.youtube} className="g-sm__social regular">
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

export { HamburgerMenu };
