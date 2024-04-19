import { Swoosh1 } from "~/components/swooshes";

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

function SwooshErrorPage({ title, text, linkUrl, linkText }: TErrorPageProps) {
  return (
    <>
      <main className="er-main--swoosh">
        <h1>{title}</h1>
        <p>{text}</p>
        {linkText && linkUrl ? (
          <p>
            <a href={linkUrl}>{linkText}</a>
          </p>
        ) : null}
      </main>
      <Swoosh1 swooshColor="beige" backColor="cream" />
    </>
  );
}
export { ErrorPage, SwooshErrorPage };
