import { Link } from "@remix-run/react";
import { AiOutlineSmile } from "react-icons/ai";
import { redirect, type LoaderArgs } from "@remix-run/node";

/*
 * Server Functions
 */
export function loader({ request }: LoaderArgs) {
  const referer = request.headers.get("referer");
  if (!referer || new URL(referer).pathname !== "/contact") {
    return redirect("/");
  }
  return null;
}

export default function ContactTelephonePage() {
  return (
    <div>
      <h3>
        <AiOutlineSmile /> Success, thank you!
      </h3>
      <p>
        Thanks so much for contacting us, we will be in touch with you soon.
      </p>
      <p>
        If you have some time, why don't you read one of our{" "}
        <Link to="/lessons">free lessons</Link>.
      </p>
    </div>
  );
}
