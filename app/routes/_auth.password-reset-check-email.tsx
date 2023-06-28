import {
  type LoaderArgs,
  type V2_MetaFunction,
  redirect,
} from "@remix-run/node";

import { getTitle } from "~/common/utils";

/*
 * Helper functions
 */

export const meta: V2_MetaFunction = () => {
  return [
    { title: getTitle({ title: "Password Reset Check Email", isHome: false }) },
  ];
};

/*
 * Server Functions
 */
export function loader({ request }: LoaderArgs) {
  const referer = request.headers.get("referer");
  if (!referer || new URL(referer).pathname !== "/password-reset/") {
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
      <h1 className="auth__heading">Password Reset</h1>
      <div className="auth__top-message">
        <p>
          Please check your email and follow the instructions to reset your
          password. Please check your junk mail folder if you didn't recieve the
          mail.
        </p>
      </div>
    </>
  );
}
