import { Link, useActionData } from "@remix-run/react";
import {
  type V2_MetaFunction,
  type ActionArgs,
  json,
  redirect,
} from "@remix-run/node";
import React from "react";

import { register } from "~/common/session.server";
import { MESSAGES } from "~/common/languageDictionary";
import { getTitle } from "~/common/utils";
import { SlidingHeaderPage } from "~/components/pages";
import type {
  TRegisterFail,
  TRegisterActionResponse,
  TRegisterOk,
} from "~/common/types";

/*
 * Helper functions
 */
function isRegisterOk(data: TRegisterFail | TRegisterOk): data is TRegisterOk {
  return data && "detail" in data;
}
export const meta: V2_MetaFunction = () => {
  return [
    { title: getTitle({ title: "Register・アカウント作成", isHome: false }) },
  ];
};

/*
 * Server Functions
 */
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = form.get("email");
  const password1 = form.get("password1");
  const password2 = form.get("password2");
  if (
    typeof email !== "string" ||
    typeof password1 !== "string" ||
    typeof password2 !== "string"
  ) {
    return json<TRegisterActionResponse>(
      {
        fields: null,
        data: null,
        errors: {
          non_field_errors: [MESSAGES["en"].form.standard400],
        },
      },
      { status: 400 }
    );
  }
  const fields = { email, password1, password2 };
  const response = await register({ email, password1, password2 });
  if (!response.success) {
    return json<TRegisterActionResponse>(
      {
        fields: fields,
        data: null,
        errors: response.data as TRegisterFail,
      },
      { status: 400 }
    );
  } else if (response.success && isRegisterOk(response.data)) {
    // redirect to success page
    return redirect("/register-success");
  } else {
    // unknown error so no register
    return json<TRegisterActionResponse>(
      {
        fields: null,
        data: null,
        errors: {
          non_field_errors: [MESSAGES["en"].form.standard400],
        },
      },
      { status: 400 }
    );
  }
}; //end action

/*
 * Client Functions
 */

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <SlidingHeaderPage
      mainTitle="Register"
      subTitle="アカウント作成"
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <div className="au-wrapper">
        <div className="au-wrapper__inner">
          <form noValidate className="au-form g-form" method="post">
            {actionData?.errors?.non_field_errors ? (
              <div className="g-form__nonfield-errors">
                <ul>
                  {actionData.errors.non_field_errors.map((error) => (
                    <li role="alert" key={error}>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="g-form__input-group">
              <label
                className="g-form__text-label g-required"
                htmlFor="email-input"
              >
                Eメールアドレス
              </label>
              <input
                type="email"
                id="email-input"
                name="email"
                defaultValue={actionData?.fields?.email}
                aria-invalid={Boolean(actionData?.errors?.email?.length)}
                aria-errormessage={
                  actionData?.errors?.email?.length ? "email-errors" : undefined
                }
              />
              {actionData?.errors?.email?.length ? (
                <ul
                  className="g-form__validation-errors"
                  role="alert"
                  id="email-errors"
                >
                  {actionData.errors.email.map((error: string) => {
                    return <li key={error}>{error}</li>;
                  })}
                </ul>
              ) : null}
            </div>

            <div className="g-form__input-group">
              <label className="g-form__text-label g-required">
                パスワード
              </label>
              <input
                type="password"
                id="password1-input"
                name="password1"
                defaultValue={actionData?.fields?.password1}
                aria-invalid={Boolean(actionData?.errors?.password1?.length)}
                aria-errormessage={
                  actionData?.errors?.password1?.length
                    ? "password1-errors"
                    : undefined
                }
              />
              {actionData?.errors?.password1?.length ? (
                <ul
                  className="g-form__validation-errors"
                  role="alert"
                  id="password1-errors"
                >
                  {actionData.errors.password1.map((error: string) => {
                    return <li key={error}>{error}</li>;
                  })}
                </ul>
              ) : null}
            </div>

            <div className="g-form__input-group">
              <label
                className="g-form__text-label g-required"
                htmlFor="password2-input"
              >
                パスワード再入力
              </label>
              <input
                type="password"
                id="password2-input"
                name="password2"
                defaultValue={actionData?.fields?.password2}
                aria-invalid={Boolean(actionData?.errors?.password2?.length)}
                aria-errormessage={
                  actionData?.errors?.password2?.length
                    ? "password2-errors"
                    : undefined
                }
              />
              {actionData?.errors?.password2?.length ? (
                <ul
                  className="g-form__validation-errors"
                  role="alert"
                  id="password2-errors"
                >
                  {actionData.errors.password2.map((error: string) => {
                    return <li key={error}>{error}</li>;
                  })}
                </ul>
              ) : null}
            </div>
            <div className="g-form__submit">
              <button type="submit">アカウント作成</button>
            </div>
            <div className="au-form__bottom-message">
              <p>
                <Link to="/login">ログインはこちら</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </SlidingHeaderPage>
  );
}
