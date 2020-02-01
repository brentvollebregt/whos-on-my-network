import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";

interface PageSizeWrapperProps {
  children: ReactNode;
}

const PageSizeWrapper: React.FunctionComponent<PageSizeWrapperProps> = ({
  children
}) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-md-10 col-lg-9">{children}</Col>
      </Row>
    </Container>
  );
};

export default PageSizeWrapper;
