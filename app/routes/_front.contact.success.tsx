import * as React from "react";
import { Link } from "@remix-run/react";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

import { HeadingOne } from "~/components/headings";
import { Swoosh1 } from "~/components/swooshes";

/*
 * Server Functions
 */
export function loader({ request }: LoaderFunctionArgs) {
  const referer = request.headers.get("referer");
  const pathname = referer ? new URL(referer).pathname : "";
  if (pathname === "/contact") {
    return null;
  }
  return redirect("/");
}

export default function ContactSuccessPage() {
  React.useEffect(() => {
    // To compensate for preventScrollReset in Form
    // Feels hacky
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="ct-success">
        <div className="g-narrow-container">
          <div className="ct-success__heading">
            <HeadingOne
              enText="Success"
              jpText="送信しました"
              align="center"
              bkground="light"
              level="h1"
            />
          </div>
          <div className="ct-success__details">
            <p>
              お問い合わせいただき誠にありがとうございます。こちらから改めてご連絡させていただきますのでお待ち下さいませ。
            </p>
            <p>
              もしよろしければ、
              <Link to="/blog-lessons">ブログレッスン一覧</Link>や、
              <Link to="/">エクスリンガルホームページ</Link>をご覧ください。
            </p>
          </div>
        </div>
      </div>
      <Swoosh1 backColor="cream" swooshColor="beige" />
    </>
  );
}
