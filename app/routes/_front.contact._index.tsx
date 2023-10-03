import { Link } from "@remix-run/react";
export default function ContactIndexPage() {
  return (
    <div>
      <Link to="/contact/telephone">Telephone</Link>
      <Link to="/contact/form">Contact Form</Link>
    </div>
  );
}
