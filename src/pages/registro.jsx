import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./styles/auth.css"; // Asegúrate de crear este archivo para estilos
import { API_URL } from '../CONFIG/api'; // Importa la constante


const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", 
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState(""); // Para errores del backend

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};

    // Nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    // Apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    } else if (formData.apellido.length < 3) {
      newErrors.apellido = "El apellido debe tener al menos 3 caracteres";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Confirmar contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    setServerError(""); // Limpiar errores del servidor
    setErrors({});      // Limpiar errores de campos

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
        }),
      });

    if (!response.ok) {
  const errorData = await response.json();
  console.log("Error recibido del backend:", errorData); // mantener para debug

  // Verificamos si viene el campo 'errors'
  if (errorData.errors) {
    const errors = errorData.errors;

    // Transformamos en errores individuales por campo
    const formattedErrors = {};
    for (const key in errors) {
      formattedErrors[key] = errors[key].msg;
    }

    setErrors(formattedErrors); // esto carga los errores por campo en el formulario
  } else {
    setServerError(errorData.message || 'Error al registrar');
  }

  return;
}


      const data = await response.json();
      console.log("Respuesta del backend:", data);

      setSuccess(true);
      setFormData({
        name: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate("/reservas"), 2000);
    } catch (err) {
      setServerError(err.message || 'Error al conectar con el servidor');
      console.error('Error en registro:', err);
    }
  }
};


  return (
    <Container className="auth-wrapper">
      <Row className="d-flex justify-content-start">
        <Col md={4}>
          <div className="form-container">
            <h2 className="text-center">Registro</h2>
            {success && (
              <Alert variant="success">
                ¡Registro exitoso! Serás redirigido al inicio de sesión.
              </Alert>
            )}
            {serverError && (
              <Alert variant="danger">{serverError}</Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formApellido">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  isInvalid={!!errors.apellido}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.apellido}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirme su contraseña"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Registrarse
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p className="form-label">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-decoration-none">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;