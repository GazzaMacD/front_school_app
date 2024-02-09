import { Link, useActionData, useSearchParams } from "@remix-run/react";
import { type ActionArgs, type V2_MetaFunction, json } from "@remix-run/node";
import React from "react";

import {
  login,
  createUserSession,
  secureRedirect,
} from "~/common/session.server";
import { MESSAGES } from "~/common/languageDictionary";
import type {
  TLoginFail,
  TLoginActionResponse,
  TLoginOk,
} from "~/common/types";
import { getTitle } from "~/common/utils";
import { HeadingOne } from "~/components/headings";
import { FaArrowRightLong } from "react-icons/fa6";

/*
 * Helper functions
 */
function isLoginOk(data: TLoginFail | TLoginOk): data is TLoginOk {
  return data && "access" in data;
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getTitle({ title: "Login", isHome: false }) }];
};

/*
 * Server Functions
 */
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  let redirectTo = form.get("redirectTo");

  //validate redirect to prevent open redirect attacks
  redirectTo = secureRedirect(redirectTo);

  //basic type validations - most validation done on backend
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json<TLoginActionResponse>(
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

  const fields = { email, password };
  const response = await login({ email, password });

  if (!response.success) {
    return json<TLoginActionResponse>(
      {
        fields: fields,
        data: null,
        errors: response.data as TLoginFail,
      },
      { status: 400 }
    );
  } else if (response.success && isLoginOk(response.data)) {
    return createUserSession(response.data, redirectTo);
  } else {
    // unknown error so no login
    return json<TLoginActionResponse>(
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

export default function LoginRoute() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <>
      <HeadingOne
        jpText="ログイン"
        enText="Login"
        align="center"
        bkground="light"
        level="h1"
      />
      <form className="au-form g-form" noValidate method="post">
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
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
            required
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
          <label
            className="g-form__text-label g-required"
            htmlFor="password-input"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password-input"
            name="password"
            defaultValue={actionData?.fields?.password}
            aria-invalid={Boolean(actionData?.errors?.password?.length)}
            aria-errormessage={
              actionData?.errors?.password?.length
                ? "password-errors"
                : undefined
            }
          />
          {actionData?.errors?.password?.length ? (
            <ul
              className="g-form__validation-errors"
              role="alert"
              id="password-errors"
            >
              {actionData.errors.password.map((error: string) => {
                return <li key={error}>{error}</li>;
              })}
            </ul>
          ) : null}
        </div>
        <button className="au-form__submit " type="submit">
          ログイン
          <FaArrowRightLong />
        </button>
        <div className="au-form__bottom-message">
          <p>
            <Link to="/password-reset">パスワードを忘れた場合</Link>
          </p>
          <p>
            初めてのご利用ですか？
            <Link to="/register">新規登録はこちら</Link>
          </p>
        </div>
      </form>
    </>
  );
}
