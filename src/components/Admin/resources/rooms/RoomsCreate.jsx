import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const RoomsCreate = ({ auth, onRoomCreated }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("cabana");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [photos, setPhotos] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("roomNumber", roomNumber);
    formData.append("type", type);
    formData.append("price", Number(price));
    formData.append("description", description);
    formData.append("capacity", Number(capacity));
    formData.append("isAvailable", String(isAvailable));

    if (photos) {
      Array.from(photos).forEach((photo) => {
        formData.append("photos", photo);
      });
    }

    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear la habitación");

      setSuccess("Habitación creada correctamente");
      setRoomNumber("");
      setType("cabana");
      setPrice(0);
      setDescription("");
      setCapacity(1);
      setIsAvailable(true);
      setPhotos(null);

      if (onRoomCreated) onRoomCreated();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (e) => {
    setPhotos(e.target.files);
  };

  return (
    <div>
      <h4>Crear Habitación</h4>
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
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
          <Form.Label>Imágenes</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleImageChange}
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
          Crear
        </Button>
      </Form>
    </div>
  );
};

export default RoomsCreate;
