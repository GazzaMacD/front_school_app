import {
  type LoaderArgs,
  type V2_MetaFunction,
  redirect,
} from "@remix-run/node";

import { getTitle } from "~/common/utils";
import { SlidingHeaderPage } from "~/components/pages";

/*
 * Helper functions
 */

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: getTitle({
        title: "Check Reset Email・リセットメールを確認する",
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
      <SlidingHeaderPage
        mainTitle="Check Reset Mail"
        subTitle="リセットメールを確認する"
        swooshBackColor="cream"
        swooshFrontColor="beige"
      >
        <div className="au-wrapper">
          <div className="au-wrapper__inner">
            <div className="au-form">
              <div className="au-form__message">
                <p>
                  メールをご確認の上、指示に従ってパスワードの再設定を行ってください。メールが届いていない場合は、迷惑メールフォルダをご確認ください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlidingHeaderPage>
    </>
  );
}
