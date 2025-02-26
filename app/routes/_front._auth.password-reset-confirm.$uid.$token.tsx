import { useActionData, useLoaderData } from "@remix-run/react";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import { resetConfirm } from "~/common/session.server";
import { MESSAGES } from "~/common/languageDictionary";
import type {
  TResetConfirmErrors,
  TResetConfirmOk,
  TResetConfirmActionResponse,
} from "~/common/types";
import { getTitle } from "~/common/utils";
import { FaArrowRightLong } from "react-icons/fa6";
import { SlidingHeaderPage } from "~/components/pages";

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

export const meta: MetaFunction = () => {
  return [
    {
      title: getTitle({
        title: "Password Reset Confirm・リセットの確認",
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
          non_field_errors: [MESSAGES["ja"].form.standard],
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
            non_field_errors: [MESSAGES["ja"].form.standard],
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
          non_field_errors: [MESSAGES["ja"].form.standard],
        },
      },
      { status: 400 }
    );
  }
}; //end action

export const loader = ({ params }: LoaderFunctionArgs) => {
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
      <SlidingHeaderPage
        mainTitle="Confirm Reset"
        subTitle="リセットの確認"
        swooshBackColor="cream"
        swooshFrontColor="beige"
      >
        <div className="au-wrapper">
          <div className="au-wrapper__inner">
            <form className="au-form g-form" noValidate method="post">
              {actionData && actionData?.errors?.non_field_errors ? (
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

              <input type="hidden" name="uid" value={uid} />

              <input type="hidden" name="token" value={token} />

              <div className="g-form__input-group">
                <label
                  htmlFor="new-password1-input"
                  className="g-form__text-label g-required"
                >
                  新しいパスワード
                </label>
                <input
                  type="password"
                  id="new-password1-input"
                  name="newPassword1"
                  defaultValue={actionData?.fields?.newPassword1}
                  aria-invalid={Boolean(
                    actionData?.errors?.new_password1?.length
                  )}
                  aria-errormessage={
                    actionData?.errors?.new_password1?.length
                      ? "new-password1-errors"
                      : undefined
                  }
                />
                {actionData?.errors?.new_password1?.length ? (
                  <ul
                    className="g-form__validation-errors"
                    role="alert"
                    id="new-password1-errors"
                  >
                    {actionData.errors.new_password1.map((error: string) => {
                      return <li key={error}>{error}</li>;
                    })}
                  </ul>
                ) : null}
              </div>

              <div className="g-form__input-group">
                <label
                  htmlFor="new-password2-input"
                  className="g-form__text-label g-required"
                >
                  新しいパスワードの確認
                </label>
                <input
                  type="password"
                  id="new-password2-input"
                  name="newPassword2"
                  defaultValue={actionData?.fields?.newPassword2}
                  aria-invalid={Boolean(
                    actionData?.errors?.new_password2?.length
                  )}
                  aria-errormessage={
                    actionData?.errors?.new_password2?.length
                      ? "new-password2-errors"
                      : undefined
                  }
                />
                {actionData?.errors?.new_password2?.length ? (
                  <ul
                    className="g-form__validation-errors"
                    role="alert"
                    id="new-password2-errors"
                  >
                    {actionData.errors.new_password2.map((error: string) => {
                      return <li key={error}>{error}</li>;
                    })}
                  </ul>
                ) : null}
              </div>

              <button className="au-form__submit " type="submit">
                送信する
                <FaArrowRightLong />
              </button>
              <div className="au-form__bottom-message">
                <p>
                  下記内容にご注意いただき、安全なパスワードの設定をお願いいたします。パスワード設定は、以下の条件を満たしていることが必要です。
                </p>
                <ul>
                  <li>15文字以上で作成してください。</li>
                  <li>大文字、小文字、数字、記号をご使用ください。</li>
                  <li>
                    他でご使用されているパスワードと同じものはお控えください。
                  </li>
                  <li>
                    苗字や名前、ご家族のお名前など、個人情報を含むものや、個人が特定されやすい簡易なパスワードはお控えください。
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </SlidingHeaderPage>
    </>
  );
}
