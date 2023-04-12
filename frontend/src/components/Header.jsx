import React from 'react';

import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  OverflowMenu,
  OverflowMenuItem
} from '@carbon/react';

import {
  UserAvatar
} from '@carbon/icons-react'

import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';

const AppHeader = function Appheader() {
  const { auth } = useAuth();
  const logout = useLogout();

  return (
    <HeaderContainer
      render={() => (
        <Header aria-label="page header">
          <HeaderName prefix="vx0">
            Connect
          </HeaderName>
          <HeaderGlobalBar>
            {auth?.user && 
              <OverflowMenu flipped renderIcon={UserAvatar} className='cds--header__action'>
                <OverflowMenuItem itemText="Log out" onClick={logout} />
              </OverflowMenu>
            } 
        </HeaderGlobalBar>
        </Header>
      )}
    />
  )
}

export default AppHeader;