import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const BookingsEdit = ({ auth, bookingData, onBookingUpdated, onCancel }) => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    passengersCount: 1,
    status: "confirmed",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (bookingData) {
      setFormData({
        userId: bookingData.userId?._id || "",
        roomId: bookingData.roomId?._id || "",
        checkInDate: bookingData.checkInDate ? bookingData.checkInDate.slice(0, 10) : "",
        checkOutDate: bookingData.checkOutDate ? bookingData.checkOutDate.slice(0, 10) : "",
        passengersCount: bookingData.passengersCount || 1,
        status: bookingData.status || "confirmed",
         });
    }
  }, [bookingData]);
  
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar reserva");

      setSuccess("Reserva actualizada correctamente");
      onBookingUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!bookingData) {
  return <div>Cargando datos de la reserva...</div>;
}

  return (
    <div>
      <h4>Editar Reserva</h4>
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

        <Form.Group className="mb-2">
          <Form.Label>Estado</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleChange} required>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" className="mb-3 w-100" >Guardar</Button>{' '}
        <Button variant="secondary" onClick={onCancel} className="mb-3 w-100">Cancelar</Button>
      </Form>
    </div>
  );
};

export default BookingsEdit;
