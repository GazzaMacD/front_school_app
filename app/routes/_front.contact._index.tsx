import * as React from "react";
import { useLoaderData, Form, useActionData, Link } from "@remix-run/react";
import {
  json,
  redirect,
  type ActionArgs,
  type V2_MetaFunction,
} from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";
import { FaCaretDown, FaArrowDown, FaArrowRightLong } from "react-icons/fa6";
import { FaMobileAlt } from "react-icons/fa";
import { HeadingOne } from "~/components/headings";
import { NumberedHorizontalCards } from "~/components/cards";
import { SlidingHeaderPage } from "~/components/pages";
import { MESSAGES } from "~/common/languageDictionary";
import { getTitle } from "~/common/utils";

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

export const meta: V2_MetaFunction = () => {
  return [
    { title: getTitle({ title: "Contact | お問い合わせ", isHome: false }) },
  ];
};

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

export async function loader() {
  try {
    const apiUrl = `${BASE_API_URL}/pages/?slug=contact&type=contacts.ContactPage&fields=*`;
    const response = await fetch(apiUrl);
    const contactPageData = await response.json();
    if (!response.ok || !contactPageData.items.length) {
      throw new Response("Sorry, that is a 404", { status: 404 });
    }
    const page = contactPageData.items[0];
    return json({ page });
  } catch (error) {
    throw new Response("Oh sorry, that is a 500", { status: 500 });
  }
} // loader

/**
 * Page
 */
export default function ContactIndexPage() {
  const ENV = getGlobalEnv();
  const { page } = useLoaderData<typeof loader>();
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
    <SlidingHeaderPage
      mainTitle={page.title}
      subTitle={page.display_title}
      swooshBackColor="cream"
      swooshFrontColor="beige"
    >
      <div className="ct-nav">
        {contactMenu.map((item) => {
          return <PageNav key={item.id} text={item.text} url={item.url} />;
        })}
      </div>

      <section id="trial">
        <div className="ct-texp">
          <div className="g-narrow-container">
            <div className="ct-texp__heading">
              <HeadingOne
                enText={page.trial_en_title}
                jpText={page.trial_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>
            <div
              className="ct-texp__intro"
              dangerouslySetInnerHTML={{ __html: page.trial_intro }}
            />
            <div className="ct-texp__steps">
              {page.trial_steps.map((step, i, arr) => {
                const len = arr.length;
                return (
                  <div key={step.id}>
                    <NumberedHorizontalCards
                      number={`0${i + 1}`}
                      jaTitle={step.value.title}
                      text={step.value.text}
                      src={
                        step.value.image
                          ? `${ENV.BASE_BACK_URL}${step.value.image.thumbnail.src}`
                          : null
                      }
                      alt={
                        step.value.image ? step.value.image.medium.alt : null
                      }
                    />
                    {i + 1 < len ? (
                      <div className="ct-texp__step__caret">
                        <FaCaretDown />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="ct-texp">
          <div className="g-narrow-container">
            <div className="ct-texp__heading">
              <HeadingOne
                enText={page.exp_en_title}
                jpText={page.exp_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>
            <div
              className="ct-texp__intro"
              dangerouslySetInnerHTML={{ __html: page.trial_intro }}
            />
            <div className="ct-texp__steps">
              {page.trial_steps.map((step, i, arr) => {
                const len = arr.length;
                return (
                  <div key={step.id}>
                    <NumberedHorizontalCards
                      number={`0${i + 1}`}
                      jaTitle={step.value.title}
                      text={step.value.text}
                      src={
                        step.value.image
                          ? `${ENV.BASE_BACK_URL}${step.value.image.thumbnail.src}`
                          : null
                      }
                      alt={
                        step.value.image ? step.value.image.medium.alt : null
                      }
                    />
                    {i + 1 < len ? (
                      <div className="ct-texp__step__caret">
                        <FaCaretDown />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="q&a">
        <div className="ct-qas">
          <div className="g-narrow-container">
            <div className="ct-qa__heading">
              <HeadingOne
                enText={page.qa_en_title}
                jpText={page.qa_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>

            <div className="ct-qa__qas">
              {page.qas.map((block) => {
                return (
                  <div className="ct-qas__qa" key={block.id}>
                    <p>{block.value.question}</p>
                    <p>{block.value.answer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="telephone">
        <div className="ct-tel">
          <div className="g-narrow-container">
            <div className="ct-tel__heading">
              <HeadingOne
                enText={page.tel_en_title}
                jpText={page.tel_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>

            <div className="ct-tel__details">
              <Link className="ct-tel__link" to={`tel:${page.tel_number}`}>
                <FaMobileAlt />
                {page.tel_display_number}
              </Link>
              <div className="ct-tel__times">
                <div>
                  <span>営業時間</span>
                </div>
                <div>
                  <span>火/木/金</span>
                  <span>13:00-17:00</span>
                </div>
                <div>
                  <span>水</span>
                  <span>09:00-17:00</span>
                </div>
                <div>
                  <span>土</span>
                  <span>09:00-17:00</span>
                </div>
                <div>
                  <span>日/月/祝</span>
                  <span>休業</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="form">
        <div className="ct-form">
          <div className="g-narrow-container">
            <div className="ct-form__heading">
              <HeadingOne
                enText={page.form_en_title}
                jpText={page.form_jp_title}
                align="center"
                bkground="light"
                level="h2"
              />
            </div>
            <div className="ct-form__wrapper">
              <div className="ct-form__msg">
                <Link to="#trial">体験レッスンの流れ</Link>や
                <Link to="#experience">ラーニング・エクスペリエンスの流れ</Link>
                についてもっと知りたいですか？お問い合わせは火曜日〜土曜日に受け付けています。お問い合わせにはできるだけ早く対応させていただきます。
              </div>

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
                    aria-invalid={Boolean(
                      actionData?.errors?.fullEnName?.length
                    )}
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
                    placeholder="例: y.t@abcdz.com | ex. j.b@abcdz.com"
                    required
                    defaultValue={actionData?.fields?.email}
                    aria-invalid={Boolean(actionData?.errors?.email?.length)}
                    aria-errormessage={
                      actionData?.errors?.email?.length
                        ? "email-errors"
                        : undefined
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
                      actionData?.errors?.message?.length
                        ? "message-errors"
                        : undefined
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
                    <label htmlFor="privacy-read">
                      プライバシーポリシーに同意する
                    </label>
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
            </div>
          </div>
        </div>
      </section>
    </SlidingHeaderPage>
  );
}

/*
 * Components
 */

type TPageNavProps = {
  text: string;
  url: string;
};

function PageNav({ text, url }: TPageNavProps) {
  return (
    <Link className="ct-nav__link " to={url}>
      <div className="ct-nav__btn">
        <div className="ct-nav__icon">
          <FaArrowDown />
        </div>
        <div className="ct-nav__text">{text}</div>
      </div>
    </Link>
  );
}
