import {
  type LoaderArgs,
  type V2_MetaFunction,
  redirect,
} from "@remix-run/node";

import { getTitle } from "~/common/utils";
import { HeadingOne } from "~/components/headings";

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
  if (!referer || new URL(referer).pathname !== "/password-reset") {
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
      <HeadingOne
        jpText="リセットメールを確認する"
        enText="Check Reset Mail"
        align="center"
        bkground="light"
        level="h1"
      />
      <div className="au-form">
        <div className="au-form__message">
          <p>
            メールをご確認の上、指示に従ってパスワードの再設定を行ってください。メールが届いていない場合は、迷惑メールフォルダをご確認ください。
          </p>
        </div>
      </div>
    </>
  );
}
