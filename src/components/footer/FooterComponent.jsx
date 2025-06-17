import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { BsFacebook, BsTwitter, BsInstagram } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./footer.css";

export const FooterComponent = () => {
  return (
    <footer className="footer-custom">
      <Container fluid>
        <Row className="align-items-center text-center text-md-start">
          {/* Logo */}
          <Col lg={4} md={4} sm={12} className="mb-3 mb-md-0 d-flex justify-content-center">
            <img src="/img1.png" alt="" className="footer-logo" />
          </Col>

          <Col lg={4} md={4} sm={12} className="mb-3 mb-md-0 text-center">
            <Nav className="d-flex flex-column align-items-center">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/nosotros" className="nav-link-custom">
                Nosotros
              </Nav.Link>
              <Nav.Link as={Link} to="/error" className="nav-link-custom">
                Contacto
              </Nav.Link>
            </Nav>
          </Col>

          {/* Redes sociales */}
          <Col lg={4} md={4} sm={12} className="text-center">
            <h5>Síguenos</h5>
            <BsFacebook size={25} color="#1877F2" className="me-3" />
            <BsTwitter size={25} color="#1DA1F2" className="me-3" />
            <BsInstagram size={25} color="#E1306C" />
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0 mt-3">© 2025 DalePLay. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default FooterComponent;