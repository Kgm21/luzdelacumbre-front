import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const BookingsEdit = ({ bookingData, onBookingUpdated, onCancel, auth }) => {
  const [formData, setFormData] = useState({
    roomId: bookingData?.roomId || "",
    checkInDate: bookingData?.checkInDate?.slice(0, 10) || "",
    checkOutDate: bookingData?.checkOutDate?.slice(0, 10) || "",
    passengersCount: bookingData?.passengersCount || 1,
    status: bookingData?.status || "confirmed",
  });

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Carga de habitaciones habilitadas
  useEffect(() => {
    if (!auth?.token) return;

    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error("Error al cargar las habitaciones");
        const data = await res.json();
        // Filtrar solo las habitaciones habilitadas
        const availableRooms = (data.rooms || []).filter(r => r.isAvailable);
        setRooms(availableRooms);
      } catch (err) {
        setError("No se pudieron cargar las habitaciones.");
        console.error("Error al cargar habitaciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [auth?.token]);

  // Ajusta pasajeros si supera capacidad
  useEffect(() => {
    const selected = rooms.find(r => String(r._id) === String(formData.roomId));
    if (selected && formData.passengersCount > selected.capacity) {
      setFormData(prev => ({
        ...prev,
        passengersCount: selected.capacity
      }));
    }
  }, [formData.roomId, rooms]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "passengersCount" ? Number(value) : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones básicas
    const selected = rooms.find(r => String(r._id) === String(formData.roomId));
    if (!selected) {
      setError("Selecciona una habitación válida.");
      return;
    }
    if (
      new Date(formData.checkOutDate) <= new Date(formData.checkInDate)
    ) {
      setError("La fecha de check-out debe ser posterior al check-in.");
      return;
    }
    if (
      formData.passengersCount < 1 ||
      formData.passengersCount > selected.capacity
    ) {
      setError(`La cantidad de pasajeros debe estar entre 1 y ${selected.capacity}.`);
      return;
    }

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
      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar la reserva");
      }
      setSuccess("Reserva actualizada correctamente");
      setTimeout(() => onBookingUpdated(), 1500);
    } catch (err) {
      setError(err.message);
      console.error("Error en la solicitud:", err);
    }
  };

  if (!auth?.token) return <p>Cargando autenticación...</p>;
  if (loading) return <p>Cargando habitaciones...</p>;

  const maxCapacity = rooms.find(r => String(r._id) === String(formData.roomId))?.capacity;

  return (
    <div>
      <h4>Editar Reserva</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            value={bookingData.userId?.name || "-"}
            readOnly
          />
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
            {rooms.map(room => (
              <option key={room._id} value={room._id}>
                N° {room.roomNumber} – {room.type} (Capacidad: {room.capacity})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Check‑In</Form.Label>
          <Form.Control
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 10)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Check‑Out</Form.Label>
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
            value={formData.passengersCount}
            onChange={handleChange}
            min="1"
            max={maxCapacity || 1}
            required
          />
          <Form.Text className="text-muted">
            Capacidad máxima: {maxCapacity ?? "—"}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100 mb-2">
          Guardar
        </Button>
        <Button variant="secondary" onClick={onCancel} className="w-100">
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default BookingsEdit;

