import * as React from 'react';
import { MetadataToggles } from '@app/MetadataSidebar/MetadataSidebar';
import { MetadataProvider } from '@app/MetadataContext/MetadataContext';
import { useLocation } from 'react-router-dom';
import {
  Masthead,
  MastheadBrand,
  MastheadMain,
} from '@patternfly/react-core';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const location = useLocation();
  const isMCPServersPage = location.pathname === '/mcp-servers';
  const isDetailPage = location.pathname === '/';
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
    if (key === 'newSection') {
      // Master switch: turn all child toggles on or off together
      setMetadataToggles(prev => ({
        ...prev,
        newSection: value,
        fipsChips: value,
        updatedTime: value,
        scannedTime: value,
        versionNumber: value,
        zeroCVEs: value,
        sbom: value,
      }));
    } else {
      setMetadataToggles(prev => ({ ...prev, [key]: value }));
    }
  };

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🐦</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Project Hummingbird</span>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  return (
    <MetadataProvider value={{ metadataToggles, setMetadataToggles }}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {masthead}
          <div style={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: isMCPServersPage ? '0' : isDetailPage ? '0 1.5rem 1.5rem 1.5rem' : '1.5rem',
            scrollBehavior: 'smooth'
          }}>
            {children}
          </div>
        </div>
      </div>
    </MetadataProvider>
  );
};

export { AppLayout };

