import { Link } from "@remix-run/react";

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

export { Button, ButtonLink };
