import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";
import { useAuth } from "../../../../context/AuthContext";

const RoomsCreate = ({ onRoomCreated }) => {
  const { auth } = useAuth();
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("cabana");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!auth?.token) {
      setError("Debes iniciar sesión para crear una habitación.");
      return;
    }

    // Validaciones básicas
    if (!roomNumber.trim() || !price || !capacity) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedCapacity = parseInt(capacity, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("El precio debe ser un número mayor a cero.");
      return;
    }

    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      setError("La capacidad debe ser un número mayor a cero.");
      return;
    }

    try {
      const roomRes = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          roomNumber: roomNumber.trim(),
          type: type.trim(),
          price: parsedPrice,
          description: description.trim(),
          capacity: parsedCapacity,
          isAvailable,
        }),
      });

      const roomData = await roomRes.json();

      if (!roomRes.ok) {
        throw new Error(roomData.message || "Error al crear la habitación.");
      }

      setSuccess("Habitación creada correctamente.");
      setRoomNumber("");
      setType("cabana");
      setPrice("");
      setDescription("");
      setCapacity("");
      setIsAvailable(true);

      if (onRoomCreated) await onRoomCreated();
    } catch (err) {
      console.error("Error al crear la habitación:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h4>Crear Habitación</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="roomNumber">
          <Form.Label>Número de Habitación</Form.Label>
          <Form.Control
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="type">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="price">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="description">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="capacity">
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="isAvailable">
          <Form.Check
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            label="¿Disponible?"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Crear
        </Button>
      </Form>
    </div>
  );
};

export default RoomsCreate;


