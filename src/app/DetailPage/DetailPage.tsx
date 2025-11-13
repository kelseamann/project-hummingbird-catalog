import * as React from 'react';
import { useParams } from 'react-router-dom';
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
} from '@patternfly/react-core';
import { ClockIcon, ThIcon } from '@patternfly/react-icons';

const DetailPage: React.FunctionComponent = () => {
  const { name } = useParams<{ name: string }>();
  const displayName = name || 'Image';
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  // Mock data for CLICKME (in a real app, this would come from an API or state)
  const itemData = {
    provider: 'Red Hat',
    published: '5 minutes ago',
    updated: '2 minutes ago',
    scanned: '1 minute ago',
    fipsStatus: 'FIPS available' as const,
  };

  // Empty content section cards
  const contentSections = Array(6).fill(null);

  return (
    <>
      <PageSection variant={PageSectionVariants.default}>
        <Title headingLevel="h1" size="2xl">
          {displayName}
        </Title>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span>
              <ThIcon style={{ marginRight: '0.25rem' }} />
              {itemData.provider}
            </span>
            {itemData.fipsStatus && (
              <Badge><span className="highlighter">{itemData.fipsStatus}</span></Badge>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>
              <ClockIcon style={{ marginRight: '0.25rem' }} />
              Published {itemData.published}
            </span>
            <span className="highlighter">
              <ClockIcon style={{ marginRight: '0.25rem' }} />
              Updated {itemData.updated}
            </span>
            <span className="highlighter">
              <ClockIcon style={{ marginRight: '0.25rem' }} />
              Scanned {itemData.scanned}
            </span>
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
            <Card style={{ marginTop: '1rem' }}>
              <CardHeader>
                <CardTitle>Latest CVEs</CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Critical</span>
                    <span>2</span>
                  </div>
                  <ProgressBar value={20} style={{ height: '20px', backgroundColor: '#c9190b' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>High</span>
                    <span>5</span>
                  </div>
                  <ProgressBar value={50} style={{ height: '20px', backgroundColor: '#ec7a08' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Medium</span>
                    <span>8</span>
                  </div>
                  <ProgressBar value={80} style={{ height: '20px', backgroundColor: '#f0ab00' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Low</span>
                    <span>3</span>
                  </div>
                  <ProgressBar value={30} style={{ height: '20px', backgroundColor: '#2b9af3' }} />
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #d2d2d2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>Total CVEs:</span>
                    <span>18</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab eventKey={2} title={<TabTitleText>Packages</TabTitleText>}>
            {/* Packages content - to be filled in later */}
          </Tab>
          <Tab eventKey={3} title={<TabTitleText>Get this image</TabTitleText>}>
            {/* Get this image content - to be filled in later */}
          </Tab>
        </Tabs>
      </PageSection>
      <PageSection>
        <Sidebar hasGutter>
          <SidebarPanel variant="sticky">
            <JumpLinks isVertical label="Jump to section">
              {activeTabKey === 1 ? (
                <>
                  <JumpLinksItem href="#cves">CVEs</JumpLinksItem>
                  <JumpLinksItem href="#attestation">Attestation</JumpLinksItem>
                </>
              ) : (
                <>
                  <JumpLinksItem href="#overview">Overview</JumpLinksItem>
                  <JumpLinksItem href="#security">Security</JumpLinksItem>
                  <JumpLinksItem href="#packages">Packages</JumpLinksItem>
                  <JumpLinksItem href="#get-this-image">Get this image</JumpLinksItem>
                </>
              )}
            </JumpLinks>
          </SidebarPanel>
          <SidebarContent>
            <Grid hasGutter>
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

