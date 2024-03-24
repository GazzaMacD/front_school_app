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
        title: "Check Confirmation Email・アカウント作成メールを確認する",
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
  if (!referer || new URL(referer).pathname !== "/register") {
    return redirect("/");
  }
  return null;
}

/*
 * Client Functions
 */
export default function RegisterSuccessPage() {
  return (
    <>
      <SlidingHeaderPage
        mainTitle="Register Email Check"
        subTitle="アカウント作成メールを確認する"
        swooshBackColor="cream"
        swooshFrontColor="beige"
      >
        <div className="au-wrapper">
          <div className="au-wrapper__inner">
            <div className="au-form">
              <div className="au-form__message">
                <p>
                  アカウントを作成いただき誠にありがとうございます。Eメールをご確認後、記載されている手順でアカウントをご確認ください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlidingHeaderPage>
    </>
  );
}
