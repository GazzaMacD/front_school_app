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
        <h3>ご登録いただき、誠にありがとうございます。</h3>

        <p>
          エクスリンガルの学習メールにご関心をお寄せくださり、誠にありがとうございます。私たちは、メール読者の皆様の学習をサポートし、ご満足いただけるよう取り組んでおりますが、何かご意見などございましたら、ぜひお気軽にお問い合わせくださいませ。万一、ご満足いただけない場合には、メールの配信解除はいつでも可能となっております。メール下部の「unsubscribe」のリンクから配信解除を行っていただけます。
        </p>

        <p>
          当校ウェブサイトをご覧いただき、誠にありがとうございます。
          素晴らしい一日をお過ごしください。{" "}
        </p>
      </div>
    );
  }

  return (
    <div className="c-es-wrapper">
      <h3>エクスリンガル学習メールをぜひご利用ください</h3>
      <p>
        私たちは、語学学習をする多くの方を全力でサポートしたいと考えています。このメールでは講師ブログや当校インスタグラムの最新記事、語学イベント「ラーニング・エクスペリエンス」のご案内などをお届けしています。メールは約2週間に1度の配信です。購読は無料となっておりますので、ぜひメールを登録して、あなたの学習に役立つ情報をお受け取りください。配信解除はいつでも可能です。メールアドレスのみでもご登録いただけますが、もし差し支えなければ、お名前のご入力もよろしくお願いいたします。
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
