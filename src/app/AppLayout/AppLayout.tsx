import * as React from 'react';
import { MetadataSidebar, MetadataToggles } from '@app/MetadataSidebar/MetadataSidebar';
import { MetadataProvider } from '@app/MetadataContext/MetadataContext';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Nav,
  NavItem,
  NavList,
  Page,
  SkipToContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core';
import { BellIcon, QuestionCircleIcon, CogIcon, ThIcon } from '@patternfly/react-icons';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/detail/');
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [isMetadataSidebarOpen, setIsMetadataSidebarOpen] = React.useState(true);
  const [metadataToggles, setMetadataToggles] = React.useState<MetadataToggles>({
    // NEW section master toggle
    newSection: true,
    // NEW section - all on by default
    fipsChips: true,
    updatedTime: true,
    scannedTime: true,
    versionNumber: true,
    zeroCVEs: true,
    sbom: true,
    // QUAY section - all on by default
    publishedTime: true,
    distributorName: true,
    favoriting: true,
    // CATALOG section - on by default
    filtering: true,
    // Highlight state - off by default
    highlightsActive: false,
  });

  const handleToggleChange = (key: keyof MetadataToggles, value: boolean) => {
    setMetadataToggles(prev => ({ ...prev, [key]: value }));
  };

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
      <MastheadMain>
        <MastheadBrand>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🐦</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Project Hummingbird</span>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight>
          <ToolbarContent style={{ alignItems: 'center' }}>
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
            <ToolbarItem style={{ flex: '1 1 auto', minWidth: 0 }}>
              <SearchInput
                placeholder="🔍 Search Ecosystem Catalog"
                value={searchValue}
                onChange={(_, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                style={{ width: '100%' }}
              />
            </ToolbarItem>
            <ToolbarGroup align={{ default: 'alignEnd' }}>
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
                <Button 
                  variant="plain" 
                  aria-label="Toggle metadata sidebar"
                  onClick={() => setIsMetadataSidebarOpen(!isMetadataSidebarOpen)}
                >
                  <BellIcon />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Avatar
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%23000000'/%3E%3C/svg%3E"
                          alt="Kelsea"
                        />
                        <span>Kelsea</span>
                      </div>
                    </MenuToggle>
                  )}
                >
                  <DropdownList>{userMenuItems}</DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>
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
    <MetadataProvider value={{ metadataToggles, setMetadataToggles }}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {isMetadataSidebarOpen && (
          <MetadataSidebar
            isOpen={isMetadataSidebarOpen}
            onClose={() => setIsMetadataSidebarOpen(false)}
            toggles={metadataToggles}
            onToggleChange={handleToggleChange}
            isDetailPage={isDetailPage}
          />
        )}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Page
            mainContainerId={pageId}
            masthead={masthead}
            skipToContent={PageSkipToContent}
          >
            {children}
          </Page>
        </div>
      </div>
    </MetadataProvider>
  );
};

export { AppLayout };

