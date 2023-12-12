import * as React from "react";

export default function DesignSystem() {
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Design System</h1>
      <Section title={"Buttons"}>
        <FlexCol title="Primary" colNum={3}>
          <ExpoBox title="test button" colNum={2}>
            <button>I am a test</button>
          </ExpoBox>
          <ExpoBox title="test button" colNum={2}>
            <button>I am a test</button>
          </ExpoBox>
          <ExpoBox title="test button" colNum={2}>
            <button>I am a test</button>
          </ExpoBox>
        </FlexCol>
      </Section>
    </div>
  );
}

type TExpoBoxProps = {
  title: string;
  colNum: 1 | 2 | 3 | 4;
  children: React.ReactNode | React.ReactNode[];
};

function ExpoBox({ title, colNum, children }: TExpoBoxProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        width: `${
          colNum === 4
            ? "25%"
            : colNum === 3
            ? "33.33%"
            : colNum === 2
            ? "50%"
            : "100%"
        }`,
      }}
    >
      <h4>{title}</h4>
      {children}
    </div>
  );
}

type TSectionProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};

function Section({ title, children }: TSectionProps) {
  return (
    <section
      style={{
        borderBottom: "1px black solid",
        padding: "25px 0",
      }}
    >
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <div
        style={{
          display: "flex",
        }}
      >
        {children}
      </div>
    </section>
  );
}

type TFlexColProps = {
  title: string;
  colNum: 1 | 2 | 3 | 4;
  children: React.ReactNode | React.ReactNode[];
};

function FlexCol({ title, colNum, children }: TFlexColProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: `${
          colNum === 4
            ? "25%"
            : colNum === 3
            ? "33.33%"
            : colNum === 2
            ? "50%"
            : "100%"
        }`,
      }}
    >
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
