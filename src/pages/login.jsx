import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/auth.css";

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
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Credenciales inválidas");
      const data = await response.json();
      login(data.token, data.user.role); // Guardar token y rol en el contexto
      setUsuarioAutenticado(true); // Actualizar estado para el navbar
      navigate(data.user.role === "admin" ? "/administracion" : "/home");
    } catch (err) {
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