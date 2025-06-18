import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './navbar.css';

function NavigateApp({ usuarioAutenticado, setUsuarioAutenticado }) {
    const navigate = useNavigate();
    const [usuarioRol, setUsuarioRol] = useState(localStorage.getItem("role") || null);

    useEffect(() => {
        const rolGuardado = localStorage.getItem("role");
        if (rolGuardado !== usuarioRol) {
            setUsuarioRol(rolGuardado);
        }
    }, [usuarioAutenticado]);

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("role");
        setUsuarioAutenticado(false);
        setUsuarioRol(null);
        navigate("/");
    };

    return (
        <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-custom">
            <Container id="container">
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        width="160"
                        height="160"
                        className="navbar-brand-logo"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/160x160/65523C/FFFFFF?text=Logo';
                        }}
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto me-4">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/cabanias" className="nav-link-custom">Cabañas</Nav.Link>
                        <Nav.Link as={Link} to="/galeria" className="nav-link-custom">Galería</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="nav-link-custom">Nosotros</Nav.Link>
                        <Nav.Link as={Link} to="/reservas" className="nav-link-custom">Reservas</Nav.Link>

                        {usuarioAutenticado && usuarioRol === "admin" && (
                            <Nav.Link as={Link} to="/adminPage" className="nav-link-custom">
                                Administración
                            </Nav.Link>
                        )}

                        {usuarioAutenticado ? (
                            <Nav.Link onClick={cerrarSesion} className="nav-link-custom">
                                Cerrar Sesión
                            </Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login" className="nav-link-custom">
                                Login
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigateApp;
