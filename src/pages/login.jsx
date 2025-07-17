import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/auth.css";
import { API_URL } from "../CONFIG/api";

// ✅ Validación con YUP
const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email requerido"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👉 para saber desde dónde vino
  const { login, validateToken } = useAuth();
  const [error, setError] = React.useState("");
  const mensajeRedireccion = location.state?.message || ""; // 👈 mensaje opcional

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
        throw new Error(errorData.message || "Credenciales inválidas");
      }

      const result = await response.json();

      if (!result.token || !result.user?.id) {
        throw new Error("Respuesta del servidor incompleta");
      }

      const validation = await validateToken(result.token);
      if (!validation.valid) {
        throw new Error("Token inválido recibido del servidor");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.user.id);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("apellido", JSON.stringify(result.apellido));

      login(result.token, result.user.role);

      // ✅ Redirige a la ruta anterior si la hay
      const destino = location.state?.from?.pathname || "/reservas";
      navigate(destino, { replace: true });
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

            {/* ✅ Mensaje de redirección desde ruta protegida */}
            {mensajeRedireccion && (
              <Alert variant="warning">{mensajeRedireccion}</Alert>
            )}

            {error && (
              <Alert variant="danger">{error}</Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su email"
                  {...register("email")}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  {...register("password")}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
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
