import React from 'react';
import Home from './pages/Home';
import Scans from './pages/Scans';
import Devices from './pages/Devices';
import Navigation from './components/Navigation';
import NotFound from './pages/NotFound';
import { useRoutes, useRedirect } from 'hookrouter';

const App: React.FC = () => {
  const routes = {
      '/': () => <Home />,
      '/scans': () => <Scans />,
      '/devices': () => <Devices />,
  };
  const routeResult = useRoutes(routes);
  useRedirect('/about/', '/about');

  return <>
      <Navigation />
      <div className="my-3">
          {routeResult || <NotFound />}
      </div>
  </>;
}

export default App;
