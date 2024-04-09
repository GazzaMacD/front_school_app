import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { getTitle } from "~/common/utils";
import { SlidingHeaderPage } from "~/components/pages";

/*
 * Helper functions
 */
export const meta: MetaFunction = () => {
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
                  Eメールアドレスをご確認いただきありがとうございます。
                  <Link to="/login">ログイン</Link>または
                  <Link to="/">スクールホームページ</Link>をご利用くださいませ。
                </p>
              </div>
            </div>
          </div>
        </div>
      </SlidingHeaderPage>
    </>
  );
}
