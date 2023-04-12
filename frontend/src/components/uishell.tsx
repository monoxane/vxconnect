import React, { useState, useEffect } from "react";
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
import { Link, useLocation } from "react-router-dom";

const Shell = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Header aria-label="IBM Platform Name">
      <SkipToContent />
      <HeaderMenuButton
        aria-label="Open menu"
        onClick={handleMenuClick}
        isActive={isMenuOpen}
      />
      <Link to="/dash" className="header-menu-item-link">
      <HeaderName prefix="VX">
        Connect
      </HeaderName>
      </Link>
      <HeaderNavigation aria-label="VXConnect">
      <Link to="/dash/dns" className="header-menu-item-link">
        <HeaderMenuItem>
          DNS
        </HeaderMenuItem>
        </Link>
        <Link to="/dash/bgp" className="header-menu-item-link">
        <HeaderMenuItem>
          BGP
        </HeaderMenuItem>
        </Link>
        <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
        <HeaderMenuItem href="#">Link 4</HeaderMenuItem>
      </HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Search" onClick={() => alert("Search")}>
          <Search />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="User" onClick={() => alert("User")}>
          <User />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  );
};

export default Shell;
