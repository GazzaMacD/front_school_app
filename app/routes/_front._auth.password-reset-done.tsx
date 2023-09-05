import {
  type LoaderArgs,
  type V2_MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link } from "@remix-run/react";

import { getTitle } from "~/common/utils";

/*
 * Helper functions
 */

export const meta: V2_MetaFunction = () => {
  return [{ title: getTitle({ title: "Password Reset Done", isHome: false }) }];
};

/*
 * Server Functions
 */
export function loader({ request }: LoaderArgs) {
  const referer = request.headers.get("referer");
  if (
    !referer ||
    !new URL(referer).pathname.includes("password-reset-confirm")
  ) {
    return redirect("/");
  }
  return null;
}

/*
 * Client Functions
 */

export default function PasswordResetCheckEmailRoute() {
  return (
    <>
      <h1 className="auth__heading">Password Reset Done</h1>
      <div className="auth__top-message">
        <p>
          Your password has been changed so you are able to{" "}
          <Link to="/login">login</Link>.
        </p>
      </div>
    </>
  );
}
