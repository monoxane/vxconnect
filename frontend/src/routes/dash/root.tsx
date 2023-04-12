import React from "react";
// IBM CARBON HEADER with actions
import Shell from "../../components/uishell";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer";

export default function Root() {
  return (
    <>
      <Shell />
      <Outlet />
    </>
    // footer
  );
}
