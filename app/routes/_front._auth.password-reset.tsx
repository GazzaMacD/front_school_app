import { useActionData } from "@remix-run/react";
import {
  type ActionArgs,
  type V2_MetaFunction,
  json,
  redirect,
} from "@remix-run/node";

import { passwordReset } from "~/common/session.server";
import { MESSAGES } from "~/common/languageDictionary";
import type {
  TPasswordResetErrors,
  TPasswordResetOk,
  TPasswordResetActionResponse,
} from "~/common/types";
import { getTitle } from "~/common/utils";

/*
 * Helper functions
 */
function isPasswordResetOk(
  data: TPasswordResetErrors | TPasswordResetOk
): data is TPasswordResetOk {
  return data && "detail" in data;
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getTitle({ title: "Password Reset", isHome: false }) }];
};

/*
 * Server Functions
 */
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = form.get("email");

  if (typeof email !== "string") {
    return json<TPasswordResetActionResponse>(
      {
        fields: null,
        errors: {
          non_field_errors: [MESSAGES["en"].form.standard400],
        },
      },
      { status: 400 }
    );
  }

  const fields = { email };
  const response = await passwordReset({ email });

  if (!response.success) {
    return json<TPasswordResetActionResponse>(
      {
        fields: fields,
        errors: response.data as TPasswordResetErrors,
      },
      { status: 400 }
    );
  } else if (response.success && isPasswordResetOk(response.data)) {
    return redirect("/password-reset-check-email");
  } else {
    // unknown error so no login
    return json<TPasswordResetActionResponse>(
      {
        fields: fields,
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

export default function PasswordResetRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <h1 className="auth__heading">Password Reset</h1>
      <form noValidate method="post">
        {actionData && actionData?.errors?.non_field_errors ? (
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

        <button className="button submit " type="submit">
          submit
        </button>
      </form>
    </>
  );
}
