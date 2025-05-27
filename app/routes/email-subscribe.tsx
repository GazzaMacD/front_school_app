import { type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

import { MC_URL, MC_API_KEY, MC_AUD_ALL_ID } from "~/common/constants.server";

/**
 * schema and types
 */
const ZSubscriber = z.object({
  email: z.string().email(),
  family_name: z.string(),
  given_name: z.string(),
});

type TSubscriber = z.infer<typeof ZSubscriber>;

type TMCError = {
  title: string;
  status: number;
  detail: string;
  instance: string;
};

type TSubscribeToAudience =
  | {
      success: false;
      status: number;
      data: TMCError;
    }
  | {
      success: true;
      status: number;
      data: null;
    };

async function subscribeToAudience(validatedData: TSubscriber): Promise<TSubscribeToAudience> {
  const url = `${MC_URL}/lists/${MC_AUD_ALL_ID}/members`;
  const data = {
    email_address: validatedData.email,
    status: "subscribed",
    merge_fields: {
      FNAME: validatedData.given_name,
      LNAME: validatedData.family_name,
    },
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // check for errors
    const responseData = await response.json();
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data: responseData as TMCError,
      };
    }
    //success
    return {
      success: true,
      status: response.status,
      data: null,
    };
  } catch (e) {
    return {
      success: false,
      status: 500,
      data: {
        title: "Unknown server error",
        status: 500,
        detail: "This failure is not currently known",
        instance: "",
      },
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const referer = request.headers.get("referer");
  const formData = Object.fromEntries(await request.formData());
  const validatedData = ZSubscriber.safeParse(formData);
  if (validatedData.success) {
    const result = await subscribeToAudience(validatedData.data);
  } else {
    console.log(validatedData.error.issues);
  }
  return null;
}

type TSubscribeActionResponse =  {
  success: true,
  status: 200,
  errors: null,
} | {
  success: false,
  status: 400,
  errors:
}

