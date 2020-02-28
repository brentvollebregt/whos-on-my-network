import React from "react";
import { navigate, usePath } from "hookrouter";
import { Container, Nav, Navbar } from "react-bootstrap";
import LogoImage from "../img/logo.png";

const navbarLinks: { [key: string]: string } = {
  "/": "Home",
  "/scans": "Scans",
  "/devices": "Devices",
  "/people": "People",
  "/current": "Current"
};

const Navigation: React.FunctionComponent = () => {
  const currentPath = usePath();

  const goTo = (location: string) => () => navigate(location);

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      bg="light"
      variant="light"
      sticky="top"
    >
      <Container>
        <Navbar.Brand onClick={goTo("/")}>
          <img
            src={LogoImage}
            height="30"
            className="d-inline-block align-top"
            alt="Emotionify Banner Logo"
            style={{ cursor: "pointer" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {Object.keys(navbarLinks).map(path => (
              <Nav.Link
                key={path}
                href="#"
                onClick={goTo(path)}
                active={currentPath === path}
              >
                {navbarLinks[path]}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
