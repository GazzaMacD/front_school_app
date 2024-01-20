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

export { Button, ButtonLink, RoundButtonLink };
