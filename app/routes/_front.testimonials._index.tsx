import { type LinksFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGlobalEnv } from "~/common/utils";

import aboutStyles from "../styles/about.css";
import { BASE_API_URL } from "~/common/constants.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: aboutStyles },
];

export async function loader() {
  return null;
}

export default function TestimonialsIndexPage() {
  return (
    <div>
      <h1>Testimonials</h1>
    </div>
  );
}
