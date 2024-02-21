import * as React from "react";
import { Form, useActionData, Link } from "@remix-run/react";
import {
  json,
  redirect,
  type ActionArgs,
  type V2_MetaFunction,
  type LoaderArgs,
} from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { FaCaretDown, FaArrowDown, FaArrowRightLong } from "react-icons/fa6";
import { FaMobileAlt } from "react-icons/fa";
import { HeadingOne } from "~/components/headings";
import { NumberedHorizontalCards } from "~/components/cards";
import { MESSAGES } from "~/common/languageDictionary";

/**
 *Types
 */
type TContactAPIResponse = {
  details?: "ok";
  email?: string[];
  contact_notes?: {
    note: string[];
  }[];
};
type TContactErrors = {
  non_field_errors?: string[];
  fullName?: string[];
  fullEnName?: string[];
  email?: string[];
  message?: string[];
};
type TContactActionResponse = {
  fields: {
    fullName: string;
    fullEnName: string;
    email: string;
    message: string;
  } | null;
  data: { details: "ok" } | null;
  errors: TContactErrors;
};

/**
 *  Utils and helper functions
 */
const contactMenu = [
  {
    id: 1,
    text: "無料体験レッスン",
    url: "#trial",
  },
  {
    id: 2,
    text: "ランゲージ・エクスペリエンス",
    url: "#experience",
  },
  {
    id: 3,
    text: "よくある質問",
    url: "#q&a",
  },
  {
    id: 4,
    text: "お電話でのお問い合わせ",
    url: "#telephone",
  },
  {
    id: 5,
    text: "お問い合わせフォーム",
    url: "#form",
  },
];

function validateRequired(value: unknown): string[] {
  if (!value) {
    return [MESSAGES["ja"].form.required];
  }
  return [];
}

/**
 * Server functions
 */

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();

  const fullName = form.get("fullName");
  const fullEnName = form.get("fullEnName");
  const email = form.get("email");
  const message = form.get("message");
  //basic type validations - most validation done on backend
  if (
    typeof fullName !== "string" ||
    typeof fullEnName !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return json<TContactActionResponse>(
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

  const errors: TContactErrors = {
    non_field_errors: [],
    fullName: validateRequired(fullName),
    fullEnName: validateRequired(fullEnName),
    email: validateRequired(email),
    message: validateRequired(message),
  };
  const fields = { fullName, fullEnName, email, message };
  if (!Object.values(errors).every((v) => !v.length)) {
    return json<TContactActionResponse>(
      {
        fields,
        data: null,
        errors,
      },
      { status: 400 }
    );
  }
  /* back end */
  try {
    const response = await fetch(`${BASE_API_URL}/contact/form/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        name_en: fullEnName,
        contact_emails: [{ email: email }],
        contact_notes: [{ note: message }],
      }),
    });
    const responseData: TContactAPIResponse = await response.json();
    if (!response.ok) {
      errors.email = responseData.email ? responseData.email : [];
      errors.message = responseData.contact_notes
        ? responseData.contact_notes[0].note
        : [];
      return json<TContactActionResponse>(
        {
          fields: fields,
          data: null,
          errors,
        },
        { status: 400 }
      );
    }
    console.log("Got here");
    return redirect("/contact/success");
  } catch (error) {
    // network error
    errors.non_field_errors = [MESSAGES["ja"].form.standard400];
    return json(
      {
        fields,
        data: null,
        errors,
      },
      { status: 400 }
    );
  } // catch
}; // action

export default function ContactIndexPage() {
  const actionData = useActionData<typeof action>();
  const maxMsgLength = 300;
  const [remaining, setRemaining] = React.useState(maxMsgLength);
  const [privacyRead, setPrivacyRead] = React.useState(false);
  const messageRef = React.useRef<null | HTMLTextAreaElement>(null);

  function messageChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const num = maxMsgLength - e.currentTarget.value.length;
    setRemaining(num);
  }

  React.useEffect(() => {
    if (messageRef.current) {
      const len = messageRef.current.value.length;
      setRemaining(maxMsgLength - len);
    }
  }, []);

  return (
    <Form
      preventScrollReset
      action="/contact?index"
      className="ct-form__form"
      noValidate
      method="post"
    >
      {actionData?.errors?.non_field_errors?.length ? (
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
          htmlFor="full-name-input"
        >
          お名前（日本語表記）
        </label>
        <input
          type="text"
          id="full-name-input"
          name="fullName"
          required
          placeholder="例: 山田太郎 | ex. Bob Jones"
          defaultValue={actionData?.fields?.fullName}
          aria-invalid={Boolean(actionData?.errors?.fullName?.length)}
          aria-errormessage={
            actionData?.errors?.fullName?.length
              ? "full-name-errors"
              : undefined
          }
        />
        {actionData?.errors?.fullName?.length ? (
          <ul
            className="g-form__validation-errors"
            role="alert"
            id="full-name-errors"
          >
            {actionData.errors.fullName.map((error: string) => {
              return <li key={error}>{error}</li>;
            })}
          </ul>
        ) : null}
      </div>

      <div className="g-form__input-group">
        <label
          className="g-form__text-label g-required"
          htmlFor="full-en-name-input"
        >
          お名前（英語表記）
        </label>
        <input
          type="text"
          id="full-en-name-input"
          name="fullEnName"
          required
          placeholder="例: Yamada Taro | ex. Bob Jones"
          defaultValue={actionData?.fields?.fullEnName}
          aria-invalid={Boolean(actionData?.errors?.fullEnName?.length)}
          aria-errormessage={
            actionData?.errors?.fullEnName?.length
              ? "full-en-name-errors"
              : undefined
          }
        />
        {actionData?.errors?.fullEnName?.length ? (
          <ul
            className="g-form__validation-errors"
            role="alert"
            id="full-en-name-errors"
          >
            {actionData.errors.fullEnName.map((error: string) => {
              return <li key={error}>{error}</li>;
            })}
          </ul>
        ) : null}
      </div>

      <div className="g-form__input-group">
        <label className="g-form__text-label g-required" htmlFor="email-input">
          Eメールアドレス
        </label>
        <input
          type="email"
          id="email-input"
          name="email"
          placeholder="例: y.t@abcdz.com | ex. j.b@abcdz.com"
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

      <div className="g-form__input-group ct-form__textarea">
        <label
          className="g-form__text-label g-required"
          htmlFor="message-input"
        >
          お問い合わせ内容
          <span
            className={`ct-form__textarea__remaining ${
              remaining > 0 ? "yes" : "no"
            }`}
          >
            {remaining}/300 文字
          </span>
        </label>
        <textarea
          id="message-input"
          maxLength={maxMsgLength}
          name="message"
          onChange={messageChangeHandler}
          ref={messageRef}
          defaultValue={actionData?.fields?.message}
          aria-invalid={Boolean(actionData?.errors?.message?.length)}
          aria-errormessage={
            actionData?.errors?.message?.length ? "message-errors" : undefined
          }
        ></textarea>
        {actionData?.errors?.message?.length ? (
          <ul
            className="g-form__validation-errors"
            role="alert"
            id="message-errors"
          >
            {actionData.errors.message.map((error: string) => {
              return <li key={error}>{error}</li>;
            })}
          </ul>
        ) : null}
      </div>

      <div className="ct-form__privacy">
        <div>
          <input
            type="checkbox"
            id="privacy-read"
            name="privacy-read"
            checked={privacyRead}
            autoComplete="off"
            onChange={() => setPrivacyRead((prev) => !prev)}
          />
          <label htmlFor="privacy-read">プライバシーポリシーに同意する</label>
        </div>
        <div>
          当社のプライバシーポリシーは
          <Link to="/privacy-policy">こちら</Link>
        </div>
      </div>
      <div className="ct-form__submit">
        <button disabled={!privacyRead} type="submit">
          ログイン
          <FaArrowRightLong />
        </button>
      </div>
    </Form>
  );
}
