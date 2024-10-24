import {
  Form,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>XLingual</h1>
        <p>Update XLingual app to remix 2.13</p>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
