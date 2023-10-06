import { Link } from "@remix-run/react";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
export default function ContactIndexPage() {
  return (
    <div className="frco-idx">
      <h3 className="frco-idx__heading">
        How would you like to contact us? Please click.
      </h3>
      <div className="frco-idx__links">
        <Link
          className="frco-idx__link frco-idx__link--tel"
          to="/contact/telephone#contact"
        >
          <AiOutlinePhone />
          Telephone
        </Link>
        <Link
          className="frco-idx__link frco-idx__link--form"
          to="/contact/form#contact"
        >
          <AiOutlineMail />
          Contact Form
        </Link>
      </div>
    </div>
  );
}
