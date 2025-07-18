import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./navbar.css";

const NavigateApp = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  console.log("auth en navbar:", auth);
  console.log("logout es función?", typeof logout === 'function');

  const handleLogout = () => {
    console.log("handleLogout llamado");
    if (typeof logout === 'function') {
      logout();
      navigate("/");
    } else {
      console.error("logout no es una función");
    } 
  };

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom">
      <Container id="container">
        <Navbar.Brand className="navbar-brand-custom">
          <img
            src="/logo-removebg-preview.png"
            alt="Logo"
            width="160"
            height="160"
            className="navbar-brand-logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto me-6">
            <Nav.Link as={Link} to="/" className="nav-link-custom">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/cabanias" className="nav-link-custom">Cabañas</Nav.Link>
            <Nav.Link as={Link} to="/galery" className="nav-link-custom">Galería de imágenes</Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">Nosotros</Nav.Link>
            <Nav.Link as={Link} to="/contactos" className="nav-link-custom">Contacto</Nav.Link>
            <Nav.Link as={Link} to="/reservas" className="nav-link-custom">Reservas</Nav.Link>

            {/* "Mis Reservas" siempre visible */}
            <Nav.Link as={Link} to="/mis-reservas" className="nav-link-custom">
              Mis Reservas
            </Nav.Link>

            {auth?.isAuthenticated && auth.role === "admin" && (
              <Nav.Link as={Link} to="/administracion" className="nav-link-custom">
                Administración
              </Nav.Link>
            )}

            {auth?.isAuthenticated ? (
              <Nav.Link onClick={handleLogout} className="nav-link-custom">
                Cerrar Sesión
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className="nav-link-custom" data-special>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigateApp;

