import { Outlet } from "@remix-run/react";

export default function FrontParentRoute() {
  return (
    <>
      <Outlet />
      <footer className="bfooter">
        <h2>Footer here</h2>
        <p>Some stuff</p>
      </footer>
    </>
  );
}
