import type { V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import homeStyles from "../styles/home.css";

// server side functions
export const meta: V2_MetaFunction = () => {
  return [{ title: "英会話・語学学校 エクスリンガル" }];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles },
];

export const loader = async () => {
  // fetch page data from django wagtail backend here
  return json({
    text: "my text",
  });
};

// --------------------------------//
// client side functions
export default function Index() {
  const { text } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="heading">Welcome to the new Xlingual App</h1>
      <p>{text}</p>
      <button className="button">Button</button>
      <a href="https://google.com">google</a>
    </div>
  );
}
