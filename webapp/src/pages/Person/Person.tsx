import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Constants from "../../constants";
import { useTitle } from "hookrouter";

interface PersonProps {
  id: number;
}

const Person: React.FunctionComponent<PersonProps> = ({ id }) => {
  useTitle(`Person - ${Constants.title}`);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-md-10 col-lg-8">
          <h1 className="text-center">Person ({id}): Temporary</h1>
          <div style={{ background: "grey" }}>Person details</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Person;
