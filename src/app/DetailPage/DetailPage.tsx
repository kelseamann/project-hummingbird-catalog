import * as React from 'react';
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
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Radio,
  Checkbox,
} from '@patternfly/react-core';
import { ClockIcon, ThIcon, DownloadIcon, CheckCircleIcon } from '@patternfly/react-icons';

const DetailPage: React.FunctionComponent = () => {
  const { metadataToggles } = useMetadata();
  const displayName = 'NGINX';
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [minutesAgo, setMinutesAgo] = React.useState(0);
  
  // Image configuration state
  const [tagDropdownOpen, setTagDropdownOpen] = React.useState(false);
  const [selectedTag, setSelectedTag] = React.useState('latest');
  const [complianceLevel, setComplianceLevel] = React.useState('fips-stig');
  const [includePackageManager, setIncludePackageManager] = React.useState(false);
  const [includeShell, setIncludeShell] = React.useState(false);

  // Handle tag changes
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    if (tag === 'latest-builder') {
      setIncludePackageManager(true);
      setIncludeShell(true);
    } else if (tag === 'latest') {
      setIncludePackageManager(false);
      setIncludeShell(false);
    }
  };

  // Handle checkbox changes
  const handlePackageManagerChange = (checked: boolean) => {
    setIncludePackageManager(checked);
    if (checked && selectedTag === 'latest') {
      setSelectedTag('latest-builder');
    } else if (!checked && !includeShell && selectedTag === 'latest-builder') {
      setSelectedTag('latest');
    }
  };

  const handleShellChange = (checked: boolean) => {
    setIncludeShell(checked);
    if (checked && selectedTag === 'latest') {
      setSelectedTag('latest-builder');
    } else if (!checked && !includePackageManager && selectedTag === 'latest-builder') {
      setSelectedTag('latest');
    }
  };

  // Generate the image tag suffix
  const imageTag = selectedTag;

  // Get display name for tag
  const getTagDisplayName = (tag: string) => {
    if (tag === 'latest') return 'Latest';
    if (tag === 'latest-builder') return 'Latest builder';
    return tag;
  };

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

  return (
    <>
      <PageSection variant={PageSectionVariants.default} style={{ paddingBottom: '2rem' }}>
        <Breadcrumb style={{ marginBottom: '2rem' }}>
          <BreadcrumbItem to="/">Hummingbird Images</BreadcrumbItem>
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '1.5rem' }}>
          {displayName} {metadataToggles.versionNumber && <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>1.1.0</span>}
        </Title>
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
          <div style={{ display: 'flex', gap: '2rem' }}>
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
      <PageSection style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Grid hasGutter>
          <GridItem span={metadataToggles.sbom ? 6 : 12}>
            <Card>
              <CardHeader>
                <CardTitle>Start using this image</CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', gap: '4rem', marginBottom: '2rem' }}>
                  <FormGroup label="Tag" style={{ minWidth: '200px' }}>
                    <Dropdown
                      isOpen={tagDropdownOpen}
                      onSelect={() => setTagDropdownOpen(false)}
                      onOpenChange={(isOpen: boolean) => setTagDropdownOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle ref={toggleRef} onClick={() => setTagDropdownOpen(!tagDropdownOpen)} isExpanded={tagDropdownOpen}>
                          {getTagDisplayName(selectedTag)}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem value="latest" key="latest" onClick={() => handleTagChange('latest')}>
                          Latest
                        </DropdownItem>
                        <DropdownItem value="latest-builder" key="latest-builder" onClick={() => handleTagChange('latest-builder')}>
                          Latest builder
                        </DropdownItem>
                        <DropdownItem value="1.1.0" key="1.1.0" onClick={() => handleTagChange('1.1.0')}>
                          1.1.0
                        </DropdownItem>
                        <DropdownItem value="1.0.0" key="1.0.0" onClick={() => handleTagChange('1.0.0')}>
                          1.0.0
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>
                  
                  <div>
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Compliance level</div>
                    <Radio
                      isChecked={complianceLevel === 'fips-stig'}
                      onChange={() => setComplianceLevel('fips-stig')}
                      label="FIPS and STIG"
                      name="compliance"
                      id="fips-stig"
                    />
                    <Radio
                      isChecked={complianceLevel === 'cis'}
                      onChange={() => setComplianceLevel('cis')}
                      label="CIS Compliance"
                      name="compliance"
                      id="cis-compliance"
                    />
                  </div>
                  
                  <div>
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Include</div>
                    <Checkbox
                      label="Package manager"
                      isChecked={includePackageManager}
                      onChange={(_event, checked) => handlePackageManagerChange(checked)}
                      id="package-manager"
                    />
                    <Checkbox
                      label="Shell"
                      isChecked={includeShell}
                      onChange={(_event, checked) => handleShellChange(checked)}
                      id="shell"
                    />
                  </div>
                </div>

                <FormGroup label="Docker pull command" style={{ marginBottom: '2rem' }}>
                  <ClipboardCopy 
                    isReadOnly 
                    hoverTip="Copy" 
                    clickTip="Copied"
                  >
                    {`docker pull --quay.io/hummingbird/python:${imageTag}`}
                  </ClipboardCopy>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', color: '#6a6e73' }}>
                    <span>— Compressed size: 1.3MB</span>
                  </div>
                  <div style={{ color: '#6a6e73' }}>
                    <span>— Architecture: aarch64, arm64, x86_64</span>
                  </div>
                </FormGroup>

                <FormGroup label="Podman pull command">
                  <ClipboardCopy 
                    isReadOnly 
                    hoverTip="Copy" 
                    clickTip="Copied"
                  >
                    {`podman pull --quay.io/hummingbird/python:${imageTag}`}
                  </ClipboardCopy>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', color: '#6a6e73' }}>
                    <span>— Compressed size: 1.3MB</span>
                  </div>
                  <div style={{ color: '#6a6e73' }}>
                    <span>— Architecture: aarch64, arm64, x86_64</span>
                  </div>
                </FormGroup>
              </CardBody>
            </Card>
          </GridItem>
          {metadataToggles.sbom && (
            <GridItem span={6}>
              <Card>
                <CardHeader>
                  <CardTitle><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>Download SBOM</span></CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <DownloadIcon style={{ fontSize: '1.5rem' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>sbom-image-name.json</div>
                      <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>2.5 MB</div>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => setActiveTabKey(3)}
                  >
                    <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>View SBOM</span>
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
          )}
        </Grid>
      </PageSection>
      <PageSection style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
          aria-label="Detail tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Image Details</TabTitleText>}>
            {/* Image Details content */}
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Size</TabTitleText>}>
            {/* Size content */}
          </Tab>
          <Tab eventKey={2} title={<TabTitleText>Updated</TabTitleText>}>
            {/* Updated content */}
          </Tab>
          <Tab eventKey={3} title={<TabTitleText>Secure</TabTitleText>}>
            {/* Secure content */}
          </Tab>
        </Tabs>
      </PageSection>
      <PageSection style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Left sidebar for jump links */}
          <div style={{ 
            width: '200px', 
            flexShrink: 0,
            position: 'sticky',
            top: '1rem',
            alignSelf: 'flex-start',
            height: 'fit-content'
          }}>
            <JumpLinks isVertical label="Jump to section">
              {activeTabKey === 0 ? (
                <>
                  <JumpLinksItem href="#image-name">Image Name</JumpLinksItem>
                  <JumpLinksItem href="#pull-commands">Pull Commands</JumpLinksItem>
                  <JumpLinksItem href="#compatibility">Compatibility</JumpLinksItem>
                  <JumpLinksItem href="#license">License</JumpLinksItem>
                </>
              ) : activeTabKey === 1 ? (
                <>
                  <JumpLinksItem href="#image-size">Image Size</JumpLinksItem>
                  <JumpLinksItem href="#drop-in-replace">Drop-in Replace</JumpLinksItem>
                  <JumpLinksItem href="#architecture">Architecture</JumpLinksItem>
                  <JumpLinksItem href="#containerfile">Containerfile</JumpLinksItem>
                  <JumpLinksItem href="#comparison">Image Comparison</JumpLinksItem>
                </>
              ) : activeTabKey === 2 ? (
                <>
                  <JumpLinksItem href="#latest-update">Latest Update</JumpLinksItem>
                  <JumpLinksItem href="#tags">Tags</JumpLinksItem>
                  <JumpLinksItem href="#image-variants">Image Variants</JumpLinksItem>
                </>
              ) : activeTabKey === 3 ? (
                <>
                  <JumpLinksItem href="#cves"><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>CVEs</span></JumpLinksItem>
                  <JumpLinksItem href="#sbom"><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>SBOM</span></JumpLinksItem>
                  <JumpLinksItem href="#cosign">Cosign</JumpLinksItem>
                  <JumpLinksItem href="#fips">FIPS</JumpLinksItem>
                  <JumpLinksItem href="#stig">STIG</JumpLinksItem>
                </>
              ) : null}
            </JumpLinks>
          </div>
          
          {/* Main content area */}
          <div style={{ flex: 1 }}>
            <Grid hasGutter>
              {/* Image Details Tab (0) */}
              {activeTabKey === 0 && (
                <>
                  <GridItem span={12} id="image-name">
                    <Card>
                      <CardHeader>
                        <CardTitle>Container Image Name</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>quay.io/redhat/{displayName.toLowerCase()}</p>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="pull-commands">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pull Commands</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <FormGroup label="Podman pull command" style={{ marginBottom: '2rem' }}>
                          <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                            podman pull quay.io/redhat/image-name
                          </ClipboardCopy>
                        </FormGroup>
                        <FormGroup label="Docker pull command">
                          <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                            docker pull quay.io/redhat/image-name
                          </ClipboardCopy>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="compatibility">
                    <Card>
                      <CardHeader>
                        <CardTitle>Compatibility</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p>Compatible with Red Hat OpenShift Container Platform, Kubernetes, and other container orchestration platforms.</p>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="license">
                    <Card>
                      <CardHeader>
                        <CardTitle>License</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p>Apache License 2.0</p>
                      </CardBody>
                    </Card>
                  </GridItem>
                </>
              )}
              
              {/* Size Tab (1) */}
              {activeTabKey === 1 && (
                <>
                  <GridItem span={12} id="image-size">
                    <Card>
                      <CardHeader>
                        <CardTitle>Image Size</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>7.13 GiB</p>
                        <p style={{ marginTop: '1rem', color: '#6a6e73' }}>Compressed size: 2.8 GiB</p>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="drop-in-replace">
                    <Card>
                      <CardHeader>
                        <CardTitle>Drop-in Replace for default:latest</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p>This image can be used as a drop-in replacement for default:latest images.</p>
                        <p style={{ marginTop: '1rem' }}>Simply update your Dockerfile or container configuration to reference this image instead.</p>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="architecture">
                    <Card>
                      <CardHeader>
                        <CardTitle>Architecture Information</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                          <Label>amd64</Label>
                          <Label>arm64</Label>
                          <Label>s390x</Label>
                          <Label>ppc64le</Label>
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="containerfile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Containerfile</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Button variant="link" isInline>View Containerfile</Button>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="comparison">
                    <Card>
                      <CardHeader>
                        <CardTitle>Image Comparison Report (GitLab)</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Button variant="link" isInline>View comparison report</Button>
                      </CardBody>
                    </Card>
                  </GridItem>
                </>
              )}
              
              {/* Updated Tab (2) */}
              {activeTabKey === 2 && (
                <>
                  <GridItem span={12} id="latest-update">
                    <Card>
                      <CardHeader>
                        <CardTitle>Latest Update</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p style={{ fontWeight: 'bold' }}>Date & Time: <span style={{ fontWeight: 'normal' }}>November 18, 2025 14:32 UTC</span></p>
                        <p style={{ marginTop: '1rem', color: '#6a6e73' }}>Representing latest "x"</p>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="tags">
                    <Card>
                      <CardHeader>
                        <CardTitle>Available Tags</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                          <Label color="blue">:latest</Label>
                          <Label color="blue">:latest-builder</Label>
                          <Label color="grey">:1.1.0</Label>
                          <Label color="grey">:1.0.5</Label>
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={12} id="image-variants">
                    <Card>
                      <CardHeader>
                        <CardTitle>Image Variants</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <div style={{ marginBottom: '2rem' }}>
                          <p style={{ fontWeight: 'bold' }}>:latest</p>
                          <p style={{ color: '#6a6e73', marginTop: '0.5rem' }}>Default Go image (latest Go version)</p>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                          <p style={{ fontWeight: 'bold' }}>:latest-builder</p>
                          <p style={{ color: '#6a6e73', marginTop: '0.5rem' }}>Includes package manager for building applications</p>
                        </div>
                        <div>
                          <p style={{ fontWeight: 'bold' }}>-build</p>
                          <p style={{ color: '#6a6e73', marginTop: '0.5rem' }}>Includes shell for debugging and development</p>
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                </>
              )}
              
              {/* Secure Tab (3) */}
              {activeTabKey === 3 && (
                <>
                  {metadataToggles.zeroCVEs && (
                    <GridItem span={12} id="cves">
                      <Card>
                        <CardHeader>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardTitle><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>CVE Status</span></CardTitle>
                            <span className={metadataToggles.highlightsActive ? "highlighter" : ""} style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                              Scanned {minutesAgo} {minutesAgo === 1 ? 'minute' : 'minutes'} ago
                            </span>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                              <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>Critical</span>
                              <span style={{ color: '#d2d2d2' }}>0</span>
                            </div>
                            <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                          </div>
                          <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                              <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>High</span>
                              <span style={{ color: '#d2d2d2' }}>0</span>
                            </div>
                            <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                          </div>
                          <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                              <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>Medium</span>
                              <span style={{ color: '#d2d2d2' }}>0</span>
                            </div>
                            <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                          </div>
                          <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                              <span style={{ fontWeight: 'bold', color: '#d2d2d2' }}>Low</span>
                              <span style={{ color: '#d2d2d2' }}>0</span>
                            </div>
                            <ProgressBar value={0} style={{ height: '20px', backgroundColor: '#d2d2d2' }} />
                          </div>
                          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #d2d2d2' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 'bold' }}>Total CVEs:</span>
                              <span>0</span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </GridItem>
                  )}
                  {metadataToggles.sbom && (
                    <GridItem span={12} id="sbom">
                      <Card>
                        <CardHeader>
                          <CardTitle><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>Software Bill of Materials (SBOM)</span></CardTitle>
                        </CardHeader>
                        <CardBody>
                          <Button variant="link" isInline>
                            <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>View SBOM in-page</span>
                          </Button>
                          <p style={{ marginTop: '1rem', color: '#6a6e73' }}>Download SBOM: sbom-image-name.json (2.5 MB)</p>
                        </CardBody>
                      </Card>
                    </GridItem>
                  )}
                  <GridItem span={12} id="cosign">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cosign Instructions</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p style={{ marginBottom: '1rem' }}>Verify the image signature using Cosign:</p>
                        <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                          cosign verify quay.io/redhat/image-name:latest
                        </ClipboardCopy>
                      </CardBody>
                    </Card>
                  </GridItem>
                  {metadataToggles.fipsChips && (
                    <GridItem span={12} id="fips">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>FIPS on this image</span>
                              <CheckCircleIcon style={{ color: '#3E8635' }} />
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardBody>
                          <Badge><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>FIPS available</span></Badge>
                          <p style={{ marginTop: '1rem' }}>This image includes FIPS 140-2 validated cryptographic modules.</p>
                        </CardBody>
                      </Card>
                    </GridItem>
                  )}
                  <GridItem span={12} id="stig">
                    <Card>
                      <CardHeader>
                        <CardTitle>STIG Compliance</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p>Security Technical Implementation Guide (STIG) compliance information.</p>
                        <Button variant="link" isInline style={{ marginTop: '1rem' }}>View STIG report</Button>
                      </CardBody>
                    </Card>
                  </GridItem>
                </>
              )}
            </Grid>
          </div>
        </div>
      </PageSection>
    </>
  );
};

export { DetailPage };

