import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, Form, useActionData, Link } from "@remix-run/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { BASE_API_URL } from "~/common/constants.server";
import { MESSAGES } from "~/common/languageDictionary";

import {
  authenticatedUser,
  createAuthenticatedHeaders,
} from "~/common/session.server";

/**
 * Types
 **/
import { type TUser } from "~/common/types";

type TFieldData = {
  name: string;
  name_en: string;
};
/**
 * Helper functions
 **/

export const handle = {
  breadcrumb: (m) => <Link to="/my-page/profile">プロフィール</Link>,
};
/**
 *  Actions and Loaders
 **/

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const name = form.get("name");
  const nameEn = form.get("name_en");
  const bday = form.get("bday");

  if (
    typeof name !== "string" ||
    typeof nameEn !== "string" ||
    typeof bday !== "string"
  ) {
    return json({
      fields: null,
      data: null,
      errors: {
        non_field_errors: [MESSAGES["ja"].form.standard],
      },
    });
  }
  // Check auth
  const userData = await authenticatedUser(request);
  if (!userData) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  const apiUrl = `${BASE_API_URL}/users/${userData.user.id}/profile/`;
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: createAuthenticatedHeaders(userData),
      body: JSON.stringify({
        name: name,
        name_en: nameEn,
        bday: bday,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return json(
        {
          fields: null,
          data: null,
          errors: {
            non_field_errors: [MESSAGES["ja"].form.standard],
          },
        },
        { status: 400 }
      );
    }
    //success
    return json(
      {
        fields: data,
        data: null,
        errors: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return json(
      {
        fields: null,
        data: null,
        errors: {
          non_field_errors: [MESSAGES["ja"].form.standard],
        },
      },
      { status: 400 }
    );
  } //catch
}; // END action

export async function loader({ request }: LoaderFunctionArgs) {
  const userData = await authenticatedUser(request);

  //if null get path and redirect to login route with redirect parameter
  if (!userData) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  const apiUrl = `${BASE_API_URL}/users/${userData.user.id}/profile/`;
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: createAuthenticatedHeaders(userData),
  });
  const loaderData = await response.json();
  return json({ loaderData });
}

export default function ProfileRoute() {
  const { loaderData } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="mp-p-main__content">
      <header className="mp-pr-header">
        <h2>My Profile</h2>
      </header>
      <section className="mp-pr-main">
        <div className="mp-pr-form">
          <Form method="PUT">
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
              <label className="g-form__text-label" htmlFor="name-input">
                氏名 <span className="g-form__help-text">(例：山田太郎)</span>
              </label>
              <input
                type="text"
                id="name-input"
                name="name"
                defaultValue={
                  actionData?.fields?.name
                    ? actionData.fields.name
                    : loaderData.name
                }
                aria-invalid={Boolean(actionData?.errors?.name?.length)}
                aria-errormessage={
                  actionData?.errors?.name?.length ? "name-errors" : undefined
                }
              />
              {actionData?.errors?.name?.length ? (
                <ul
                  className="g-form__validation-errors"
                  role="alert"
                  id="name-errors"
                >
                  {actionData.errors.name.map((error: string) => {
                    return <li key={error}>{error}</li>;
                  })}
                </ul>
              ) : null}
            </div>

            <div className="g-form__input-group">
              <label className="g-form__text-label" htmlFor="name-en-input">
                英語での氏名{" "}
                <span className="g-form__help-text">(例：Yamada Taro)</span>
              </label>
              <input
                type="text"
                id="name-en-input"
                name="name_en"
                defaultValue={
                  actionData?.fields?.name_en
                    ? actionData.fields.name_en
                    : loaderData.name_en
                }
                aria-invalid={Boolean(actionData?.errors?.name_en?.length)}
                aria-errormessage={
                  actionData?.errors?.name_en?.length
                    ? "name-en-errors"
                    : undefined
                }
              />
              {actionData?.errors?.name_en?.length ? (
                <ul
                  className="g-form__validation-errors"
                  role="alert"
                  id="name-en-errors"
                >
                  {actionData.errors.name_en.map((error: string) => {
                    return <li key={error}>{error}</li>;
                  })}
                </ul>
              ) : null}
            </div>

            <div className="g-form__input-group">
              <label className="g-form__text-label" htmlFor="bday-input">
                英語での誕生日
                <span className="g-form__help-text">(例：11 May)</span>
              </label>
              <input
                type="text"
                id="bday-input"
                name="bday"
                maxLength={13}
                defaultValue={
                  actionData?.fields?.bday
                    ? actionData.fields.bday
                    : loaderData.bday
                }
                aria-invalid={Boolean(actionData?.errors?.bday?.length)}
                aria-errormessage={
                  actionData?.errors?.bday?.length ? "bday-errors" : undefined
                }
              />
              {actionData?.errors?.bday?.length ? (
                <ul
                  className="g-form__validation-errors"
                  role="alert"
                  id="bday-errors"
                >
                  {actionData.errors.name.map((error: string) => {
                    return <li key={error}>{error}</li>;
                  })}
                </ul>
              ) : null}
            </div>

            <div className="g-form__submit">
              <button type="submit">
                更新
                <FaArrowRightLong />
              </button>
            </div>
          </Form>
        </div>
      </section>
    </div>
  );
}
