import type { LinksFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import React from "react";
import { type ActionArgs, type V2_MetaFunction, json } from "@remix-run/node";

import contactStyles from "~/styles/contact.css";
import { BASE_API_URL } from "~/common/constants.server";
import { MESSAGES } from "~/common/languageDictionary";

/* Types */
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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contactStyles },
];

function validateRequired(value: unknown): string[] {
  if (!value) {
    return [`This field is required`];
  }
  return [];
}

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
    return json<TContactActionResponse>(
      {
        fields: null,
        data: { details: "ok" },
        errors,
      },
      { status: 200 }
    );
  } catch (error) {
    // network error
    errors.non_field_errors = [MESSAGES["en"].form.standard400];
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

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const maxMsgLength = 300;
  const [remaining, setRemaining] = React.useState(maxMsgLength);
  const messageRef = React.useRef<null | HTMLTextAreaElement>(null);

  function messageChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let num = maxMsgLength - e.currentTarget.value.length;
    setRemaining(num);
  }

  React.useEffect(() => {
    if (messageRef.current) {
      const len = messageRef.current.value.length;
      setRemaining(maxMsgLength - len);
    }
  }, []);

  return (
    <div>
      <header className="container">
        <h1 className="heading cf__title">Contact Page</h1>
      </header>
      <section className="container">
        <div>
          <Accordion
            ariaControls="trial-lesson-process"
            controllerElement={(isExpanded) => (
              <h2 className="cp__accordian-heading">
                <button>
                  Our trial lesson process
                  <span>{isExpanded ? "▲" : "▼"}</span>
                </button>
              </h2>
            )}
          >
            <div className="cp__accordian-content">
              <p>Item 1</p>
              <p>Item 2</p>
              <p>Item 3</p>
            </div>
          </Accordion>
        </div>
      </section>
      <section className="container">
        <div>
          <Accordion
            ariaControls="experience-process"
            controllerElement={(isExpanded) => (
              <h2 className="cp__accordian-heading">
                <button>
                  How to join our experiences{" "}
                  <span>{isExpanded ? "▲" : "▼"}</span>
                </button>
              </h2>
            )}
          >
            <div className="cp__accordian-content">
              <p>Item 1</p>
              <p>Item 2</p>
              <p>Item 3</p>
            </div>
          </Accordion>
        </div>
      </section>
      <section className="container">
        <Accordion
          ariaControls="experience-process"
          controllerElement={(isExpanded) => (
            <h2 className="cp__accordian-heading">
              <button>
                Common questions
                <span>{isExpanded ? "▲" : "▼"}</span>
              </button>
            </h2>
          )}
        >
          <div className="cp__accordian-content">
            <p>Item 1</p>
            <p>Item 2</p>
            <p>Item 3</p>
          </div>
        </Accordion>
      </section>
      <section className="container">
        <div className="cf-wrapper">
          <h2 className="cf-heading">Contact us</h2>
          <form className="cf" noValidate method="POST">
            <div className="cf__half">
              <div className="input-group">
                <label className="required" htmlFor="full-name-input">
                  full name
                </label>
                <input
                  type="text"
                  id="full-name-input"
                  name="fullName"
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
                    className="form-validation-errors"
                    role="alert"
                    id="full-name-errors"
                  >
                    {actionData.errors.fullName.map((error: string) => {
                      return <li key={error}>{error}</li>;
                    })}
                  </ul>
                ) : null}
              </div>
              <div className="input-group">
                <label className="required" htmlFor="full-en-name-input">
                  full english name
                </label>
                <input
                  type="text"
                  id="full-en-name-input"
                  name="fullEnName"
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
                    className="form-validation-errors"
                    role="alert"
                    id="full-en-name-errors"
                  >
                    {actionData.errors.fullEnName.map((error: string) => {
                      return <li key={error}>{error}</li>;
                    })}
                  </ul>
                ) : null}
              </div>
              <div className="input-group">
                <label className="required" htmlFor="email-input">
                  email
                </label>
                <input
                  type="email"
                  id="email-input"
                  name="email"
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
            </div>
            <div className="input-group">
              <label className="required" htmlFor="message-input">
                message{" "}
                <span
                  className={`${
                    remaining > 0 ? "cf__remaining" : "cf__remaining--zero"
                  }`}
                >
                  {remaining}
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
                  className="form-validation-errors"
                  role="alert"
                  id="message-errors"
                >
                  {actionData.errors.message.map((error: string) => {
                    return <li key={error}>{error}</li>;
                  })}
                </ul>
              ) : null}
            </div>
            <button className="button submit " type="submit">
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

type TAccordianProps = {
  controllerElement: React.FunctionComponent;
  ariaControls: string;
  children: React.ReactNode;
};

const Accordion = ({
  controllerElement,
  ariaControls,
  children,
}: TAccordianProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <div
        aria-expanded={isExpanded}
        aria-controls={ariaControls}
        onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
      >
        {controllerElement(isExpanded)}
      </div>
      {
        <div
          className={`${isExpanded ? "accordian__open" : "accordian__closed"}`}
          id={ariaControls}
        >
          {children}
        </div>
      }
    </>
  );
};
