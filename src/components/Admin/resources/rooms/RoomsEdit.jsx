import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const RoomsEdit = ({ auth, roomId, onRoomUpdated }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("cabana");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [photos, setPhotos] = useState(null);
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
        setType("cabana");
        setPrice(data.price || 0);
        setDescription(data.description || "");
        setCapacity(data.capacity || 1);
        setIsAvailable(data.isAvailable !== undefined ? data.isAvailable : true);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoom();
  }, [roomId, auth.token]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const body = {
    roomNumber,
    type,
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
    if (!res.ok) throw new Error(data.message || "Error al actualizar la habitación");

    setSuccess("Habitación actualizada correctamente");
    if (onRoomUpdated) onRoomUpdated();
  } catch (err) {
    setError(err.message);
  }
};

  const handleImageChange = (e) => {
    setPhotos(e.target.files);
  };

  return (
    <div>
      <h4>Editar Habitación</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group>
          <Form.Label>Número de Habitación</Form.Label>
          <Form.Control
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Disponible</Form.Label>
          <Form.Check
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            label="¿Disponible?"
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
