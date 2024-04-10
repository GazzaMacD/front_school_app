import { createCookieSessionStorage, redirect, json } from "@remix-run/node";
import {
  SESSION_NAME,
  SESSION_SECRET,
  BASE_API_URL,
  LOGIN_REDIRECT,
} from "./constants.server";
import type {
  TLogin,
  TLoginFail,
  TLoginOk,
  TLoginResponse,
  TRefreshToken,
  TRegister,
  TRegisterFail,
  TRegisterOk,
  TRegisterResponse,
  TUserData,
  TValidateTokens,
  TValidateTokensResponse,
  TVerifyResponse,
  TPasswordResetErrors,
  TPasswordResetOk,
  TPasswordResetResponse,
  TResetConfirm,
  TResetConfirmResponse,
  TResetConfirmErrors,
  TResetConfirmOk,
} from "./types";
import { MESSAGES } from "./languageDictionary";

/**
 * Auth utility functions
 */

export function secureRedirect(to: FormDataEntryValue | null): string {
  if (!to || typeof to !== "string") {
    return LOGIN_REDIRECT;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return LOGIN_REDIRECT;
  }

  return to;
}

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
 * Session
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
function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}
/*
 * Auth Functions
 */
/* reset confirm */
export async function resetConfirm({
  uid,
  token,
  newPassword1,
  newPassword2,
}: TResetConfirm): Promise<TResetConfirmResponse> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/auth/password/reset/confirm/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          token: token,
          new_password1: newPassword1,
          new_password2: newPassword2,
        }),
      }
    );
    const data: TResetConfirmErrors | TResetConfirmOk = await response.json();
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data: data as TResetConfirmErrors,
      };
    }
    return {
      success: true,
      status: response.status,
      data: data as TResetConfirmOk,
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

/* password reset */
export async function passwordReset({
  email,
}: {
  email: string;
}): Promise<TPasswordResetResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/password/reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data: TPasswordResetErrors | TPasswordResetOk = await response.json();
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data: data as TPasswordResetErrors,
      };
    }
    return {
      success: true,
      status: response.status,
      data: data as TPasswordResetOk,
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

/* verify email */
export async function verifyEmail({
  key,
}: {
  key: string;
}): Promise<TVerifyResponse> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/auth/registration/verify-email/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data,
      };
    }
    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      data: {
        detail: MESSAGES["en"].network.error,
      },
    };
  }
} //verifyEmail

export async function logout(request: Request, redirectPath = "/") {
  const session = await getUserSession(request);
  // NEED TO CALL LOGOUT IN BACKEND HERE
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
} //logout

export async function register({
  email,
  password1,
  password2,
}: TRegister): Promise<TRegisterResponse> {
  try {
    const apiUrl = `${BASE_API_URL}/auth/registration/`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password1,
        password2,
      }),
    });
    const data: TRegisterOk | TRegisterFail = await response.json();
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

/**
 * User and Access functions
 */
export function createAuthenticatedHeaders(userData: TUserData) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Authorization", `Bearer ${userData.access}`);
  return headers;
}
export async function authenticatedUser(
  request: Request
): Promise<TUserData | null> {
  const session = await getUserSession(request);
  const sessionData: TUserData | undefined = session.get(SESSION_NAME);
  const redirectPath = new URL(request.url).pathname;
  if (!sessionData) return null;

  //validate session data
  const validatedResponse = await validateTokens({
    accessToken: sessionData.access,
    refreshToken: sessionData.refresh,
  });

  if (!validatedResponse.isValid) {
    // Throw redirect and destroy session as invalid data in session
    throw redirect(redirectPath, {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  } else if (validatedResponse.isValid && !validatedResponse.isNew) {
    // No changes required to session, all good here so return sessionData
    return sessionData;
  } else if (
    validatedResponse.isValid &&
    validatedResponse.isNew &&
    validatedResponse.newToken
  ) {
    // THe access token has been renewed so session needs to be updated
    // and the cookie set again
    sessionData.access = validatedResponse.newToken;
    session.set(SESSION_NAME, sessionData);
    throw redirect(redirectPath, {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  } else {
    return null;
  }
} // authenticatedUser

/**
 * Token Validation functions
 */
async function verifyAccessToken(accessToken: string): Promise<boolean> {
  const verifyUrl = `${BASE_API_URL}/auth/token/verify/`;
  try {
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: accessToken,
      }),
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
} //validateToken

async function getRefreshToken(refreshToken: string): Promise<string | null> {
  const refreshUrl = `${BASE_API_URL}/auth/token/refresh/`;
  try {
    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });
    if (!res.ok) {
      //if not 200 return null
      return null;
    }
    const resData: TRefreshToken = await res.json();
    return resData.access;
  } catch (error) {
    // 500 errors or other unknown
    console.error(error);
    return null;
  }
} //getRefreshToken

async function validateTokens({
  accessToken,
  refreshToken,
}: TValidateTokens): Promise<TValidateTokensResponse> {
  const isVerified = await verifyAccessToken(accessToken);
  if (isVerified) {
    return {
      isValid: true,
      isNew: false,
      newToken: null,
    };
  }
  // notVerified so try to get new token using refresh token
  const newToken = await getRefreshToken(refreshToken);
  if (!newToken) {
    // calling function must destroy session with logout
    return {
      isValid: false,
      isNew: false,
      newToken: null,
    };
  }
  //has new Token, calling function must set new session
  return {
    isValid: true,
    isNew: true,
    newToken,
  };
}
