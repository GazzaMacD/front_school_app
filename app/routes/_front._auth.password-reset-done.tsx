import {
  type LoaderArgs,
  type V2_MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link } from "@remix-run/react";

import { getTitle } from "~/common/utils";
import { HeadingOne } from "~/components/headings";

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

export default function PasswordResetDoneRoute() {
  return (
    <>
      <HeadingOne
        jpText="パスワードリセット完了"
        enText="Password Reset Done"
        align="center"
        bkground="light"
        level="h1"
      />
      <div className="au-form">
        <div className="au-form__message">
          <p>
            パスワードが変更されましたのでお知らせいたします。
            <Link to="/login">ログイン</Link>が可能な状態となっております。
          </p>
        </div>
      </div>
    </>
  );
}
