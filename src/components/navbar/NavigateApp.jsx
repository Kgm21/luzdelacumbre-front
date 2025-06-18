import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de tener AuthContext
import "./navbar.css";

const NavigateApp = ({ setUsuarioAutenticado }) => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUsuarioAutenticado(false);
    navigate("/");
  };

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom">
      <Container id="container">
        <Navbar.Brand className="navbar-brand-custom">
          <img
            src="/logoLuzdelaCumbre.jpeg"
            alt="Logo"
            width="160"
            height="160"
            className="navbar-brand-logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto me-6">
            {auth.isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-custom">
                  Inicio
                </Nav.Link>
                <Nav.Link as={Link} to="/reservas" className="nav-link-custom">
                  Cabañas
                </Nav.Link>
                <Nav.Link as={Link} to="/galeria" className="nav-link-custom">
                  Galería
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="nav-link-custom">
                  Nosotros
                </Nav.Link>
                <Nav.Link as={Link} to="/contactos" className="nav-link-custom">
                  Contacto
                </Nav.Link>
                {auth.role === "admin" && (
                  <Nav.Link
                    as={Link}
                    to="/administracion"
                    className="nav-link-custom"
                  >
                    Administración
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout} className="nav-link-custom">
                  Cerrar Sesión
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-custom">
                  Inicio
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="nav-link-custom">
                  Nosotros
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="nav-link-custom"
                  data-special
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigateApp;