import { createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { SESSION_NAME, SESSION_SECRET, BASE_API_URL } from "./constants";
import type {
  TLogin,
  TLoginFail,
  TLoginOk,
  TLoginResponse,
  TUser,
} from "./types";
import { MESSAGES } from "./languageDictionary";

/*
 * Storage
 */

const storage = createCookieSessionStorage({
  cookie: {
    name: SESSION_NAME,
    secure: true,
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, //30 days
    httpOnly: true,
  },
});

/*
 * Sesson
 */

export async function createUserSession(
  userData: TLoginOk,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set(SESSION_NAME, userData);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

/*
 * Auth Functions
 */
export async function login({
  email,
  password,
}: TLogin): Promise<TLoginResponse> {
  try {
    const apiUrl = `${BASE_API_URL}/auth/login/`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data: TLoginOk | TLoginFail = await response.json();
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data: data,
      };
    }
    return {
      success: true,
      status: response.status,
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      data: {
        non_field_errors: [MESSAGES["en"].network.error],
      },
    };
  }
}
