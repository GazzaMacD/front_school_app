import { createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { SESSION_NAME, SESSION_SECRET, BASE_API_URL } from "./constants";
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
  TUser,
  TValidateTokens,
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
function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}
/*
 * Auth Functions
 */
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

async function validateTokens({ accessToken, refreshToken }: TValidateTokens) {
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
    isNew: false,
    newToken,
  };
}
