import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../../../CONFIG/api";
import { useAuth } from "../../../../context/AuthContext";

const BookingsCreate = ({ onBookingCreated, rooms }) => {
  const { auth } = useAuth(); // Usar el hook useAuth en lugar de la prop auth
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!auth?.token) {
        setError("Debes iniciar sesión para cargar datos.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await fetchUsers();
      } catch (err) {
        setError("Error al cargar datos iniciales");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [auth?.token]); // Refetch si auth.token cambia

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/usuarios?pagina=0&limite=50`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log("🔍 [BookingsCreate] Users response:", res.data);
      setUsers(res.data.usuarios || res.data || []);
    } catch (err) {
      console.error("🔍 [BookingsCreate] Error al cargar usuarios:", err);
      setError(err.response?.data?.message || "Error al cargar usuarios");
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "passengersCount" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.token) {
      setError("Debes iniciar sesión para crear una reserva.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_URL}/api/bookings`, formData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log("🔍 [BookingsCreate] Booking created:", res.data);
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
      console.error("🔍 [BookingsCreate] Error al crear reserva:", err);
      setError(err.response?.data?.message || "Error al crear reserva");
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      <h4>Crear Reserva</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Usuario</Form.Label>
          <Form.Select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))
            ) : (
              <option value="" disabled>
                No hay usuarios disponibles
              </option>
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Habitación</Form.Label>
          <Form.Select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            {Array.isArray(rooms) && rooms.length > 0 ? (
              rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  N° {room.roomNumber} - {room.type}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No hay habitaciones disponibles
              </option>
            )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Fecha Check-In</Form.Label>
          <Form.Control
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Fecha Check-Out</Form.Label>
          <Form.Control
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Pasajeros</Form.Label>
          <Form.Control
            type="number"
            name="passengersCount"
            min={1}
            max={6}
            value={formData.passengersCount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mb-3 w-100" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </Button>
      </Form>
    </div>
  );
};

export default BookingsCreate;