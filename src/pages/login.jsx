import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";
import { API_URL } from '../CONFIG/api';


const LoginPage = ({ setUsuarioAutenticado }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      if (data.message === 'Inicio de sesión exitoso') {
        if (setUsuarioAutenticado) {
          setUsuarioAutenticado(true);
        }

        // Guardar token en localStorage o estado global según tu arquitectura
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("usuario", data.user.email);

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }

        setEmail("");
        setPassword("");
      } else {
        throw new Error('Error de autenticación');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
      console.error('Error en login:', err);
    }
  };

  return (
    <Container className="container">
      <Row className="d-flex justify-content-start">
        <Col md={4}>
          <div className="form-container">
            <h2 className="text-center">Iniciar Sesión</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>

            {error && <p style={{ color: "red" }}>{error}</p>}

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
