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
import Current from "./pages/Current";
import { useRoutes, useRedirect } from "hookrouter";
import { isInt } from "./utils/logic";

const urlIdValidator = (
  id: string,
  Component: React.FunctionComponent<{ id: number }>
) => (isInt(id) ? <Component id={parseInt(id)} /> : <NotFound />);

const App: React.FC = () => {
  const routes = {
    "/": () => <Home />,
    "/scans": () => <Scans />,
    "/scans/:id": ({ id }: any) => urlIdValidator(id, Scan),
    "/devices": () => <Devices />,
    "/devices/:id": ({ id }: any) => urlIdValidator(id, Device),
    "/people": () => <People />,
    "/people/:id": ({ id }: any) => urlIdValidator(id, Person),
    "/current": () => <Current />
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
