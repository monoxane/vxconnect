import React from "react";
// IBM CARBON HEADER with actions
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderNavigation,
  SkipToContent,
} from "carbon-components-react";
import { User, Search } from "@carbon/icons-react";

const LoginShell = () => {
  return (
    <Header className="header-transparent" aria-label="IBM Platform Name">
      <SkipToContent />
      <HeaderMenuButton
        aria-label="Open menu"
        onClick={() => alert("Open menu")}
        isActive
      />
      <HeaderName href="#" prefix="VX">
        Connect
      </HeaderName>
    </Header>
  );
};
export default LoginShell;
