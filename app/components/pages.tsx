import * as React from "react";

import { type TSwooshColors, Swoosh1 } from "./swooshes";

type TSlidingHeaderPage = {
  mainTitle: string;
  subTitle: string;
  swooshBackColor: TSwooshColors;
  swooshFrontColor: TSwooshColors;
  children: React.ReactNode;
};

function SlidingHeaderPage({
  mainTitle,
  subTitle,
  swooshBackColor,
  swooshFrontColor,
  children,
}: TSlidingHeaderPage) {
  return (
    <div className="c-shp">
      <header className="c-shp__header">
        <h1 lang="en">
          {mainTitle} <span lang="ja">{subTitle}</span>
        </h1>
      </header>
      <main className="c-shp__main">{children}</main>
      <Swoosh1 backColor={swooshBackColor} swooshColor={swooshFrontColor} />
    </div>
  );
}

export { SlidingHeaderPage };
