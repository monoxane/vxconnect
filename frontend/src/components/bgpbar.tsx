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
  Router,
  Events,
  FaceActivatedAdd,
  Home,
  Pin,
  PinFilled,
} from "@carbon/icons-react";
import { Outlet, useLocation, Link } from "react-router-dom";

interface BGPBarProps {
  isExpanded: boolean;
  onToggleClick: (isExpanded: boolean) => void;
}

const BGPBar = (props: BGPBarProps) => {
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
          <Link to="/dash/bgp" className="sidebar-menu-item-link">
            <SideNavLink
              renderIcon={Home}
              large
              className={
                location.pathname === "/dash/bgp"
                  ? "side-nav-menu-item-active"
                  : ""
              }
            >
              BGP Home
            </SideNavLink>
          </Link>
          <Link to="/dash/bgp/routes" className="sidebar-menu-item-link">
            <SideNavLink
              renderIcon={Router}
              large
              className={
                location.pathname === "/dash/bgp/routes"
                  ? "side-nav-menu-item-active"
                  : ""
              }
            >
              Routes
            </SideNavLink>
          </Link>
          <Link to="/dash/bgp/peers" className="sidebar-menu-item-link">
            <SideNavLink
              renderIcon={Events}
              large
              className={
                location.pathname === "/dash/bgp/peers"
                  ? "side-nav-menu-item-active"
                  : ""
              }
            >
              Peers
            </SideNavLink>
          </Link>
          <Link
            to="/dash/bgp/peeringrequests"
            className="sidebar-menu-item-link"
          >
            <SideNavLink
              renderIcon={FaceActivatedAdd}
              large
              className={
                location.pathname === "/dash/bgp/peeringrequests"
                  ? "side-nav-menu-item-active"
                  : ""
              }
            >
              Peering Requests
            </SideNavLink>
          </Link>
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

export default BGPBar;
