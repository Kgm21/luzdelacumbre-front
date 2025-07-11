import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const RoomsEdit = ({ auth, roomId, onRoomUpdated }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al cargar la habitación");

        setRoomNumber(data.roomNumber || "");
        setPrice(data.price || 0);
        setDescription(data.description || "");
        setCapacity(data.capacity || 1);
        setIsAvailable(data.isAvailable ?? true);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchRoom();
  }, [roomId, auth.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!roomNumber || price <= 0 || capacity < 1) {
      setError("Por favor completa todos los campos requeridos con valores válidos");
      return;
    }

    const body = {
      roomNumber,
      price: Number(price),
      description,
      capacity: Number(capacity),
      isAvailable,
    };

    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          const messages = Object.values(data.errors).map((errObj) => errObj.msg);
          throw new Error(messages.join("\n"));
        }
        throw new Error(data.message || "Error al actualizar la habitación");
      }

      setSuccess("Habitación actualizada correctamente");
      if (onRoomUpdated) onRoomUpdated(data.room);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h4>Editar Habitación</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Número de Habitación</Form.Label>
          <Form.Control
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min="0"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
            min="1"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>¿Disponible?</Form.Label>
          <Form.Check
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            label="Disponible"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Actualizar
        </Button>
      </Form>
    </div>
  );
};

export default RoomsEdit;