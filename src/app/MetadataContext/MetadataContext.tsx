import * as React from 'react';
import { MetadataToggles } from '@app/MetadataSidebar/MetadataSidebar';

interface MetadataContextType {
  metadataToggles: MetadataToggles;
  setMetadataToggles: React.Dispatch<React.SetStateAction<MetadataToggles>>;
}

const MetadataContext = React.createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider: React.FunctionComponent<{ children: React.ReactNode; value: MetadataContextType }> = ({ children, value }) => {
  return <MetadataContext.Provider value={value}>{children}</MetadataContext.Provider>;
};

export const useMetadata = () => {
  const context = React.useContext(MetadataContext);
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
};

