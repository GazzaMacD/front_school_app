import * as React from "react";
import type { LinksFunction } from "@remix-run/node";

import designStyles from "~/styles/design-system.css";
import { Button, ButtonLink } from "~/components/buttons";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: designStyles },
];

export default function DesignSystem() {
  return (
    <div className="ds">
      <h1 className="ds-h1">Design System</h1>
      <section className="container">
        <h2>Buttons</h2>
        <div className="ds-display">
          <article>
            <Button>Primary Large</Button>
          </article>
          <article>
            <Button size="medium">Primary Medium</Button>
          </article>
          <article>
            <Button size="small">Primary Small</Button>
          </article>
          <article>
            <Button variant="secondary">Secondary Large</Button>
          </article>
          <article>
            <Button variant="secondary" size="medium">
              Secondary Medium
            </Button>
          </article>
          <article>
            <Button variant="secondary" size="small">
              Secondary Small
            </Button>
          </article>
          <article>
            <ButtonLink to="https://duckduckgo.com">
              P ButtonLink Large
            </ButtonLink>
          </article>
          <article>
            <ButtonLink to="https://duckduckgo.com" size="medium">
              P ButtonLink Medium
            </ButtonLink>
          </article>
          <article>
            <ButtonLink to="https://duckduckgo.com" size="small">
              P ButtonLink Small
            </ButtonLink>
          </article>
          <article>
            <ButtonLink to="https://duckduckgo.com" variant="secondary">
              S ButtonLink Large
            </ButtonLink>
          </article>
          <article>
            <ButtonLink
              to="https://duckduckgo.com"
              variant="secondary"
              size="medium"
            >
              S ButtonLink Medium
            </ButtonLink>
          </article>
          <article>
            <ButtonLink to="/" variant="secondary" size="small">
              S ButtonLink Small
            </ButtonLink>
          </article>
        </div>
      </section>
      <section>
        <h2>Colors</h2>
        <div className="ds-half-wrapper">
          <div className="ds-brown ds-half">
            <h2 className="green">This is an h2 in green</h2>
            <p className="green">This is a very short paragraph in green</p>
            <ButtonLink to="https://duckduckgo.com">
              P ButtonLink Large
            </ButtonLink>
            <h2 className="orange">This is an h2 in orange</h2>
            <p className="orange">This is a very short paragraph in orange </p>
            <ButtonLink to="https://duckduckgo.com" variant="secondary">
              S ButtonLink Large
            </ButtonLink>
          </div>
          <div className="ds-cream ds-half">
            <h2 className="green">This is an h2 in green</h2>
            <p className="green">This is a very short paragraph in green</p>
            <ButtonLink to="https://duckduckgo.com">
              P ButtonLink Large
            </ButtonLink>
            <h2 className="orange">This is an h2 in orange</h2>
            <p className="orange">This is a very short paragraph in orange </p>
            <ButtonLink to="https://duckduckgo.com" variant="secondary">
              S ButtonLink Large
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
