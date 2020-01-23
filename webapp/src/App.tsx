import React from "react";
import Home from "./pages/Home";
import Scans from "./pages/Scans";
import Scan from "./pages/Scan";
import Devices from "./pages/Devices";
import Device from "./pages/Device";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import People from "./pages/People";
import Person from "./pages/Person";
import { useRoutes, useRedirect } from "hookrouter";
import { isInt } from "./logic/utils";

const App: React.FC = () => {
  const routes = {
    "/": () => <Home />,
    "/scans": () => <Scans />,
    "/scans/:id": ({ id }: any) =>
      isInt(id) ? <Scan id={parseInt(id)} /> : <NotFound />,
    "/devices": () => <Devices />,
    "/devices/:id": ({ id }: any) =>
      isInt(id) ? <Device id={parseInt(id)} /> : <NotFound />,
    "/people": () => <People />,
    "/people/:id": ({ id }: any) =>
      isInt(id) ? <Person id={parseInt(id)} /> : <NotFound />
  };
  const routeResult = useRoutes(routes);
  useRedirect("/about/", "/about");

  return (
    <>
      <Navigation />
      <div className="my-3">{routeResult || <NotFound />}</div>
    </>
  );
};

export default App;
