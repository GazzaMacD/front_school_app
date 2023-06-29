import { useActionData, useLoaderData } from "@remix-run/react";
import {
  type ActionArgs,
  type V2_MetaFunction,
  json,
  redirect,
} from "@remix-run/node";

import { resetConfirm } from "~/common/session.server";
import { MESSAGES } from "~/common/languageDictionary";
import type {
  TResetConfirmErrors,
  TResetConfirmOk,
  TResetConfirmActionResponse,
} from "~/common/types";
import { getTitle } from "~/common/utils";

/*
 * Helper functions
 */
function isResetConfirmOk(
  data: TResetConfirmErrors | TResetConfirmOk
): data is TResetConfirmOk {
  return data && "detail" in data;
}

function isResetConfirmErrors(
  data: TResetConfirmErrors | TResetConfirmOk
): data is TResetConfirmErrors {
  return (
    data &&
    ("uid" in data ||
      "token" in data ||
      "new_password1" in data ||
      "new_password2" in data)
  );
}

export const meta: V2_MetaFunction = () => {
  return [
    { title: getTitle({ title: "Password Reset Confirm", isHome: false }) },
  ];
};

/*
 * Server Functions
 */
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const uid = Number(form.get("uid"));
  const token = form.get("token");
  const newPassword1 = form.get("newPassword1");
  const newPassword2 = form.get("newPassword2");

  if (
    typeof uid !== "number" ||
    uid < 1 ||
    typeof token !== "string" ||
    typeof newPassword1 !== "string" ||
    typeof newPassword2 !== "string"
  ) {
    return json<TResetConfirmActionResponse>(
      {
        fields: null,
        errors: {
          non_field_errors: [MESSAGES["en"].form.standard400],
        },
      },
      { status: 400 }
    );
  }

  const fields = {
    uid,
    token,
    newPassword1,
    newPassword2,
  };
  const response = await resetConfirm({
    uid,
    token,
    newPassword1,
    newPassword2,
  });

  if (!response.success && isResetConfirmErrors(response.data)) {
    if (response.data?.token || response.data?.uid) {
      return json<TResetConfirmActionResponse>(
        {
          fields: fields,
          errors: {
            non_field_errors: [
              "There was a probelm processing this request. Please try and submit another email reset request.",
            ],
          },
        },
        { status: 400 }
      );
    }
    return json<TResetConfirmActionResponse>(
      {
        fields: fields,
        errors: response.data as TResetConfirmErrors,
      },
      { status: 400 }
    );
  } else if (response.success && isResetConfirmOk(response.data)) {
    return redirect("/password-reset-done");
  } else {
    // unknown error so no
    return json<TResetConfirmActionResponse>(
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

export const loader = async ({ params }: LoaderArgs) => {
  const { uid, token } = params;
  return json({ uid, token });
};

/*
 * Client Functions
 */

export default function ResetConfirmRoute() {
  const actionData = useActionData<typeof action>();
  const { uid, token } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="auth__heading">Confirm Reset</h1>
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

        <input type="hidden" name="uid" value={uid} />

        <input type="hidden" name="token" value={token} />

        <div className="input-group">
          <label htmlFor="new-password1-input">New Password</label>
          <input
            type="password"
            id="new-password1-input"
            name="newPassword1"
            defaultValue={actionData?.fields?.newPassword1}
            aria-invalid={Boolean(actionData?.errors?.new_password1?.length)}
            aria-errormessage={
              actionData?.errors?.new_password1?.length
                ? "new-password1-errors"
                : undefined
            }
          />
          {actionData?.errors?.new_password1?.length ? (
            <ul
              className="form-validation-errors"
              role="alert"
              id="new-password1-errors"
            >
              {actionData.errors.new_password1.map((error: string) => {
                return <li key={error}>{error}</li>;
              })}
            </ul>
          ) : null}
        </div>

        <div className="input-group">
          <label htmlFor="new-password2-input">Repeat New Password</label>
          <input
            type="password"
            id="new-password2-input"
            name="newPassword2"
            defaultValue={actionData?.fields?.newPassword2}
            aria-invalid={Boolean(actionData?.errors?.new_password2?.length)}
            aria-errormessage={
              actionData?.errors?.new_password2?.length
                ? "new-password2-errors"
                : undefined
            }
          />
          {actionData?.errors?.new_password2?.length ? (
            <ul
              className="form-validation-errors"
              role="alert"
              id="new-password2-errors"
            >
              {actionData.errors.new_password2.map((error: string) => {
                return <li key={error}>{error}</li>;
              })}
            </ul>
          ) : null}
        </div>

        <button className="button submit " type="submit">
          reset password
        </button>
      </form>
    </>
  );
}
