import { brandColors } from "~/common/brandColors";

type TErrorPageProps = {
  title: string;
  text: string;
  linkUrl?: string;
  linkText?: string;
};

function ErrorPage({ title, text, linkUrl, linkText }: TErrorPageProps) {
  return (
    <main className="er-main">
      <h1>{title}</h1>
      <p>{text}</p>
      {linkText && linkUrl ? (
        <p>
          <a href={linkUrl}>{linkText}</a>
        </p>
      ) : null}
    </main>
  );
}

export { ErrorPage };
