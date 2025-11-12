import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core';
import { IAppRoute, routes } from '@app/routes';
import { BarsIcon, BellIcon, QuestionCircleIcon, CogIcon, UserIcon, ThIcon } from '@patternfly/react-icons';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
      <NavLink to={route.path}>
        {route.label}
      </NavLink>
    </NavItem>
  );

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">
        {routes.map(
          (route, idx) => route.label && renderNavItem(route, idx),
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const userMenuItems = (
    <>
      <DropdownItem key="profile">User name</DropdownItem>
      <DropdownItem key="account">Account management</DropdownItem>
      <DropdownItem key="logout">Log out</DropdownItem>
    </>
  );

  const helpMenuItems = (
    <>
      <DropdownItem key="documentation">Documentation</DropdownItem>
      <DropdownItem key="support">Support</DropdownItem>
    </>
  );

  const settingsMenuItems = (
    <>
      <DropdownItem key="settings">Settings</DropdownItem>
    </>
  );

  const masthead = (
    <Masthead>
      <MastheadToggle>
        <Button
          icon={<BarsIcon />}
          variant="plain"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Global navigation"
        />
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🐦</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Project Hummingbird</span>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Nav variant="horizontal">
                <NavList>
                  <NavItem>Solutions</NavItem>
                  <NavItem>Products</NavItem>
                  <NavItem>Artifacts</NavItem>
                  <NavItem>Partners</NavItem>
                </NavList>
              </Nav>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Q Search Ecosystem Catalog"
                value={searchValue}
                onChange={(_, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="plain" aria-label="Favorites">
                <BellIcon />
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="plain" aria-label="Contact us">
                <QuestionCircleIcon />
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="plain" aria-label="Resources">
                <ThIcon />
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isSettingsMenuOpen}
                onSelect={() => setIsSettingsMenuOpen(false)}
                onOpenChange={(isOpen) => setIsSettingsMenuOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                    aria-label="Settings"
                  >
                    <CogIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>{settingsMenuItems}</DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isUserMenuOpen}
                onSelect={() => setIsUserMenuOpen(false)}
                onOpenChange={(isOpen) => setIsUserMenuOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="User menu"
                  >
                    <Avatar src="" alt="User" />
                  </MenuToggle>
                )}
              >
                <DropdownList>{userMenuItems}</DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer?.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );

  return (
    <Page
      mainContainerId={pageId}
      masthead={masthead}
      sidebar={sidebarOpen && Sidebar}
      skipToContent={PageSkipToContent}
    >
      {children}
    </Page>
  );
};

export { AppLayout };

