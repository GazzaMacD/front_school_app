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
