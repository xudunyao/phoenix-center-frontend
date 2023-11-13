/* eslint-disable no-underscore-dangle */
import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router, useRoutes,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import routes from './routes';

import './App.less';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const MyRouter = () => {
  const element = useRoutes(routes);
  return element;
};

const App = ({ basename }) => (
  <QueryClientProvider client={queryClient}>
    <Router basename={basename || '/'}>
      <Suspense fallback={<div>Loading...</div>}>
        <MyRouter />
      </Suspense>
    </Router>
  </QueryClientProvider>
);

App.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default App;
