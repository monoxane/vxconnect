import React, { useContext } from 'react'
import { SideNav, SideNavItems, SideNavDivider } from '@carbon/react'
import { Dashboard, ServerDns, NetworkPublic, UserMultiple } from '@carbon/icons-react'
import SideNavLink from './SideNavLink.jsx'
import useWindowDimensions from '../hooks/useWindowDimensions'

const SidebarNav = ({ isActive }) => {
  const { width } = useWindowDimensions();
  
  return (
    <SideNav active={isActive} isRail expanded={isActive || width > 1055} className="connect-sidenav" aria-label="sidebar navigation">
      <SideNavItems>
        <SideNavLink to={'/'} label='Dashboard' renderIcon={Dashboard} />
        <SideNavLink to={'/dns/zones'} label='Zones' renderIcon={ServerDns} />
        <SideNavLink to={'/dns/records'} label='Records' renderIcon={NetworkPublic} />
        <SideNavDivider />
        <SideNavLink to={'/admin/users'} label='Users' renderIcon={UserMultiple} />
      </SideNavItems>
    </SideNav>
  )
}

export default SidebarNav