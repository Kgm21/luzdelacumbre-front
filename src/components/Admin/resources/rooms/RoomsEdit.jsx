import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const RoomsEdit = ({ roomId, auth, onRoomUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    roomNumber: "",
    description: "",
    price: "",
    capacity: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!roomId) {
      setError("No se proporcionó ID de habitación");
      setLoading(false);
      return;
    }

    if (!auth?.token) {
      setError("Debes iniciar sesión para editar habitaciones.");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || `Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const room = data.room; // ✅ accedemos a room
        setFormData({
          roomNumber: room.roomNumber || "",
          description: room.description || "",
          price: room.price || "",
          capacity: room.capacity || 1,
        });
      } catch (err) {
        setError(err.message || "Error al obtener habitación");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, auth?.token]);

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
      const resp = await fetch(`${API_URL}/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const data = await resp.json();
        if (resp.status === 400) {
          throw new Error(data.message || "Datos inválidos. Verificá los campos.");
        } else if (resp.status === 401) {
          throw new Error("No estás autenticado. Iniciá sesión para continuar.");
        } else if (resp.status === 403) {
          throw new Error("No tenés permiso para editar esta habitación.");
        } else if (resp.status === 404) {
          throw new Error("Habitación no encontrada.");
        } else {
          throw new Error(data.message || `Error del servidor (${resp.status})`);
        }
      }

      const data = await resp.json();
      setSuccess("Habitación actualizada correctamente.");
      onRoomUpdated(data.room);
    } catch (err) {
      setError(err.message || "Error al actualizar habitación");
    }
  };

  if (loading) return <p>Cargando datos de la habitación...</p>;

  return (
    <Card
      style={{ minWidth: "300px", maxWidth: "500px" }}
      className="p-3 shadow-sm ms-md-4 mt-3 mt-md-0"
    >
      <h5>Editar Habitación</h5>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Número de cabaña</Form.Label>
          <Form.Control
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            name="description"
            value={formData.description}
            onChange={handleChange}
            as="textarea"
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            min="0"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            type="number"
            min="1"
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit">
            Guardar
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default RoomsEdit;
 





