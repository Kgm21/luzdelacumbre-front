import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const UsersCreate = ({ onCancel, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensaje || "Error al crear el usuario");
      }

      setSuccess("Usuario creado correctamente");
      onCreated(); // vuelve a la lista
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
        <Form.Label>Email</Form.Label>
        <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control name="password" type="password" value={formData.password} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Rol</Form.Label>
        <Form.Select name="role" value={formData.role} onChange={handleChange}>
          <option value="client">Cliente</option>
          <option value="admin">Administrador</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        Crear
      </Button>{" "}
      <Button variant="secondary" onClick={onCancel}>
        Cancelar
      </Button>
    </Form>
  );
};

export default UsersCreate;
