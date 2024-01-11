type THeadingOne = {
  jpText: string;
  enText: string;
  align: "left" | "center";
  bkground: "light" | "dark";
};

function HeadingOne({
  enText,
  jpText,
  align,
  bkground = "light",
}: THeadingOne) {
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
}

export { HeadingOne };
