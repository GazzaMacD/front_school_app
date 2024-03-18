import { json, redirect, type V2_MetaFunction } from "@remix-run/node";
import React from "react";
import { useLoaderData, useActionData } from "@remix-run/react";

import { verifyEmail } from "~/common/session.server";
import { getTitle } from "~/common/utils";
//types
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { TVerifyResponse } from "~/common/types";
import { SlidingHeaderPage } from "~/components/pages";
import { FaArrowRightLong } from "react-icons/fa6";
/*
 * Helper functions
 */

export const meta: V2_MetaFunction = () => {
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
export const action = async ({ request }: ActionArgs) => {
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

export const loader = async ({ params }: LoaderArgs) => {
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
          Thanks very much for signing up with us. Please click the button below
          to confirm your account.
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
              There seems to be a problem with confirming your email. Please
              contact us on the contact form.
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
