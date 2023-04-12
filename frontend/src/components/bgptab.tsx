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
import BGPBar from "./bgpbar";

export default function BGPTab() {
  const [isBGPExpanded, setIsBGPExpanded] = useState(false);

  const handleBGPExpandToggle = (isExpanded: boolean) => {
    setIsBGPExpanded(isExpanded);
  };

  return (
    <>
      <BGPBar
        isExpanded={isBGPExpanded}
        onToggleClick={handleBGPExpandToggle}
      />
      <Outlet />
    </>
  );
}
