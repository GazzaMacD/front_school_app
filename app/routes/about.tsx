import type { LinksFunction } from "@remix-run/node";
import aboutStyles from "../styles/about.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: aboutStyles },
];

export default function About() {
  return (
    <div>
      <h1 className="heading">About Page</h1>
    </div>
  );
}
