import React from 'react'
import {
  useMatch,
  useNavigate
} from 'react-router-dom'
import { SideNavLink } from '@carbon/react'

function CustomSideNavLink ({ label, to, renderIcon }) {
  const match = useMatch(to);
  const navigate = useNavigate();

  if (match) {
    return (
      <SideNavLink large aria-current='page' renderIcon={renderIcon} onClick={() => { navigate(to) }}>
        {label}
      </SideNavLink>
    )
  } else {
    return (
      <SideNavLink large renderIcon={renderIcon} onClick={() => { navigate(to) }}>
         {label}
       </SideNavLink>
     )
  }
}

export default CustomSideNavLink