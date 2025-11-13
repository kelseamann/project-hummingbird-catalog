import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useMetadata } from '@app/MetadataContext/MetadataContext';
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabTitleText,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  Badge,
  Split,
  SplitItem,
  ClipboardCopy,
  FormGroup,
  Label,
  ProgressBar,
  Breadcrumb,
  BreadcrumbItem,
  SearchInput,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { ClockIcon, ThIcon } from '@patternfly/react-icons';

const DetailPage: React.FunctionComponent = () => {
  const { name } = useParams<{ name: string }>();
  const { metadataToggles } = useMetadata();
  const displayName = name || 'Image';
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [minutesAgo, setMinutesAgo] = React.useState(0);
  const [packageSearchValue, setPackageSearchValue] = React.useState('');
  const [packagePage, setPackagePage] = React.useState(1);
  const [packagePerPage, setPackagePerPage] = React.useState(10);

  // Count up minutes since page load
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMinutesAgo(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Mock data for CLICKME (in a real app, this would come from an API or state)
  const itemData = {
    provider: 'Red Hat',
    published: '5 minutes ago',
    updated: '2 minutes ago',
    scanned: '1 minute ago',
    fipsStatus: 'FIPS available' as const,
  };

  // Mock package data - simulating a larger list
  const allPackages = Array.from({ length: 50 }, (_, i) => ({
    name: `package${i + 1}`,
    version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
    license: ['MIT', 'Apache 2.0', 'BSD', 'GPL'][Math.floor(Math.random() * 4)],
  }));

  // Filter packages based on search
  const filteredPackages = allPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(packageSearchValue.toLowerCase())
  );

  // Paginate packages
  const paginatedPackages = filteredPackages.slice(
    (packagePage - 1) * packagePerPage,
    packagePage * packagePerPage
  );

  // Empty content section cards
  const contentSections = Array(6).fill(null);

  return (
    <>
      <PageSection variant={PageSectionVariants.default}>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem to="/">Hummingbird Images</BreadcrumbItem>
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h1" size="2xl">
          {displayName} {metadataToggles.versionNumber && <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>1.1.0</span>}
        </Title>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {metadataToggles.distributorName && (
              <span>
                <ThIcon style={{ marginRight: '0.25rem' }} />
                {itemData.provider}
              </span>
            )}
            {metadataToggles.fipsChips && itemData.fipsStatus && (
              <Badge><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>{itemData.fipsStatus}</span></Badge>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {metadataToggles.publishedTime && (
              <span>
                <ClockIcon style={{ marginRight: '0.25rem' }} />
                Published {itemData.published}
              </span>
            )}
            {metadataToggles.updatedTime && (
              <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>
                <ClockIcon style={{ marginRight: '0.25rem' }} />
                Updated {itemData.updated}
              </span>
            )}
            {metadataToggles.scannedTime && (
              <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>
                <ClockIcon style={{ marginRight: '0.25rem' }} />
                Scanned {itemData.scanned}
              </span>
            )}
          </div>
        </div>
      </PageSection>
      <PageSection style={{ paddingTop: '0' }}>
        <Card>
          <CardHeader>
            <CardTitle>Start using this image</CardTitle>
          </CardHeader>
          <CardBody>
            <FormGroup label="Docker pull command">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ minWidth: '400px' }}>
                  <ClipboardCopy 
                    isReadOnly 
                    hoverTip="Copy" 
                    clickTip="Copied"
                  >
                    docker pull quay.io/redhat/image-name
                  </ClipboardCopy>
                </div>
                <span>7.13 GiB</span>
              </div>
            </FormGroup>
            <FormGroup label="Podman pull command" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ minWidth: '400px' }}>
                  <ClipboardCopy 
                    isReadOnly 
                    hoverTip="Copy" 
                    clickTip="Copied"
                  >
                    podman pull quay.io/redhat/image-name
                  </ClipboardCopy>
                </div>
                <span>7.13 GiB</span>
              </div>
            </FormGroup>
          </CardBody>
        </Card>
      </PageSection>
      <PageSection style={{ paddingTop: '0' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
          aria-label="Detail tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>}>
            {/* Overview content - to be filled in later */}
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Security</TabTitleText>}>
            {/* Security content - to be filled in later */}
          </Tab>
          {metadataToggles.sbom && (
            <Tab eventKey={2} title={<TabTitleText><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>SBOM</span></TabTitleText>}>
              {/* SBOM content - to be filled in later */}
            </Tab>
          )}
          <Tab eventKey={3} title={<TabTitleText>Get this image</TabTitleText>}>
            {/* Get this image content - to be filled in later */}
          </Tab>
        </Tabs>
      </PageSection>
      <PageSection>
        <Sidebar hasGutter>
          <SidebarPanel>
            <JumpLinks isVertical label="Jump to section">
              {activeTabKey === 1 ? (
                <>
                  {metadataToggles.zeroCVEs && (
                    <JumpLinksItem href="#cves">Latest CVEs</JumpLinksItem>
                  )}
                  <JumpLinksItem href="#attestation">Attestation</JumpLinksItem>
                </>
              ) : metadataToggles.sbom && activeTabKey === 2 ? (
                <>
                  <JumpLinksItem href="#sbom"><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>Software Bill of Materials</span></JumpLinksItem>
                </>
              ) : (
                <>
                  <JumpLinksItem href="#description">Description</JumpLinksItem>
                  <JumpLinksItem href="#overview">Overview</JumpLinksItem>
                  <JumpLinksItem href="#security">Security</JumpLinksItem>
                  <JumpLinksItem href="#get-this-image">Get this image</JumpLinksItem>
                </>
              )}
            </JumpLinks>
          </SidebarPanel>
          <SidebarContent>
            <Grid hasGutter>
              {/* Description card - only show in Overview tab */}
              {activeTabKey === 0 && (
                <GridItem span={12}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardBody>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </CardBody>
                  </Card>
                </GridItem>
              )}
              {/* Packages table - only show in Packages tab */}
              {metadataToggles.sbom && activeTabKey === 2 && (
                <GridItem span={12}>
                  <Card>
                    <CardHeader>
                      <CardTitle><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>Software Bill of Materials</span></CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Toolbar>
                        <ToolbarContent>
                          <ToolbarItem style={{ flex: '1 1 auto', minWidth: 0 }}>
                            <SearchInput
                              placeholder="Search packages..."
                              value={packageSearchValue}
                              onChange={(_event, value) => {
                                setPackageSearchValue(value);
                                setPackagePage(1);
                              }}
                              onClear={() => {
                                setPackageSearchValue('');
                                setPackagePage(1);
                              }}
                              style={{ width: '100%' }}
                            />
                          </ToolbarItem>
                        </ToolbarContent>
                      </Toolbar>
                      <div style={{ maxHeight: '500px', overflowY: 'auto', marginTop: '1rem' }}>
                        <Table variant="compact">
                          <Thead>
                            <Tr>
                              <Th>Package Name</Th>
                              <Th>Version</Th>
                              <Th>Size</Th>
                              <Th>License</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {paginatedPackages.map((pkg, index) => (
                              <Tr key={index}>
                                <Td>{pkg.name}</Td>
                                <Td>{pkg.version}</Td>
                                <Td>{pkg.size}</Td>
                                <Td>{pkg.license}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </div>
                      <Pagination
                        itemCount={filteredPackages.length}
                        page={packagePage}
                        perPage={packagePerPage}
                        onSetPage={(_event, pageNumber) => setPackagePage(pageNumber)}
                        onPerPageSelect={(_event, newPerPage) => {
                          setPackagePerPage(newPerPage);
                          setPackagePage(1);
                        }}
                        variant="bottom"
                        style={{ marginTop: '1rem' }}
                      />
                    </CardBody>
                  </Card>
                </GridItem>
              )}
              {/* Latest CVEs card - only show in Security tab */}
              {activeTabKey === 1 && metadataToggles.zeroCVEs && (
                <GridItem span={12}>
                  <Card>
                    <CardHeader>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CardTitle><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>Latest CVEs</span></CardTitle>
                        <span className={metadataToggles.highlightsActive ? "highlighter" : ""} style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                          Scanned {minutesAgo} {minutesAgo === 1 ? 'minute' : 'minutes'} ago
                        </span>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>Critical</span>
                          <span style={{ color: '#d2d2d2' }}>0</span>
                        </div>
                        <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>High</span>
                          <span style={{ color: '#d2d2d2' }}>0</span>
                        </div>
                        <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>Medium</span>
                          <span style={{ color: '#d2d2d2' }}>0</span>
                        </div>
                        <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>Low</span>
                          <span style={{ color: '#d2d2d2' }}>0</span>
                        </div>
                        <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                      </div>
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #d2d2d2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold' }}>Total CVEs:</span>
                          <span>0</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              )}
              {/* Empty content section cards */}
              {contentSections.map((_, index) => (
                <GridItem key={`content-${index}`} span={12}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Content section</CardTitle>
                    </CardHeader>
                    <CardBody>
                      {/* Empty for now - to be filled in later */}
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </SidebarContent>
        </Sidebar>
      </PageSection>
    </>
  );
};

export { DetailPage };

