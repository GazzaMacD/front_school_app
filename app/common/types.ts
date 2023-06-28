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
  email: string;
  full_name: string;
  is_staff: boolean;
  groups: string[];
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
