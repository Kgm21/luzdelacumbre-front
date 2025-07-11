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
  {/* Botones visibles para todos */}
  <Nav.Link as={Link} to="/" className="nav-link-custom">Inicio</Nav.Link>
  <Nav.Link as={Link} to="/error404" className="nav-link-custom">Cabañas</Nav.Link>
  <Nav.Link as={Link} to="/galery" className="nav-link-custom">Galeria de imagenes</Nav.Link>
  <Nav.Link as={Link} to="/about" className="nav-link-custom">Nosotros</Nav.Link>
  <Nav.Link as={Link} to="/contactos" className="nav-link-custom">Contacto</Nav.Link>
 <Nav.Link as={Link} to="/reservas" className="nav-link-custom">Reservas</Nav.Link>

  {/* Botón Administración solo para admin autenticado */}
  {auth.isAuthenticated && auth.role === "admin" && (
    <Nav.Link as={Link} to="/administracion" className="nav-link-custom">
      Administración
    </Nav.Link>
  )}

  {/* Si está autenticado, mostrar botón cerrar sesión */}
  {auth.isAuthenticated ? (
    <Nav.Link onClick={handleLogout} className="nav-link-custom">
      Cerrar Sesión
    </Nav.Link>
  ) : (
    // Si no está autenticado, mostrar botón Login
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
