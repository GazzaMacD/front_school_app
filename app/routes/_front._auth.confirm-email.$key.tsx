import { json, redirect, type MetaFunction } from "@remix-run/node";
import React from "react";
import { useLoaderData, useActionData } from "@remix-run/react";

import { verifyEmail } from "~/common/session.server";
import { getTitle } from "~/common/utils";
//types
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { TVerifyResponse } from "~/common/types";
import { SlidingHeaderPage } from "~/components/pages";
import { FaArrowRightLong } from "react-icons/fa6";
/*
 * Helper functions
 */

export const meta: MetaFunction = () => {
  return [
    {
      title: getTitle({
        title: "Confirm Email・Eメールを確認する",
        isHome: false,
      }),
    },
  ];
};

/*
 * Server Functions
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const key = form.get("key");

  if (!key || typeof key !== "string") {
    return json(
      {
        data: null,
        errors: [{ detail: "key error" }],
      },
      { status: 400 }
    );
  }
  const response = await verifyEmail({ key });
  if (!response.success) {
    return json(
      {
        data: null,
        errors: [response.data],
      },
      { status: response.status }
    );
  }
  return redirect("/email-confirmed");
}; // action

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { key } = params;
  return json({ key });
};

/*
 * Client Functions
 */
export default function ConfirmEmailPage() {
  const { key } = useLoaderData();
  const actionData = useActionData<TVerifyResponse>();

  let ui = (
    <form className="au-form g-form" noValidate method="post">
      <div className="au-form__top-message">
        <p>
          ご登録いただき誠にありがとうございます。下記のボタンをクリックしてあなたのアカウントをご確認ください。
        </p>
      </div>
      <div>
        <input type="hidden" id="key-input" name="key" defaultValue={key} />
      </div>
      <div className="g-form__submit">
        <button type="submit">
          Eメールを確認する
          <FaArrowRightLong />
        </button>
      </div>
    </form>
  );

  if (actionData && !actionData.success) {
    ui = (
      <form className="au-form g-form" noValidate method="post">
        <div className="g-form__nonfield-errors">
          <ul>
            <li role="alert">
              メールの確認において問題があるようです。大変お手数ですが、お問い合わせフォームからご連絡ください。
            </li>
          </ul>
        </div>
        <div>
          <input type="hidden" id="key-input" name="key" defaultValue={key} />
        </div>
        <div className="g-form__submit">
          <button type="submit" disabled={true}>
            Eメールを確認する
            <FaArrowRightLong />
          </button>
        </div>
      </form>
    );
  }
  return (
    <SlidingHeaderPage
      mainTitle="Confirm Email"
      subTitle="Eメールを確認する"
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <div className="au-wrapper">
        <div className="au-wrapper__inner">{ui}</div>
      </div>
    </SlidingHeaderPage>
  );
}
