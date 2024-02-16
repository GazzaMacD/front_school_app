import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";

import { BASE_API_URL } from "~/common/constants.server";
import { getGlobalEnv } from "~/common/utils";

export async function loader() {
  try {
    const apiUrl = `${BASE_API_URL}/pages/?slug=contact&type=contacts.ContactPage&fields=*`;
    const response = await fetch(apiUrl);
    const contactPageData = await response.json();
    if (!response.ok || !contactPageData.items.length) {
      throw new Response("Sorry, that is a 404", { status: 404 });
    }
    const page = contactPageData.items[0];
    return json({ page });
  } catch (error) {
    throw new Response("Oh sorry, that is a 500", { status: 500 });
  }
} // loader

export default function ContactIndexPage() {
  const ENV = getGlobalEnv();
  const { page } = useLoaderData<typeof loader>();
  return (
    <div>
      <div>Work here</div>
    </div>
  );
}
