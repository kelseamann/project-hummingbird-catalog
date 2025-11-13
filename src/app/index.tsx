import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import '@app/app.css';

const AppContent: React.FunctionComponent = () => (
  <AppLayout>
    <AppRoutes />
  </AppLayout>
);

const App: React.FunctionComponent = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;

