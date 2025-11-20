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
  JumpLinks,
  JumpLinksItem,
  Badge,
  ClipboardCopy,
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
  Popover,
  SearchInput,
  Divider,
} from '@patternfly/react-core';
import { ClockIcon, ThIcon, DownloadIcon, CheckCircleIcon, HelpIcon, ShieldAltIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const DetailPage: React.FunctionComponent = () => {
  const { metadataToggles } = useMetadata();
  const displayName = 'curl';
  const [minutesAgo, setMinutesAgo] = React.useState(0);
  
  // Image configuration state
  const [tagDropdownOpen, setTagDropdownOpen] = React.useState(false);
  const [selectedTag, setSelectedTag] = React.useState('latest');
  const [tagSearchValue, setTagSearchValue] = React.useState('');
  const [complianceLevel, setComplianceLevel] = React.useState('');
  const [includePackageManager, setIncludePackageManager] = React.useState(false);
  const [includeShell, setIncludeShell] = React.useState(false);
  const [includeGoTools, setIncludeGoTools] = React.useState(false);
  const [aiPromptCopied, setAiPromptCopied] = React.useState(false);
  const [pageSearchValue, setPageSearchValue] = React.useState('');
  const [activeSection, setActiveSection] = React.useState('');

  // Tag metadata (last published dates)
  const tagMetadata: Record<string, string> = {
    'latest': '2 days ago',
    'latest-builder': '2 days ago',
    '1.1.0': '1 week ago',
    '1.0.0': '3 weeks ago',
  };

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

  // Generate the image tag suffix with Go prefix if needed
  const baseTag = selectedTag || 'latest';
  const imageTag = includeGoTools ? `go:${baseTag}` : baseTag;

  // Determine if options should be disabled (when not latest or latest-builder)
  const isOptionsDisabled = selectedTag !== 'latest' && selectedTag !== 'latest-builder';

  // Generate the image name with -fips extension if FIPS compliance is selected
  const imageName = complianceLevel === 'fips-stig' ? 'curl-fips' : 'curl';

  // Get display name for tag
  const getTagDisplayName = (tag: string) => {
    if (!tag) return 'Select a tag';
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

  // Search functionality
  React.useEffect(() => {
    if (pageSearchValue) {
      // Use browser's native find functionality
      if (window.find) {
        window.find(pageSearchValue, false, false, true, false, true, false);
      }
    }
  }, [pageSearchValue]);

  // Track active section for jump links
  React.useEffect(() => {
    const sections = [
      'start-using',
      'migration',
      'compatibility',
      'license',
      'architecture',
      'containerfile',
      'comparison',
      'latest-update',
      'tags',
      'image-variants',
      'cves',
      'sbom',
      'cosign',
      'fips',
      'stig',
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [metadataToggles.zeroCVEs, metadataToggles.sbom, metadataToggles.fipsChips]);

  // Handle smooth scrolling for jump links
  const handleJumpLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without jumping
      window.history.pushState(null, '', href);
      setActiveSection(href);
    }
  };

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
      <PageSection variant={PageSectionVariants.default} style={{ paddingTop: '1.5rem', paddingBottom: '2rem', backgroundColor: '#f5f5f5' }}>
        <Breadcrumb style={{ marginBottom: '2rem' }}>
          <BreadcrumbItem to="/">Hummingbird Images</BreadcrumbItem>
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
        
        <div style={{ display: 'flex', gap: '2rem', overflow: 'visible' }}>
          {/* Left column: Image info */}
          <div style={{ 
            width: '250px', 
            flexShrink: 0,
            position: 'sticky',
            top: '1rem',
            alignSelf: 'flex-start',
            height: 'fit-content'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                padding: '0.5rem 0.75rem', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px', 
                border: '1px solid #d2d2d2',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 150" style={{ height: '1.5rem', width: 'auto', display: 'block' }}>
                  <text x="0" y="120" fontFamily="sans-serif" fontSize="100" fontWeight="bold" fill="#073551">curl://</text>
                </svg>
              </div>
              <Title headingLevel="h1" size="xl" style={{ marginBottom: 0 }}>
                {displayName} {metadataToggles.versionNumber && <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>1.1.0</span>}
              </Title>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                <Button 
                  variant="link" 
                  isInline 
                  component="a" 
                  href="https://hub.docker.com/_/curl" 
                  target="_blank"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="end"
                  style={{ padding: 0, fontSize: '0.875rem' }}
                >
                  Upstream source
                </Button>
              </div>
              {metadataToggles.fipsChips && itemData.fipsStatus && (
                <div>
                  <Label color="blue" icon={<ShieldAltIcon />}>
                    <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>{itemData.fipsStatus}</span>
                  </Label>
                </div>
              )}
              {metadataToggles.distributorName && (
                <span>
                  <ThIcon style={{ marginRight: '0.25rem' }} />
                  {itemData.provider}
                </span>
              )}
            </div>
            
            <Divider style={{ marginBottom: '1.5rem' }} />
            
            {metadataToggles.zeroCVEs && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '1rem' }}>CVE Count</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: '#C9190B',
                        flexShrink: 0
                      }} />
                      <span style={{ fontSize: '0.875rem', width: '60px' }}>Critical</span>
                      <Badge isRead style={{ marginLeft: 'auto' }}>0</Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: '#EC7A08',
                        flexShrink: 0
                      }} />
                      <span style={{ fontSize: '0.875rem', width: '60px' }}>High</span>
                      <Badge isRead style={{ marginLeft: 'auto' }}>0</Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: '#F0AB00',
                        flexShrink: 0
                      }} />
                      <span style={{ fontSize: '0.875rem', width: '60px' }}>Medium</span>
                      <Badge isRead style={{ marginLeft: 'auto' }}>0</Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: '#7D7D7D',
                        flexShrink: 0
                      }} />
                      <span style={{ fontSize: '0.875rem', width: '60px' }}>Low</span>
                      <Badge isRead style={{ marginLeft: 'auto' }}>0</Badge>
                    </div>
                  </div>
                </div>
                <Divider style={{ marginBottom: '1.5rem' }} />
              </>
            )}
          </div>
          
          {/* Middle column: Action cards */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Sticky search bar */}
            <div style={{ 
              position: 'sticky', 
              top: '0', 
              backgroundColor: '#f5f5f5', 
              zIndex: 100,
              paddingBottom: '1rem',
              marginBottom: '1rem'
            }}>
              <SearchInput
                placeholder="Search this page..."
                value={pageSearchValue}
                onChange={(_event, value) => setPageSearchValue(value)}
                onClear={() => setPageSearchValue('')}
              />
            </div>
            <Grid hasGutter>
          <GridItem span={12} id="start-using">
            <Card>
              <CardHeader>
                <CardTitle>Start using this image</CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', gap: '4rem', marginBottom: '2rem' }}>
                  <div style={{ minWidth: '200px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Tag
                      <Popover
                        headerContent={<div>Tag Selection</div>}
                        bodyContent={
                          <div>
                            Choose the version tag for the container image. "Latest" provides the most recent stable build, 
                            while "Latest builder" includes additional build tools. Version-specific tags (e.g., 1.1.0) are 
                            immutable and guaranteed to remain consistent.
                          </div>
                        }
                      >
                        <button
                          type="button"
                          aria-label="More info for tag field"
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#6a6e73'
                          }}
                        >
                          <HelpIcon />
                        </button>
                      </Popover>
                    </label>
                    <Dropdown
                      isOpen={tagDropdownOpen}
                      onSelect={() => {
                        setTagDropdownOpen(false);
                        setTagSearchValue('');
                      }}
                      onOpenChange={(isOpen: boolean) => {
                        setTagDropdownOpen(isOpen);
                        if (!isOpen) {
                          setTagSearchValue('');
                        }
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle ref={toggleRef} onClick={() => setTagDropdownOpen(!tagDropdownOpen)} isExpanded={tagDropdownOpen}>
                          {getTagDisplayName(selectedTag)}
                        </MenuToggle>
                      )}
                    >
                      <div style={{ padding: '0.5rem' }}>
                        <SearchInput
                          placeholder="Search tags"
                          value={tagSearchValue}
                          onChange={(_event, value) => setTagSearchValue(value)}
                          onClear={() => setTagSearchValue('')}
                        />
                      </div>
                      <Divider />
                      <DropdownList>
                        {[
                          { value: 'latest', label: 'Latest' },
                          { value: 'latest-builder', label: 'Latest builder' },
                          { value: '1.1.0', label: '1.1.0' },
                          { value: '1.0.0', label: '1.0.0' },
                        ]
                          .filter(tag => tag.label.toLowerCase().includes(tagSearchValue.toLowerCase()))
                          .map(tag => (
                            <DropdownItem 
                              value={tag.value} 
                              key={tag.value} 
                              onClick={() => handleTagChange(tag.value)}
                              isSelected={selectedTag === tag.value}
                            >
                              {tag.label}
                            </DropdownItem>
                          ))}
                      </DropdownList>
                    </Dropdown>
                    {selectedTag && tagMetadata[selectedTag] && (
                      <div style={{ fontSize: '0.875rem', color: '#6a6e73', marginTop: '0.5rem' }}>
                        Last published: {tagMetadata[selectedTag]}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Compliance level
                      <Popover
                        headerContent={<div>Security Compliance</div>}
                        bodyContent={
                          <div>
                            Select the security compliance standard for your container image. FIPS (Federal Information Processing 
                            Standard) and STIG (Security Technical Implementation Guide) provide government-grade security standards. 
                            CIS (Center for Internet Security) Compliance offers industry best practices for secure configuration.
                          </div>
                        }
                      >
                        <button
                          type="button"
                          aria-label="More info for compliance level field"
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#6a6e73'
                          }}
                        >
                          <HelpIcon />
                        </button>
                      </Popover>
                    </label>
                    <Radio
                      isChecked={complianceLevel === 'fips-stig'}
                      onChange={() => setComplianceLevel('fips-stig')}
                      label="FIPS and STIG"
                      name="compliance"
                      id="fips-stig"
                      isDisabled={isOptionsDisabled}
                    />
                    <Radio
                      isChecked={complianceLevel === 'cis'}
                      onChange={() => setComplianceLevel('cis')}
                      label="CIS Compliance"
                      name="compliance"
                      id="cis-compliance"
                      isDisabled={isOptionsDisabled}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Includes
                      <Popover
                        headerContent={<div>Additional Tools</div>}
                        bodyContent={
                          <div>
                            Customize your image with optional development tools. "Package manager" includes tools like dnf/yum 
                            for installing additional packages. "Shell" provides a full shell environment for debugging and 
                            interactive sessions. "Go tools" includes the Go toolchain. Including package manager or shell 
                            switches to the "Latest builder" variant.
                          </div>
                        }
                      >
                        <button
                          type="button"
                          aria-label="More info for includes field"
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#6a6e73'
                          }}
                        >
                          <HelpIcon />
                        </button>
                      </Popover>
                    </label>
                    <Checkbox
                      label="Package manager"
                      isChecked={includePackageManager}
                      onChange={(_event, checked) => handlePackageManagerChange(checked)}
                      id="package-manager"
                      isDisabled={isOptionsDisabled}
                    />
                    <Checkbox
                      label="Shell"
                      isChecked={includeShell}
                      onChange={(_event, checked) => handleShellChange(checked)}
                      id="shell"
                      isDisabled={isOptionsDisabled}
                    />
                    <Checkbox
                      label="Go tools"
                      isChecked={includeGoTools}
                      onChange={(_event, checked) => setIncludeGoTools(checked)}
                      id="go-tools"
                      isDisabled={isOptionsDisabled}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Podman pull command</div>
                  <div style={{ fontFamily: 'monospace', width: '75%' }}>
                    <ClipboardCopy 
                      isReadOnly 
                      hoverTip="Copy" 
                      clickTip="Copied"
                    >
                      {`podman pull --quay.io/hummingbird/${imageName}:${imageTag}`}
                    </ClipboardCopy>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', color: '#6a6e73' }}>
                    <span>— Compressed size: 1.3MB</span>
                  </div>
                  <div style={{ color: '#6a6e73' }}>
                    <span>— Architecture: aarch64, arm64, x86_64</span>
                  </div>
                </div>

                <div>
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Docker pull command</div>
                  <div style={{ fontFamily: 'monospace', width: '75%' }}>
                    <ClipboardCopy 
                      isReadOnly 
                      hoverTip="Copy" 
                      clickTip="Copied"
                    >
                      {`docker pull --quay.io/hummingbird/${imageName}:${imageTag}`}
                    </ClipboardCopy>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', color: '#6a6e73' }}>
                    <span>— Compressed size: 1.3MB</span>
                  </div>
                  <div style={{ color: '#6a6e73' }}>
                    <span>— Architecture: aarch64, arm64, x86_64</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={12} id="migration">
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle>Migration steps</CardTitle>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      const prompt = `Migrate my Dockerfile to use quay.io/hummingbird/${imageName}:${imageTag} as the base image. Make sure to:
1. Update the FROM statement
2. Change any apk package manager commands to dnf
3. Set USER to 1001
4. Add WORKDIR /app and set ownership with 'chown -R 1001:1001 /app'
5. Ensure cache directories are writable by creating them and setting ownership to 1001:1001`;
                      navigator.clipboard.writeText(prompt);
                      setAiPromptCopied(true);
                      setTimeout(() => setAiPromptCopied(false), 2000);
                    }}
                  >
                    {aiPromptCopied ? 'Copied!' : 'Copy Instructions as AI Prompt'}
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <p style={{ marginBottom: '1.5rem' }}>
                  Replace your Dockerfile inline to use this hardened, security-focused image. Follow these steps 
                  manually, or copy the instructions to use with your AI coding assistant.
                </p>

                <div style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>1. Update the FROM statement</strong>
                    <div style={{ marginTop: '0.5rem', width: '75%' }}>
                      <ClipboardCopy 
                        isReadOnly 
                        hoverTip="Copy" 
                        clickTip="Copied"
                      >
                        {`Update the FROM statement to use quay.io/hummingbird/${imageName}:${imageTag}`}
                      </ClipboardCopy>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>2. Change any apk package manager commands to dnf</strong>
                    <div style={{ marginTop: '0.5rem', width: '75%' }}>
                      <ClipboardCopy 
                        isReadOnly 
                        hoverTip="Copy" 
                        clickTip="Copied"
                      >
                        Change any apk package manager commands to dnf
                      </ClipboardCopy>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>3. Set USER to 1001</strong>
                    <div style={{ marginTop: '0.5rem', width: '75%' }}>
                      <ClipboardCopy 
                        isReadOnly 
                        hoverTip="Copy" 
                        clickTip="Copied"
                      >
                        Set USER to 1001
                      </ClipboardCopy>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>4. Add WORKDIR and set ownership</strong>
                    <div style={{ marginTop: '0.5rem', width: '75%' }}>
                      <ClipboardCopy 
                        isReadOnly 
                        hoverTip="Copy" 
                        clickTip="Copied"
                      >
                        Add WORKDIR /app and set ownership with 'chown -R 1001:1001 /app'
                      </ClipboardCopy>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong>5. Ensure cache directories are writable</strong>
                    <div style={{ marginTop: '0.5rem', width: '75%' }}>
                      <ClipboardCopy 
                        isReadOnly 
                        hoverTip="Copy" 
                        clickTip="Copied"
                      >
                        Ensure cache directories are writable by creating them and setting ownership to 1001:1001
                      </ClipboardCopy>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* Image Details Cards */}
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

          {/* Size Cards */}
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
              <CardHeader
                actions={{
                  actions: <Button variant="secondary">View Containerfile</Button>
                }}
              >
                <CardTitle>Containerfile</CardTitle>
              </CardHeader>
              <CardBody>
                <p>View the Containerfile used to build this image.</p>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12} id="comparison">
            <Card>
              <CardHeader
                actions={{
                  actions: <Button variant="secondary">View on GitLab</Button>
                }}
              >
                <CardTitle>Image Comparison Report</CardTitle>
              </CardHeader>
              <CardBody>
                <p>Compare this image with other versions or similar images.</p>
              </CardBody>
            </Card>
          </GridItem>

          {/* Updated Cards */}
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

          {/* Secure Cards */}
          {metadataToggles.zeroCVEs && (
            <GridItem span={12} id="cves">
              <Card>
                <CardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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
                <CardHeader
                  actions={{
                    actions: (
                      <Button variant="secondary">
                        <span className={metadataToggles.highlightsActive ? "highlighter" : ""}>View SBOM</span>
                      </Button>
                    )
                  }}
                >
                  <CardTitle><span className={metadataToggles.highlightsActive ? "highlighter" : ""}>Software Bill of Materials (SBOM)</span></CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <DownloadIcon style={{ fontSize: '1.5rem' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>sbom-image-name.json</div>
                      <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>2.5 MB</div>
                    </div>
                  </div>
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
                <div style={{ width: '75%' }}>
                  <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied">
                    {`cosign verify quay.io/hummingbird/${imageName}:${imageTag}`}
                  </ClipboardCopy>
                </div>
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
              <CardHeader
                actions={{
                  actions: <Button variant="secondary">View STIG report</Button>
                }}
              >
                <CardTitle>STIG Compliance</CardTitle>
              </CardHeader>
              <CardBody>
                <p>Security Technical Implementation Guide (STIG) compliance information.</p>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
          </div>
          
          {/* Right column: Jump links side panel */}
          <div style={{ 
            width: '250px', 
            flexShrink: 0,
            position: 'sticky',
            top: '1rem',
            alignSelf: 'flex-start',
            height: 'fit-content'
          }}>
            <Card>
              <CardHeader>
                <CardTitle>Jump to section</CardTitle>
              </CardHeader>
              <CardBody>
                <JumpLinks isVertical>
                  <JumpLinksItem href="#start-using" isActive={activeSection === '#start-using'} onClick={(e) => handleJumpLinkClick(e, '#start-using')}>Start using this image</JumpLinksItem>
                  <JumpLinksItem href="#migration" isActive={activeSection === '#migration'} onClick={(e) => handleJumpLinkClick(e, '#migration')}>Migration steps</JumpLinksItem>
                  <JumpLinksItem href="#compatibility" isActive={activeSection === '#compatibility'} onClick={(e) => handleJumpLinkClick(e, '#compatibility')}>Compatibility</JumpLinksItem>
                  <JumpLinksItem href="#license" isActive={activeSection === '#license'} onClick={(e) => handleJumpLinkClick(e, '#license')}>License</JumpLinksItem>
                  <JumpLinksItem href="#architecture" isActive={activeSection === '#architecture'} onClick={(e) => handleJumpLinkClick(e, '#architecture')}>Architecture</JumpLinksItem>
                  <JumpLinksItem href="#containerfile" isActive={activeSection === '#containerfile'} onClick={(e) => handleJumpLinkClick(e, '#containerfile')}>Containerfile</JumpLinksItem>
                  <JumpLinksItem href="#comparison" isActive={activeSection === '#comparison'} onClick={(e) => handleJumpLinkClick(e, '#comparison')}>Image Comparison</JumpLinksItem>
                  <JumpLinksItem href="#latest-update" isActive={activeSection === '#latest-update'} onClick={(e) => handleJumpLinkClick(e, '#latest-update')}>Latest Update</JumpLinksItem>
                  <JumpLinksItem href="#tags" isActive={activeSection === '#tags'} onClick={(e) => handleJumpLinkClick(e, '#tags')}>Tags</JumpLinksItem>
                  <JumpLinksItem href="#image-variants" isActive={activeSection === '#image-variants'} onClick={(e) => handleJumpLinkClick(e, '#image-variants')}>Image Variants</JumpLinksItem>
                  {metadataToggles.zeroCVEs && <JumpLinksItem href="#cves" isActive={activeSection === '#cves'} onClick={(e) => handleJumpLinkClick(e, '#cves')}>CVE Status</JumpLinksItem>}
                  {metadataToggles.sbom && <JumpLinksItem href="#sbom" isActive={activeSection === '#sbom'} onClick={(e) => handleJumpLinkClick(e, '#sbom')}>SBOM</JumpLinksItem>}
                  <JumpLinksItem href="#cosign" isActive={activeSection === '#cosign'} onClick={(e) => handleJumpLinkClick(e, '#cosign')}>Cosign</JumpLinksItem>
                  {metadataToggles.fipsChips && <JumpLinksItem href="#fips" isActive={activeSection === '#fips'} onClick={(e) => handleJumpLinkClick(e, '#fips')}>FIPS</JumpLinksItem>}
                  <JumpLinksItem href="#stig" isActive={activeSection === '#stig'} onClick={(e) => handleJumpLinkClick(e, '#stig')}>STIG</JumpLinksItem>
                </JumpLinks>
              </CardBody>
            </Card>
          </div>
        </div>
      </PageSection>
    </>
  );
};

export { DetailPage };

