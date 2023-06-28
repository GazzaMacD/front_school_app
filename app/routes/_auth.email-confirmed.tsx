import { type LoaderArgs, json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  console.log(request.headers);
  return json({});
};

export default function EmailConfirmedRoute() {
  return (
    <>
      <h1 className="auth__heading">Email Confirmed</h1>
      <p>
        Thanks for confirming your email. Please <Link to="/login">login</Link>{" "}
        or start browsing our site from the <Link to="/">home page</Link>.
      </p>
    </>
  );
}
