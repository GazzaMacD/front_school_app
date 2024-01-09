type THeadingOne = {
  jpText: string;
  enText: string;
  align: "left" | "center";
};

function HeadingOne({ enText, jpText, align }: THeadingOne) {
  return (
    <>
      <h2 className={`g-heading1 ${align}`} lang="en">
        {enText}
        <span lang="ja" className={`g-heading1__jp ${align}`}>
          ― {jpText}
        </span>
      </h2>
    </>
  );
}

export { HeadingOne };
