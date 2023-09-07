import { Outlet } from "@remix-run/react";
import { Link } from "@remix-run/react";

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
          </div>
          <div className="footer__col">
            <h3>Learning</h3>
            <Link to="/courses">Our courses</Link>
            <Link to="/learning-experiences">Our experiences</Link>
            <Link to="/lessons">Free lessons</Link>
            <h3>Company</h3>
            <Link to="/about">About Us</Link>
            <Link to="/schools">Our Schools</Link>
          </div>
          <div className="footer__col">
            <h3>Contact Us</h3>
            <Link to="/contact">Contact Form</Link>
            <Link to="/contact">Phone</Link>
            <Link to="/contact">Email</Link>
            <h3>Other</h3>
            <Link to="/prices">Prices</Link>
            <Link to="/privacy-policy">Privacy policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
