type THeadingOne = {
  jpText: string;
  enText: string;
  align: "left" | "center";
  bkground: "light" | "dark";
  level: "h1" | "h2";
};

function HeadingOne({
  enText,
  jpText,
  align,
  bkground = "light",
  level = "h2",
}: THeadingOne) {
  if (level === "h2") {
    return (
      <>
        <h2 className={`g-heading1 ${align} ${bkground}`} lang="en">
          {enText}
          <span lang="ja" className={`g-heading1__jp`}>
            ― {jpText}
          </span>
        </h2>
      </>
    );
  } else {
    return (
      <>
        <h1 className={`g-heading1 ${align} ${bkground} h1`} lang="en">
          {enText}
          <span lang="ja" className={`g-heading1__jp`}>
            ― {jpText}
          </span>
        </h1>
      </>
    );
  }
}

export { HeadingOne };
