import { json, redirect } from "@remix-run/node";
import React from "react";
import { Link, useLoaderData, useActionData } from "@remix-run/react";

import { verifyEmail } from "~/common/session.server";
//types
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { TVerifyResponse } from "~/common/types";
/*
import stylesUrl from "~/styles/login.css";
*/
/*
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];
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

export default function ConfirmEmailRoute() {
  const { key } = useLoaderData();
  const actionData = useActionData<TVerifyResponse>();

  let ui = (
    <>
      <p>
        Thanks very much for signing up with us. Please click the button below
        to confirm your account.
      </p>
      <form method="post" noValidate>
        <div>
          <input type="hidden" id="key-input" name="key" defaultValue={key} />
        </div>
        <button type="submit" className="button submit">
          Confirm
        </button>
      </form>
    </>
  );

  if (actionData && !actionData.success) {
    ui = (
      <ul className="form-nonfield-errors">
        <li role="alert">
          Oops we are sorry! There seems to be an error with your confirmation.
          Please try again.
        </li>
      </ul>
    );
  }
  return (
    <>
      <h1 className="auth__heading">Confirm Email</h1>
      {ui}
    </>
  );
}
