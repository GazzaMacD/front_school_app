/*
 * Images
 */
type TImage = {
  src: string;
  width: number;
  height: number;
  alt: number;
};

export type THeaderImage = {
  id: number;
  title: string;
  original: TImage;
  medium: TImage;
  thumbnail: TImage;
  alt: string;
};

type TClientENV = {
  BASE_BACK_URL: string;
};

declare global {
  var GLOBAL_ENV: TClientENV;
  interface Window {
    GLOBAL_ENV: TClientENV;
  }
}
/*
 * Colors
 */
export type TBrandColors =
  | "white"
  | "cream"
  | "beige"
  | "brown"
  | "green"
  | "orange";
/*
 * Base Pages from Wagtail
 */

type TBasePageMeta = {
  type: string;
  detail_url: string;
  html_url: string;
  slug: string;
  first_published_at: string;
};

export type TListPageMetaAll = TBasePageMeta & {
  show_in_menus: boolean;
  seo_title: string;
  search_description: string;
  alias_of: string | null;
  locale: string;
};

type TParent = {
  id: number;
  meta: {
    type: string;
    detail_url: string;
    html_url: string;
  };
  title: string;
};

export type TBaseDetailPage = {
  id: number;
  meta: TBasePageMeta & {
    show_in_menus: boolean;
    seo_title: string;
    search_description: string;
    first_published_at: string;
    alias_of: string | null;
    parent: TParent | null;
  };
  title: string;
};

export type TListPageItemAllMeta = {
  id: number;
  meta: TListPageMetaAll;
  title: string;
};

export type TBaseListPage = {
  meta: {
    total_count: number;
  };
};

export type TWagListAllBase = {
  id: number;
  meta: TListPageMetaAll;
  title: string;
};

export type TWagBasicImage = {
  id: number;
  meta: {
    type: string;
    detail_url: string;
    download_url: string;
  };
  title: string;
};
/*
 * Form Base Functions
 */

/*
 * Auth and Session
 */
type TAuthErrorsBase = {
  non_field_errors?: string[];
};

export type TUser = {
  id: number;
  email: string;
  contact: {
    name: string;
  };
  is_staff: boolean;
  groups: { name: string }[];
};
export type TUserData = {
  access: string;
  refresh: string;
  user: TUser;
};
/* Register */
export type TRegister = {
  email: string;
  password1: string;
  password2: string;
};
export type TRegisterFail = TAuthErrorsBase & {
  email?: string[];
  password1?: string[];
  password2?: string[];
};
export type TRegisterOk = {
  detail: string;
};

export type TRegisterResponse = {
  success: boolean;
  status: number;
  data: TRegisterOk | TRegisterFail;
};
export type TRegisterActionResponse = {
  fields: TRegister | null;
  data: null;
  errors: TRegisterFail | null;
};

/* Login */

export type TLogin = {
  email: string;
  password: string;
};
export type TLoginFail = TAuthErrorsBase & {
  email?: string[];
  password?: string[];
};
export type TLoginOk = {
  access: string;
  refresh: string;
  user: TUser;
};
export type TLoginResponse = {
  success: boolean;
  status: number;
  data: TLoginOk | TLoginFail;
};
export type TLoginActionResponse = {
  fields: TLogin | null;
  data: null;
  errors: TLoginFail | null;
};

/* Verify Email */

export type TVerifyResponse = {
  success: boolean;
  status: number;
  data: { detail: string };
};

/* Reset Password */
export type TPasswordResetOk = {
  detail: string;
};

export type TPasswordResetErrors = TAuthErrorsBase & {
  email?: string[];
};

export type TPasswordResetResponse = {
  success: boolean;
  status: number;
  data: TPasswordResetOk | TPasswordResetErrors;
};

export type TPasswordResetActionResponse = {
  fields: { email: string } | null;
  errors: TPasswordResetErrors;
};
/* reset confirm */
export type TResetConfirm = {
  newPassword1: string;
  newPassword2: string;
  uid: number;
  token: string;
};
export type TResetConfirmErrors = TAuthErrorsBase & {
  new_password1?: string[];
  new_password2?: string[];
  uid?: string[];
  token?: string[];
};
export type TResetConfirmOk = {
  detail: string;
};

export type TResetConfirmResponse = {
  success: boolean;
  status: number;
  data: TResetConfirmOk | TResetConfirmErrors;
};

export type TResetConfirmActionResponse = {
  fields: TResetConfirm | null;
  errors: TResetConfirmErrors;
};

/* JWT */
export type TRefreshToken = {
  access: string;
  access_expiration: string;
};

export type TValidateTokens = {
  accessToken: string;
  refreshToken: string;
};
export type TValidateTokensResponse = {
  isValid: boolean;
  isNew: boolean;
  newToken: string | null;
};

/**
 * Stream Fields
 */
export type TStreamRichText = {
  type: "rich_text";
  value: string;
  id: string;
};

type TStreamImageValue = {
  image: {
    id: number;
    title: string;
    original: TImage;
    medium: TImage;
    thumbnail: TImage;
  };
  caption: string;
  author: string;
  attribution_url: string;
  license_type: string;
  license_url: string;
};

export type TStreamTextWidthImage = {
  type: "text_width_img";
  value: TStreamImageValue;
  id: string;
};

export type TStreamYoutube = {
  type: "youtube";
  value: {
    src: string;
    short: boolean;
    limit: boolean;
  };
  id: string;
};
