import { useActionData, useSearchParams } from "@remix-run/react";
import { type ActionArgs, json } from "@remix-run/node";
import React from "react";

import { login } from "~/common/session.server";
import { MESSAGES } from "~/common/languageDictionary";
import type { TLoginFail, TLoginActionResponse } from "~/common/types";

/*
 * Server Functions
 */
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirect") || "/";
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
  }
  //success so create a session here and redirect
  // or go to /dashboard
  return json<TLoginActionResponse>(
    {
      fields: null,
      data: null,
      errors: null,
    },
    { status: 400 }
  );
}; //end action

/*
 * Client Functions
 */

export default function LoginRoute() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const [tempError, setTempError] = React.useState(false);

  return (
    <>
      <h1 className="auth__heading">Login</h1>
      <form noValidate method="post">
        {actionData?.errors?.non_field_errors ? (
          <div className="form-nonfield-errors">
            <ul>
              {actionData.errors.non_field_errors.map((error) => (
                <li role="alert" key={error}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="input-group">
          <label htmlFor="email-input">email</label>
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
              className="form-validation-errors"
              role="alert"
              id="email-errors"
            >
              {actionData.errors.email.map((error: string) => {
                return <li key={error}>{error}</li>;
              })}
            </ul>
          ) : null}
        </div>
        <div className="input-group">
          <label htmlFor="password-input">password</label>
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
              className="form-validation-errors"
              role="alert"
              id="password-errors"
            >
              {actionData.errors.password.map((error: string) => {
                return <li key={error}>{error}</li>;
              })}
            </ul>
          ) : null}
        </div>
        <button className="button submit " type="submit">
          sign in
        </button>
      </form>
    </>
  );
}
