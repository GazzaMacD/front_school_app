import { Link } from "@remix-run/react";
import { FaArrowRightLong } from "react-icons/fa6";

type TButtonProps = {
  to: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  children: React.ReactNode | React.ReactNode[];
};

function Button({
  children,
  variant = "primary",
  size = "large",
  ...buttonProps
}: Pick<TButtonProps, "variant" | "size" | "children"> &
  JSX.IntrinsicElements["button"]) {
  return (
    <button className={`g-button ${size} ${variant}`} {...buttonProps}>
      {children}
    </button>
  );
}

/**
 * A Link that looks like a button
 */

function ButtonLink({
  to,
  variant = "primary",
  size = "large",
  children,
}: TButtonProps & JSX.IntrinsicElements["link"]) {
  return (
    <Link to={to} className={`g-button ${size} ${variant}`}>
      {children}
    </Link>
  );
}
type TRoundButtonProps = {
  to: string;
  color: "orange" | "green";
  jp: string;
  en: string;
};
function RoundButtonLink({ to, color, jp, en }: TRoundButtonProps) {
  return (
    <Link to={to} className={`g-round-button ${color}`}>
      <div>
        <div className="g-round-button__en">{en}</div>
        <div className="g-round-button__jp">{jp}</div>
        <FaArrowRightLong />
      </div>
    </Link>
  );
}

/* Large bilingual button  link*/

type TLgBiButtonLinkProps = {
  to: string;
  color: "orange" | "green";
  jp: string;
  en: string;
};

function LgBiButtonLink({ to, color, jp, en }: TLgBiButtonLinkProps) {
  return (
    <Link to={to} className={`g-lgbi-button-link`}>
      <div className={`g-lgbi-button ${color}`}>
        <div className="g-lgbi-button__inner">
          <div className="g-lgbi-button__en">{en}</div>
          <div className="g-lgbi-button__jp">{jp}</div>
        </div>
        <FaArrowRightLong />
      </div>
    </Link>
  );
}
/* Pill Button Links */

type TPillButtonLinkProps = {
  to: string;
  color: "brown" | "orange" | "green";
  children: React.ReactNode;
  reloadDoc?: boolean;
};

function SolidPillButtonLink({
  to,
  color,
  children,
  reloadDoc = false,
}: TPillButtonLinkProps) {
  return (
    <Link to={to} reloadDocument={reloadDoc} className="g-sp-button-link">
      <div className={`g-sp-button ${color}`}>{children}</div>
    </Link>
  );
}

function BorderedPillButtonLink({ to, color, children }: TPillButtonLinkProps) {
  return (
    <Link to={to} className="g-bp-button-link">
      <div className={`g-bp-button ${color}`}>{children}</div>
    </Link>
  );
}

export {
  Button,
  ButtonLink,
  RoundButtonLink,
  LgBiButtonLink,
  SolidPillButtonLink,
};
