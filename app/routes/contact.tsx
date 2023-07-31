import type { LinksFunction } from "@remix-run/node";

import contactStyles from "../styles/contact.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contactStyles },
];

export default function Contact() {
  return (
    <div>
      <header className="container">
        <h1 className="heading">Contact Page</h1>
      </header>
      <section className="container">
        <h2>Our trial lesson process</h2>
      </section>
      <section className="container">
        <h2>Process to join one a learning experience</h2>
      </section>
      <section className="container">
        <h2>Common questions</h2>
      </section>
      <section className="container">
        <div className="contact-wrapper">
          <h2>Contact us</h2>
          <form action="">Form here</form>
        </div>
      </section>
    </div>
  );
}
