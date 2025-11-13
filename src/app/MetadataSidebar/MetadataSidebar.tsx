import * as React from 'react';
import {
  Title,
  Button,
  Switch,
  Divider,
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

export interface MetadataToggles {
  // NEW section master toggle
  newSection: boolean;
  // NEW section
  fipsChips: boolean;
  updatedTime: boolean;
  scannedTime: boolean;
  versionNumber: boolean;
  zeroCVEs: boolean;
  sbom: boolean;
  // QUAY section
  publishedTime: boolean;
  distributorName: boolean;
  favoriting: boolean;
  // CATALOG section
  filtering: boolean;
  // Highlight state
  highlightsActive: boolean;
}

interface MetadataSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  toggles: MetadataToggles;
  onToggleChange: (key: keyof MetadataToggles, value: boolean) => void;
  isDetailPage?: boolean;
}

const MetadataSidebar: React.FunctionComponent<MetadataSidebarProps> = ({ 
  isOpen, 
  onClose, 
  toggles,
  onToggleChange,
  isDetailPage = false
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        width: '280px',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #000000',
        padding: '1rem',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Title headingLevel="h3" size="lg">
          Controls
        </Title>
        <Button variant="plain" onClick={onClose} aria-label="Close sidebar">
          <TimesIcon />
        </Button>
      </div>

            {/* NEW Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Switch
                  id="new-section-switch"
                  label={<strong className="highlighter">NEW</strong>}
                  isChecked={toggles.newSection}
                  onChange={(_, checked) => onToggleChange('newSection', checked)}
                />
              <Button
                variant={toggles.highlightsActive ? 'primary' : 'secondary'}
                onClick={() => onToggleChange('highlightsActive', !toggles.highlightsActive)}
                style={{ padding: '4px 12px', fontSize: '0.875rem' }}
              >
                {toggles.highlightsActive ? 'Highlights on' : 'Highlights off'}
              </Button>
              </div>
        <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Switch
            id="fips-chips-switch"
            label="FIPS chips"
            isChecked={toggles.fipsChips}
            onChange={(_, checked) => onToggleChange('fipsChips', checked)}
          />
          <Switch
            id="updated-time-switch"
            label="Updated time"
            isChecked={toggles.updatedTime}
            onChange={(_, checked) => onToggleChange('updatedTime', checked)}
          />
          <Switch
            id="scanned-time-switch"
            label="Scanned time"
            isChecked={toggles.scannedTime}
            onChange={(_, checked) => onToggleChange('scannedTime', checked)}
          />
          <Switch
            id="version-number-switch"
            label="Version number"
            isChecked={toggles.versionNumber}
            onChange={(_, checked) => onToggleChange('versionNumber', checked)}
          />
          {isDetailPage && (
            <>
              <Switch
                id="zero-cves-switch"
                label="Zero CVEs"
                isChecked={toggles.zeroCVEs}
                onChange={(_, checked) => onToggleChange('zeroCVEs', checked)}
              />
              <Switch
                id="sbom-switch"
                label="SBOM"
                isChecked={toggles.sbom}
                onChange={(_, checked) => onToggleChange('sbom', checked)}
              />
            </>
          )}
        </div>
      </div>

      <Divider style={{ marginBottom: '1.5rem' }} />

      {/* QUAY Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem' }}>
          Best of QUAY
        </Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Switch
            id="published-time-switch"
            label="Published time"
            isChecked={toggles.publishedTime}
            onChange={(_, checked) => onToggleChange('publishedTime', checked)}
          />
          <Switch
            id="distributor-name-switch"
            label="Distributor name"
            isChecked={toggles.distributorName}
            onChange={(_, checked) => onToggleChange('distributorName', checked)}
          />
          <Switch
            id="favoriting-switch"
            label="Favoriting"
            isChecked={toggles.favoriting}
            onChange={(_, checked) => onToggleChange('favoriting', checked)}
          />
        </div>
      </div>

      <Divider style={{ marginBottom: '1.5rem' }} />

      {/* CATALOG Section */}
      <div>
        <Title headingLevel="h4" size="md" style={{ marginBottom: '0.5rem' }}>
          Best of CATALOG
        </Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Switch
            id="filtering-switch"
            label="Filtering"
            isChecked={toggles.filtering}
            onChange={(_, checked) => onToggleChange('filtering', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export { MetadataSidebar };

