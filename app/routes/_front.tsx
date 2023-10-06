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
        <div className="container footer__top">
          <div className="footer__branding-col">
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
          </div>
          <div className="footer__col">
            <h3>Learning</h3>
            <Link to="/courses">Our courses</Link>
            <Link to="/learning-experiences">Our experiences</Link>
            <Link to="/lessons">Free lessons</Link>
            <h3>Company</h3>
            <Link to="/about">About Us</Link>
            <Link to="/schools">Our Schools</Link>
            <Link to="/news">News</Link>
          </div>
          <div className="footer__col">
            <h3>Contact Us</h3>
            <Link to="/contact/form#contact">Contact Form</Link>
            <Link to="/contact/telephone#contact">Phone</Link>
            <Link to="mailto:contact@xlingual.co.jp">Email</Link>
            <h3>Other</h3>
            <Link to="/prices">Class Prices</Link>
            <Link to="/privacy-policy">Privacy policy</Link>
          </div>
        </div>
        <div className="container footer__bottom">
          <p>
            © Copyright 2023 株式会社XLingual | All Rights Reserved | Website by
            digital4.green
          </p>
        </div>
      </footer>
    </>
  );
}
