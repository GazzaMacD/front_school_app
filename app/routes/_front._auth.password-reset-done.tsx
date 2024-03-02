import {
  type LoaderArgs,
  type V2_MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link } from "@remix-run/react";

import { getTitle } from "~/common/utils";
import { SlidingHeaderPage } from "~/components/pages";

/*
 * Helper functions
 */

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: getTitle({
        title: "Password Reset Done・パスワードリセット完了",
        isHome: false,
      }),
    },
  ];
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
      <SlidingHeaderPage
        mainTitle="Password Reset Done"
        subTitle="パスワードリセット完了"
        swooshBackColor="cream"
        swooshFrontColor="beige"
      >
        <div className="au-wrapper">
          <div className="au-wrapper__inner">
            <div className="au-form">
              <div className="au-form__message">
                <p>
                  パスワードが変更されましたのでお知らせいたします。
                  <Link to="/login">ログイン</Link>
                  が可能な状態となっております。
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlidingHeaderPage>
    </>
  );
}
