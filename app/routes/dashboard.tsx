import type { LinksFunction } from "@remix-run/node";

// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: dasboardParentStyles },
// ];

export default function DashboardParentRoute() {
  return (
    <div>
      <h1 className="heading">Dashboard</h1>
    </div>
  );
}
