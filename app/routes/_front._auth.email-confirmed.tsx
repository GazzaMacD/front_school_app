import { type V2_MetaFunction } from "@remix-run/node";
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
        title: "Email Confirmed・メールを確認しました",
        isHome: false,
      }),
    },
  ];
};

/*
 * Client Functions
 */
export default function EmailConfirmedSuccessPage() {
  return (
    <>
      <SlidingHeaderPage
        mainTitle="Email Confirmed"
        subTitle="メールを確認しました"
        swooshBackColor="cream"
        swooshFrontColor="beige"
      >
        <div className="au-wrapper">
          <div className="au-wrapper__inner">
            <div className="au-form">
              <div className="au-form__message">
                <p>
                  Thanks for confirming your email. Please{" "}
                  <Link to="/login">login</Link> or start browsing our site from
                  the <Link to="/">home page</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlidingHeaderPage>
    </>
  );
}
