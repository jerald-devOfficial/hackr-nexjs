import Link from "next/link";
import nProgress from "nprogress";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import { isAuth, logOut } from "../helpers/auth";
import "nprogress/nprogress.css";

Router.onRouteChangeStart = (url) => nProgress.start();
Router.onRouteChangeComplete = (url) => nProgress.done();
Router.onRouteChangeError = (url) => nProgress.done();

const Layout = ({ children }) => {
  // this hydrated variable is to fix the hydration server-client issue in nextjs-reactjs
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const head = () => (
    <React.Fragment>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/static/styles.css" />
    </React.Fragment>
  );

  const nav = () => (
    <ul className="nav nav-tabs bg-warning d-flex justify-content-between">
      <div className="d-flex align-items-center">
        <li className="nav-item">
          <Link href="/">
            <a className="nav-link text-dark">Home</a>
          </Link>
        </li>

        <li className="nav-item">
          <Link href="/user/link/create">
            <a
              className="text-dark btn btn-success"
              style={{ borderRadius: "0px" }}
            >
              Submit a link
            </a>
          </Link>
        </li>
      </div>

      <div className="d-flex align-items-center">
        {!isAuth() && (
          <React.Fragment>
            <li className="nav-item">
              <Link href="/login">
                <a className="nav-link text-dark">Login</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/register">
                <a className="nav-link text-dark">Register</a>
              </Link>
            </li>
          </React.Fragment>
        )}

        {isAuth() && isAuth().role === "admin" && (
          <li className="nav-item ml-auto">
            <Link href="/admin">
              <a className="nav-link text-dark">{isAuth().name}</a>
            </Link>
          </li>
        )}

        {isAuth() && isAuth().role === "subscriber" && (
          <li className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-dark">{isAuth().name}</a>
            </Link>
          </li>
        )}

        {isAuth() && (
          <li className="nav-item">
            <a onClick={logOut} className="nav-link text-dark">
              Logout
            </a>
          </li>
        )}
      </div>
    </ul>
  );

  return (
    <React.Fragment>
      {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
    </React.Fragment>
  );
};

export default Layout;
