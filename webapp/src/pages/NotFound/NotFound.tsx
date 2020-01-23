import React from "react";
import Constants from "../../constants";
import { useTitle } from "hookrouter";
import { Container, Row, Col } from "react-bootstrap";

const NotFound: React.FunctionComponent = () => {
  useTitle(`Page Not Found - ${Constants.title}`);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-md-10 col-lg-8">
          <h1 className="text-center">Not Found</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
