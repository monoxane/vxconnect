import React, { useState } from "react";
import {
  Button,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
} from "carbon-components-react";
import { Fade } from "@carbon/icons-react";
import { Outlet } from "react-router-dom";
import DNSBar from "./dnsbar";

export default function DNSTab() {
  const [isDNSExpanded, setIsDNSExpanded] = useState(false);

  const handleDNSExpandToggle = (isExpanded: boolean) => {
    setIsDNSExpanded(isExpanded);
  };

  return (
    <>
      <DNSBar
        isExpanded={isDNSExpanded}
        onToggleClick={handleDNSExpandToggle}
      />
      <Outlet />
    </>
  );
}
