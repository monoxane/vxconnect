import React, { useState, useEffect } from "react";
import {
  Button,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  SideNavLink,
} from "carbon-components-react";
import {
  Fade,
  Menu,
  Pin,
  PinFilled,
  Home,
  ServerDns,
  NetworkPublic,
} from "@carbon/icons-react";
import { Outlet, useLocation, Link } from "react-router-dom";

interface DNSBarProps {
  isExpanded: boolean;
  onToggleClick: (isExpanded: boolean) => void;
}

const DNSBar = (props: DNSBarProps) => {
  const location = useLocation();
  const [isPinned, setIsPinned] = useState(false);
  const handleMouseEnter = () => {
    if (!isPinned) {
      props.onToggleClick(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      props.onToggleClick(false);
    }
  };

  const handlePinClick = () => {
    setIsPinned(!isPinned);
  };

  return (
    <>
      <SideNav
        expanded={props.isExpanded}
        isChildOfHeader={false}
        aria-label="Side navigation"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={
          props.isExpanded ? "side-nav-collapsed" : "side-nav-collapsed"
        }
      >
        <SideNavItems>
          <Link to="/dash/dns" className="sidebar-menu-item-link">
            <SideNavLink
              renderIcon={Home}
              large
              className={
                location.pathname === "/dash/dns"
                  ? "side-nav-menu-item-active"
                  : ""
              }
            >
              DNS Home
            </SideNavLink>
          </Link>
          <Link to="/dash/dns/zones" className="sidebar-menu-item-link">
            <SideNavLink
              renderIcon={ServerDns}
              large
              className={
                location.pathname === "/dash/dns/zones"
                  ? "side-nav-menu-item-active"
                  : ""
              }
            >
              Zones
            </SideNavLink>
          </Link>
          <Link to="/dash/dns/records" className="sidebar-menu-item-link">
            <SideNavLink
              renderIcon={NetworkPublic}
              large
              className={
                location.pathname === "/dash/dns/records"
                  ? "side-nav-menu-item-active"
                  : ""
              }
            >
              Records
            </SideNavLink>
          </Link>
          {/*                     
                    <SideNavLink
                        renderIcon={Fade}
                        large
                        className={location.pathname === "/dash/dns" ? "side-nav-menu-item-active" : ""}
                    >
                        Large link w/icon
                    </SideNavLink> */}
        </SideNavItems>
        <div className="sidebar-pin-container">
          {isPinned ? (
            <PinFilled className="sidebar-pin" onClick={handlePinClick} />
          ) : (
            <Pin className="sidebar-pin" onClick={handlePinClick} />
          )}
        </div>
      </SideNav>
      <Outlet />
    </>
  );
};

export default DNSBar;
