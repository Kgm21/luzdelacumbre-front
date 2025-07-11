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
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales de la reserva
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
      setLoading(false);
    }
  }, [bookingData]);

  // Cargar habitaciones y usuarios
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error("Error al cargar las habitaciones");
        const data = await res.json();
        setRooms(data.data || []);
      } catch (err) {
        setError("No se pudieron cargar las habitaciones.");
        console.error("Error al cargar habitaciones:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/usuarios?pagina=0&limite=50`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error("Error al cargar los usuarios");
        const data = await res.json();
        setUsers(data.usuarios || []);
      } catch (err) {
        setError("No se pudieron cargar los usuarios.");
        console.error("Error al cargar usuarios:", err);
      }
    };

    Promise.all([fetchRooms(), fetchUsers()]).finally(() => setLoading(false));
  }, [auth.token]);

  // Ajustar passengersCount cuando cambia roomId
  useEffect(() => {
    const selectedRoom = rooms.find((r) => String(r._id) === String(formData.roomId));
    if (selectedRoom && selectedRoom.capacity && formData.passengersCount > selectedRoom.capacity) {
      setFormData((prev) => ({
        ...prev,
        passengersCount: Math.min(prev.passengersCount, selectedRoom.capacity),
      }));
    }
  }, [formData.roomId, rooms]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "passengersCount" ? Number(value) : value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar que se haya seleccionado una habitación
    const selectedRoom = rooms.find((r) => String(r._id) === String(formData.roomId));
    if (!selectedRoom || !selectedRoom.capacity) {
      setError("Por favor, selecciona una habitación válida con capacidad definida.");
      return;
    }

    // Validar la cantidad de pasajeros
    const capacidadMaxima = Number(selectedRoom.capacity);
    const pasajeros = Number(formData.passengersCount);
    if (!pasajeros || pasajeros < 1 || pasajeros > capacidadMaxima) {
      setError(`La cantidad de pasajeros debe estar entre 1 y ${capacidadMaxima}.`);
      return;
    }

    // Validar fechas
    if (!formData.checkInDate || !formData.checkOutDate || new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      setError("La fecha de check-out debe ser posterior a la de check-in.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...formData,
          passengersCount: Number(formData.passengersCount), // Asegurar que sea número
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          const messages = Object.values(data.errors).map((errObj) => errObj.msg);
          throw new Error(messages.join("\n"));
        }
        throw new Error(data.message || "Error al actualizar la reserva");
      }

      setSuccess("Reserva actualizada correctamente");
      setTimeout(() => {
        setSuccess("");
        onBookingUpdated();
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error("Error en la solicitud:", err.message);
    }
  };

  // Obtener la capacidad máxima de la habitación seleccionada
  const selectedRoom = rooms.find((r) => String(r._id) === String(formData.roomId));
  const maxCapacity = selectedRoom && selectedRoom.capacity ? Number(selectedRoom.capacity) : null;

  if (loading || !bookingData) {
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
          <Form.Select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
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
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                N° {room.roomNumber} - {room.type} (Capacidad: {room.capacity || "No definida"})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Fecha Check-In</Form.Label>
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
            value={formData.passengersCount}
            onChange={handleChange}
            required
            min="1"
            max={maxCapacity || undefined}
            disabled={!maxCapacity}
          />
          {selectedRoom && maxCapacity ? (
            <Form.Text className="text-muted">
              Capacidad máxima: {maxCapacity} pasajeros
            </Form.Text>
          ) : (
            <Form.Text className="text-muted">
              Selecciona una habitación para definir la capacidad
            </Form.Text>
          )}
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

        <Button type="submit" variant="primary" className="mb-3 w-100" disabled={!maxCapacity}>
          Guardar
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          className="mb-3 w-100"
        >
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default BookingsEdit;