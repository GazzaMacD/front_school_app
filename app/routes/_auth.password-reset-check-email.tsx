import { useActionData } from "@remix-run/react";
import {
  type LoaderArgs,
  type V2_MetaFunction,
  json,
  redirect,
} from "@remix-run/node";

import { passwordReset } from "~/common/session.server";
import { MESSAGES } from "~/common/languageDictionary";
import type {
  TPasswordResetErrors,
  TPasswordResetOk,
  TPasswordResetActionResponse,
} from "~/common/types";
import { getTitle } from "~/common/utils";

/*
 * Helper functions
 */
function isPasswordResetOk(
  data: TPasswordResetErrors | TPasswordResetOk
): data is TPasswordResetOk {
  return data && "detail" in data;
}

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
