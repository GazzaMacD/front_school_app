import * as React from "react";
import { Link } from "@remix-run/react";
import { redirect, type LoaderArgs } from "@remix-run/node";

import { HeadingOne } from "~/components/headings";
import { Swoosh1 } from "~/components/swooshes";

/*
 * Server Functions
 */
export function loader({ request }: LoaderArgs) {
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
              Thanks so much for contacting us, we will be in touch with you
              soon.
            </p>
            <p>
              If you have some time, why don't you read one of our{" "}
              <Link to="/blog-lessons">free blog lessons</Link>. Alternatively,
              please go to our <Link to="/">home page.</Link>
            </p>
          </div>
        </div>
      </div>
      <Swoosh1 backColor="cream" swooshColor="beige" />
    </>
  );
}
