import { useFetcher } from "@remix-run/react";
import { useRef, useEffect, useState } from "react";

function EmailSubscription() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(
    function resetEmailSubsribeForm() {
      if (fetcher.state === "idle" && fetcher?.data?.success) {
        formRef.current?.reset();
        setShowThanks(true);
      }
    },
    [fetcher.state, fetcher.data]
  );

  if (showThanks) {
    return (
      <div className="c-es-wrapper">
        <h3>Thanks for subscribing</h3>
        <p>
          Thank you so much for taking an interest in our regular emails. We
          always aim to help you with these mails and hope that you will be
          satisfied with what we send you. If you are not satisfied, please
          don't hesitate to contact us with any suggestions on how we might
          improve our service to our language learning community. We'd love to
          hear from you. If you are truely unhappy, you can unsubsribe from our
          mailing list from the email at the bottom.
        </p>
        <p>Have a good day and thanks for reading our blog posts.</p>
      </div>
    );
  }

  return (
    <div className="c-es-wrapper">
      <h3>Subscribe to our regular Learning Email</h3>
      <p>
        We love to help our language learning community with their studies. We
        publish regular learning blogs posts and instagram posts as well as have
        regular language learning experiences. If you would like to join our
        mailing list to be updated regularly (about once every two weeks),
        please sign up below. You can unsubsribe anytime. Family name are First
        name are optional but we are friendly nice people who like to know our
        audience so if you would like, please let us know who you are.
      </p>
      <fetcher.Form
        method="post"
        noValidate
        action="/email-subscribe"
        ref={formRef}
      >
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
            disabled={
              fetcher.state === "loading" || fetcher.state === "submitting"
            }
            aria-invalid={Boolean(fetcher.data?.errors?.email?.length)}
            aria-errormessage={
              fetcher.data?.errors?.email?.length ? "email-errors" : undefined
            }
          />
          {fetcher.data?.errors?.email?.length ? (
            <ul
              className="g-form__validation-errors"
              role="alert"
              id="email-errors"
            >
              {fetcher.data.errors.email.map((error: string) => {
                return <li key={error}>{error}</li>;
              })}
            </ul>
          ) : null}
        </div>
        <div className="c-es-form__cols">
          <div className="g-form__input-group">
            <label className="g-form__text-label" htmlFor="family_name-input">
              姓
            </label>
            <input
              type="text"
              id="family_name-input"
              name="family_name"
              required
              disabled={
                fetcher.state === "loading" || fetcher.state === "submitting"
              }
              aria-invalid={Boolean(fetcher.data?.errors?.family_name?.length)}
              aria-errormessage={
                fetcher.data?.errors?.family_name?.length
                  ? "family_name-errors"
                  : undefined
              }
            />
            {fetcher.data?.family_name?.email?.length ? (
              <ul
                className="g-form__validation-errors"
                role="alert"
                id="family_name-errors"
              >
                {fetcher.data.errors.family_name.map((error: string) => {
                  return <li key={error}>{error}</li>;
                })}
              </ul>
            ) : null}
          </div>

          <div className="g-form__input-group">
            <label className="g-form__text-label" htmlFor="given_name-input">
              名
            </label>
            <input
              type="text"
              id="given_name-input"
              name="given_name"
              required
              disabled={
                fetcher.state === "loading" || fetcher.state === "submitting"
              }
              aria-invalid={Boolean(fetcher.data?.errors?.given_name?.length)}
              aria-errormessage={
                fetcher.data?.errors?.given_name?.length
                  ? "given_name-errors"
                  : undefined
              }
            />
            {fetcher.data?.given_name?.email?.length ? (
              <ul
                className="g-form__validation-errors"
                role="alert"
                id="given_name-errors"
              >
                {fetcher.data.errors.given_name.map((error: string) => {
                  return <li key={error}>{error}</li>;
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="g-form__submit">
          <button type="submit">Subscribe</button>
        </div>
      </fetcher.Form>
    </div>
  );
}

export { EmailSubscription };
