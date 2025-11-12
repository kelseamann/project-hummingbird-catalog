# Project Hummingbird Catalog

Interactive lo-fi wireframes catalog built with PatternFly React components.

## Features

- Catalog view similar to Red Hat Ecosystem Catalog
- Filter sidebar with Type, Deployment method, and Provider filters
- Search functionality
- List and Grid view modes
- Pagination
- Sort options

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run start:dev
```

The app will be available at `http://localhost:9000`

### Build

Build for production:

```bash
npm run build
```

### Run Production Build

```bash
npm run start
```

## GitHub Pages

This repository is configured to deploy to GitHub Pages automatically. Once GitHub Pages is enabled in the repository settings, the site will be available at:

https://kelseamann.github.io/project-hummingbird-catalog/

The GitHub Actions workflow will automatically deploy the site whenever changes are pushed to the `main` branch.

## Project Structure

```
src/
  app/
    AppLayout/     # Main application layout with masthead
    Catalog/       # Catalog page component
    routes.tsx     # Route configuration
    index.tsx      # Main app component
  index.tsx        # React entry point
  index.html       # HTML template
```

## Technologies

- React 18
- TypeScript
- PatternFly React Components
- Webpack
- React Router
