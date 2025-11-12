import * as React from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Grid,
  GridItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Split,
  SplitItem,
  Badge,
  Checkbox,
  TextInput,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  MenuToggle,
  Pagination,
  Label,
  LabelGroup,
  Dropdown,
  DropdownList,
  DropdownItem,
} from '@patternfly/react-core';
import {
  StarIcon,
  ClockIcon,
  ThIcon,
  ListIcon,
} from '@patternfly/react-icons';

interface SoftwareItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  tags: string[];
  provider: string;
  published: string;
}

const mockSoftware: SoftwareItem[] = [
  {
    id: '1',
    name: 'ScaleOps Platform',
    description: 'All-in-one resource management and optimization platform for Kubernetes',
    logo: '🟣',
    tags: ['Containerized application', 'DevOps'],
    provider: 'ScaleOps - Cloud-Native Optimization',
    published: '5 minutes ago',
  },
  {
    id: '2',
    name: 'LINSTOR',
    description: 'LINSTOR® is open-source software designed to manage block storage devices for large Linux server clusters.',
    logo: '🟠',
    tags: ['Containerized application', 'Storage'],
    provider: 'LINBIT USA, LLC',
    published: '18 minutes ago',
  },
  {
    id: '3',
    name: 'OpenShift Windows Machine Config Operator',
    description: 'Windows Machine Config Operator is an operator providing the ability to run Windows compute nodes in an OpenShift Container Platform cluster.',
    logo: '🔴',
    tags: ['Containerized application', 'OS & platforms'],
    provider: 'Red Hat',
    published: '1 hour ago',
  },
  {
    id: '4',
    name: 'Prisma Cloud Enterprise Edition',
    description: 'Cloud Native Application Protection Platform by Palo Alto Networks',
    logo: '🔵',
    tags: ['Containerized application', 'Security'],
    provider: 'Palo Alto Networks Inc.',
    published: '2 hours ago',
  },
  {
    id: '5',
    name: 'Kubernetes Operator Framework',
    description: 'A framework for building Kubernetes operators',
    logo: '⚪',
    tags: ['Containerized application', 'DevOps'],
    provider: 'CNCF',
    published: '3 hours ago',
  },
  {
    id: '6',
    name: 'Prometheus Monitoring',
    description: 'Open-source systems monitoring and alerting toolkit',
    logo: '🔴',
    tags: ['Containerized application', 'Monitoring'],
    provider: 'Prometheus',
    published: '4 hours ago',
  },
];

const Catalog: React.FunctionComponent = () => {
  const [selectedType, setSelectedType] = React.useState<string[]>([]);
  const [selectedDeployment, setSelectedDeployment] = React.useState<string[]>([]);
  const [providerSearch, setProviderSearch] = React.useState('');
  const [selectedProviders, setSelectedProviders] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = React.useState('relevance');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  const typeOptions = ['Standalone application', 'Containerized application'];
  const deploymentOptions = ['Helm chart', 'Operator'];
  const providerOptions = [
    '21 Analytics AG',
    '6WIND',
    '6fusion',
    'A10 Networks',
    'A5g Networks, Inc.',
    'AI EdgeLabs',
    'AMDOCS',
    'ATS',
  ];

  const handleTypeChange = (event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    const value = event.currentTarget.value;
    setSelectedType(
      checked ? [...selectedType, value] : selectedType.filter((item) => item !== value)
    );
  };

  const handleDeploymentChange = (event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    const value = event.currentTarget.value;
    setSelectedDeployment(
      checked ? [...selectedDeployment, value] : selectedDeployment.filter((item) => item !== value)
    );
  };

  const handleProviderChange = (event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    const value = event.currentTarget.value;
    setSelectedProviders(
      checked ? [...selectedProviders, value] : selectedProviders.filter((item) => item !== value)
    );
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSelectedType([]);
    setSelectedDeployment([]);
    setSelectedProviders([]);
  };

  const totalResults = mockSoftware.length;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalResults);
  const displayedSoftware = mockSoftware.slice(startIndex, endIndex);

  const sidebar = (
    <SidebarPanel>
      <div style={{ padding: '1rem' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
          Type
        </Title>
        {typeOptions.map((option) => (
          <Checkbox
            key={option}
            label={option}
            value={option}
            isChecked={selectedType.includes(option)}
            onChange={handleTypeChange}
            id={`type-${option}`}
            style={{ marginBottom: '0.5rem' }}
          />
        ))}

        <Title headingLevel="h3" size="md" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          Deployment method
        </Title>
        {deploymentOptions.map((option) => (
          <Checkbox
            key={option}
            label={option}
            value={option}
            isChecked={selectedDeployment.includes(option)}
            onChange={handleDeploymentChange}
            id={`deployment-${option}`}
            style={{ marginBottom: '0.5rem' }}
          />
        ))}

        <Title headingLevel="h3" size="md" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          Provider
        </Title>
        <TextInput
          value={providerSearch}
          type="text"
          onChange={(_, value) => setProviderSearch(value)}
          placeholder="Q Search Provider"
          style={{ marginBottom: '1rem' }}
        />
        {providerOptions
          .filter((p) => p.toLowerCase().includes(providerSearch.toLowerCase()))
          .map((option) => (
            <Checkbox
              key={option}
              label={option}
              value={option}
              isChecked={selectedProviders.includes(option)}
              onChange={handleProviderChange}
              id={`provider-${option}`}
              style={{ marginBottom: '0.5rem' }}
            />
          ))}
        <Button variant="link" isInline style={{ marginTop: '0.5rem' }}>
          See more
        </Button>
      </div>
    </SidebarPanel>
  );

  return (
    <>
      <PageSection variant={PageSectionVariants.default}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Title headingLevel="h1" size="2xl">
                Software results ({totalResults} results)
              </Title>
            </ToolbarItem>
            <ToolbarGroup align={{ default: 'alignEnd' }}>
              <ToolbarItem>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'plain'}
                  icon={<ListIcon />}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'plain'}
                  icon={<ThIcon />}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  isOpen={isSortOpen}
                  onSelect={() => setIsSortOpen(false)}
                  onOpenChange={(isOpen) => setIsSortOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="plain"
                      onClick={() => setIsSortOpen(!isSortOpen)}
                    >
                      Sort by: {sortBy === 'relevance' ? 'Relevance' : sortBy}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem
                      value="relevance"
                      onClick={() => setSortBy('relevance')}
                    >
                      Relevance
                    </DropdownItem>
                    <DropdownItem
                      value="name"
                      onClick={() => setSortBy('name')}
                    >
                      Name
                    </DropdownItem>
                    <DropdownItem
                      value="date"
                      onClick={() => setSortBy('date')}
                    >
                      Date
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <Pagination
                  itemCount={totalResults}
                  page={currentPage}
                  perPage={perPage}
                  onSetPage={(_, page) => setCurrentPage(page)}
                  onPerPageSelect={(_, perPage) => {
                    setPerPage(perPage);
                    setCurrentPage(1);
                  }}
                  perPageOptions={[
                    { title: '20', value: 20 },
                    { title: '50', value: 50 },
                    { title: '100', value: 100 },
                  ]}
                  widgetId="pagination-top"
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <Split>
            <SplitItem>
              <Button variant="link" isInline>
                &lt; Back to all results
              </Button>
            </SplitItem>
            <SplitItem isFilled />
            <SplitItem>
              <LabelGroup>
                {activeFilters.map((filter) => (
                  <Label
                    key={filter}
                    onClose={() => removeFilter(filter)}
                    closeBtnAriaLabel={`Remove ${filter}`}
                  >
                    {filter}
                  </Label>
                ))}
              </LabelGroup>
            </SplitItem>
          </Split>
        </div>
      </PageSection>
      <PageSection>
        <Sidebar>
          <SidebarPanel>{sidebar}</SidebarPanel>
          <SidebarContent>
            <Grid hasGutter>
              {displayedSoftware.map((item) => (
                <GridItem key={item.id} span={viewMode === 'grid' ? 6 : 12}>
                  <Card>
                    <CardHeader>
                      <Split>
                        <SplitItem>
                          <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{item.logo}</span>
                        </SplitItem>
                        <SplitItem isFilled>
                          <CardTitle>{item.name}</CardTitle>
                        </SplitItem>
                        <SplitItem>
                          <Button variant="plain" aria-label="Add to favorites">
                            <StarIcon />
                          </Button>
                        </SplitItem>
                      </Split>
                    </CardHeader>
                    <CardBody>{item.description}</CardBody>
                    <CardFooter>
                      <Split>
                        <SplitItem>
                          {item.tags.map((tag) => (
                            <Badge key={tag} style={{ marginRight: '0.5rem' }}>
                              {tag}
                            </Badge>
                          ))}
                        </SplitItem>
                        <SplitItem isFilled />
                        <SplitItem>
                          <Split>
                            <SplitItem>
                              <span style={{ marginRight: '1rem' }}>
                                <ThIcon style={{ marginRight: '0.25rem' }} />
                                {item.provider}
                              </span>
                            </SplitItem>
                            <SplitItem>
                              <span>
                                <ClockIcon style={{ marginRight: '0.25rem' }} />
                                Published {item.published}
                              </span>
                            </SplitItem>
                          </Split>
                        </SplitItem>
                      </Split>
                    </CardFooter>
                  </Card>
                </GridItem>
              ))}
            </Grid>
            <div style={{ marginTop: '2rem' }}>
              <Pagination
                itemCount={totalResults}
                page={currentPage}
                perPage={perPage}
                onSetPage={(_, page) => setCurrentPage(page)}
                onPerPageSelect={(_, perPage) => {
                  setPerPage(perPage);
                  setCurrentPage(1);
                }}
                perPageOptions={[
                  { title: '20', value: 20 },
                  { title: '50', value: 50 },
                  { title: '100', value: 100 },
                ]}
                widgetId="pagination-bottom"
              />
            </div>
          </SidebarContent>
        </Sidebar>
      </PageSection>
    </>
  );
};

export { Catalog };

