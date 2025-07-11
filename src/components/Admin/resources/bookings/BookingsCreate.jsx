import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const BookingsCreate = ({ auth, onBookingCreated }) => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    passengersCount: 1,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchUsers();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      setRooms(data.data);
    } catch (err) {
      console.error("Error al cargar habitaciones:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios?pagina=0&limite=50`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      setUsers(data.usuarios);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev,[name]: name === "passengersCount" ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log(formData)

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear reserva");

      setSuccess("Reserva creada correctamente");
      setFormData({
        userId: "",
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        passengersCount: 1,
      });

      onBookingCreated();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h4>Crear Reserva</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Usuario</Form.Label>
          <Form.Select name="userId" value={formData.userId} onChange={handleChange} required>
            <option value="">Seleccionar</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Habitación</Form.Label>
          <Form.Select name="roomId" value={formData.roomId} onChange={handleChange} required>
            <option value="">Seleccionar</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>N° {room.roomNumber} - {room.type}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Fecha Check-In</Form.Label>
          <Form.Control type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Fecha Check-Out</Form.Label>
          <Form.Control type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Pasajeros</Form.Label>
          <Form.Control type="number" name="passengersCount" min={1} max={6} value={formData.passengersCount} onChange={handleChange} required />
        </Form.Group>

        <Button type="submit" variant="primary" className="mb-3 w-100">Crear</Button>
      </Form>
    </div>
  );
};

export default BookingsCreate;