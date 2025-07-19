import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";
import { useAuth } from "../../../../context/AuthContext";

const UsersEdit = ({ userId, onUserUpdated, onCancel }) => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth?.token) {
        setError("Debes iniciar sesión para editar usuarios.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/usuarios/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        const data = await res.json();
        setFormData({
          name: data.usuario?.name || "",
          apellido: data.usuario?.apellido || "",
          password: "",
          role: data.usuario?.role || "client",
        });
      } catch (err) {
        console.error("[UsersEdit] fetchUser error:", err);
        setError(err.message || "Error al obtener usuario");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
    else {
      setError("No se proporcionó ID de usuario");
      setLoading(false);
    }
  }, [userId, auth?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!auth?.token) {
      setError("No estás autenticado.");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text);
      }

      const data = await resp.json();
      console.log("✅ Usuario actualizado:", data);
      setSuccess("Usuario actualizado correctamente.");
      if (onUserUpdated) onUserUpdated(data.usuario);
    } catch (err) {
      console.error("🔍 [UsersEdit] handleSubmit error:", err);
      setError(err.message || "Error al actualizar usuario");
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;

  return (
    <Card style={{ minWidth: "300px", maxWidth: "500px" }} className="p-3 shadow-sm ms-md-4 mt-3 mt-md-0">
      <h5>Editar Usuario</h5>

      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña (opcional)</Form.Label>
          <Form.Control
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Dejar en blanco para no cambiar"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange}>
            <option value="client">Cliente</option>
            <option value="admin">Administrador</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit">Guardar</Button>
          <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        </div>
      </Form>
    </Card>
  );
};

export default UsersEdit;

