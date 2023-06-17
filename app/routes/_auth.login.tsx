import { Outlet, useSearchParams } from "@remix-run/react";
import React from "react";

export default function LoginRoute() {
  const [searchParams] = useSearchParams();
  const [tempError, setTempError] = React.useState(false);

  return (
    <>
      <h1 className="auth__heading">Login</h1>
      <form noValidate method="post">
        {tempError ? (
          <div className="form-nonfield-errors">
            <ul>
              <li>Unknown error logging in</li>
            </ul>
          </div>
        ) : null}
        <div className="input-group">
          <label htmlFor="email-input">email</label>
          <input type="email" id="email-input" name="email" />
        </div>
        <div className="input-group">
          <label htmlFor="password-input">password</label>
          <input
            type="password"
            id="password-input"
            name="password"
            aria-invalid="true"
          />
          <ul className="form-validation-errors">
            <li>Password is to short</li>
          </ul>
        </div>
        <button className="button submit " type="submit">
          sign in
        </button>
      </form>
    </>
  );
}
