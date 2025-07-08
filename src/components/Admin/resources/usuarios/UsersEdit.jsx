import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const UsersEdit = ({ userId, auth, onUserUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Al cargar el componente, obtener los datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || "Error al obtener usuario");

        setFormData({
          name: data.usuario.name || "",
          apellido: data.usuario.apellido || "",
          password: "",
          role: data.usuario.role || "client",
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [userId, auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensaje || "Error al actualizar el usuario");
      }

      setSuccess("Usuario actualizado correctamente");
      if (onUserUpdated) onUserUpdated(); // actualiza la lista
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control name="name" value={formData.name} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control name="apellido" value={formData.apellido} onChange={handleChange} required />
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

      <Button variant="primary" type="submit">
        Guardar Cambios
      </Button>{" "}
      <Button variant="secondary" onClick={onCancel}>
        Cancelar
      </Button>
    </Form>
  );
};

export default UsersEdit;
