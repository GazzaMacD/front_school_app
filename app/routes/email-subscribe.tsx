import { type ActionFunctionArgs, json } from "@remix-run/node";
import { z, type ZodIssue } from "zod";

import { MC_URL, MC_API_KEY, MC_AUD_ALL_ID } from "~/common/constants.server";

/**
 * schema and types
 */
const ZSubscriber = z.object({
  email: z.string().min(1, "Eメールが必要です").email("Eメールが無効です"),
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

type TSubscribeActionSuccess = {
  success: true;
  status: 200;
  errors: null;
};

type TSubscribeActionFail = {
  success: false;
  status: 400;
  errors: TSubscriberErrors;
};

type TSubscriberFieldNames = "email" | "family_name" | "given_name";
type TSubscriberErrorKeys =
  | "non_field_errors"
  | "email"
  | "family_name"
  | "given_name";
type TSubscriberErrors = Partial<Record<TSubscriberErrorKeys, string[]>>;

type TZIssues = {
  code: string;
  message: string;
  path: TSubscriberFieldNames[];
}[];

/**
 * helpers
 */

function zIssuesToError(issues: ZodIssue[]): TSubscriberErrors {
  const errors: TSubscriberErrors = {};
  issues.forEach((issue) => {
    if (issue.path.length) {
      const field = issue.path[0];
      if (Object.hasOwn(errors, field)) {
        errors[field].push(issue.message);
      } else {
        errors[field] = [issue.message];
      }
    }
  });
  return errors;
}

function mcErrorsToError(mcErrors: TSubscribeToAudience): TSubscriberErrors {
  switch (mcErrors.data?.title) {
    case "Member Exists":
      return { email: ["このメールはすでに登録されています"] };
    default:
      return { email: ["このメールは登録できません。お問い合わせください"] };
  }
}

async function subscribeToAudience(
  validatedData: TSubscriber
): Promise<TSubscribeToAudience> {
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

/**
 *  action and loader
 */

export async function action({ request }: ActionFunctionArgs) {
  const referer = request.headers.get("referer");
  console.log(referer);

  const formData = Object.fromEntries(await request.formData());
  const validatedData = ZSubscriber.safeParse(formData);

  if (validatedData.success) {
    const result = await subscribeToAudience(validatedData.data);
    if (result.success) {
      //successful submission
      return json<TSubscribeActionSuccess>({
        success: true,
        status: 200,
        errors: null,
      });
    } else {
      // Errors with submission to API
      return json<TSubscribeActionFail>(
        {
          success: false,
          status: 400,
          errors: mcErrorsToError(result),
        },
        { status: 400 }
      );
    }
  } else if (validatedData.error.issues.length) {
    return json<TSubscribeActionFail>(
      {
        success: false,
        status: 400,
        errors: zIssuesToError(validatedData.error.issues),
      },
      { status: 400 }
    );
  } else {
    return json<TSubscribeActionFail>(
      {
        success: false,
        status: 400,
        errors: {
          non_field_errors: ["エラーが発生しました"],
        },
      },
      { status: 400 }
    );
  }
}
