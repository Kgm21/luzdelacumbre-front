import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/auth.css";
import {API_URL} from '../CONFIG/api';

const LoginPage = ({ setUsuarioAutenticado }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Usando la URL hardcodeada
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
        throw new Error(errorData.message || "Credenciales inválidas");
      }

      const data = await response.json();
      login(data.token, data.user.role);
      setUsuarioAutenticado(true);
      navigate(data.user.role === "admin" ? "/administracion" : "/home");
    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.message);
    }
  };

  return (
    <Container className="auth-wrapper">
      <Row className="d-flex justify-content-start">
        <Col md={4}>
          <div className="form-container">
            <h2 className="text-center">Iniciar Sesión</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingrese su email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingrese su contraseña"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>
            <div className="text-center mt-3">
              <p className="form-label">
                ¿No tienes cuenta?{" "}
                <Link to="/registro" className="text-decoration-none">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;