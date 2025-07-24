import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../../../CONFIG/api";
import { useAuth } from "../../../../context/AuthContext";

const BookingsCreate = ({ onBookingCreated, rooms }) => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [passengersCount, setPassengersCount] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Memoizar cabañas habilitadas (opcional si quieres mostrar todas)
  const enabledRooms = useMemo(() => rooms.filter((room) => room.isAvailable === true), [rooms]);

  // Cargar usuarios al montar el componente
  const loadUsers = useCallback(async () => {
    if (!auth?.token) {
      setError("Debes iniciar sesión para cargar datos.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const usersResponse = await axios.get(`${API_URL}/api/usuarios?pagina=0&limite=50`, {
        headers: { Authorization: `Bearer ${auth.token}` },
        timeout: 10000,
      });
      setUsers(usersResponse.data.usuarios || []);
      setError("");
    } catch (err) {
      setError("Error al cargar usuarios.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Consultar cabañas disponibles usando el endpoint de backend
  const fetchAvailableRooms = useCallback(async () => {
    if (!auth?.token) {
      setError("Debes iniciar sesión para buscar cabañas disponibles.");
      setAvailableRooms([]);
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setAvailableRooms([]);
      setError("");
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError("La fecha de check-out debe ser posterior a la de check-in.");
      setAvailableRooms([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/availability/search/rooms`, {
        params: {
          checkInDate,
          checkOutDate,
          guests: passengersCount,
        },
        headers: { Authorization: `Bearer ${auth.token}` },
        timeout: 10000,
      });
      setAvailableRooms(res.data || []);
      setError(res.data.length === 0 ? "No hay cabañas disponibles para esas fechas." : "");
    } catch (err) {
      setError("Error al buscar cabañas disponibles.");
      setAvailableRooms([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [auth?.token, checkInDate, checkOutDate, passengersCount]);

  useEffect(() => {
    fetchAvailableRooms();
  }, [fetchAvailableRooms]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!auth?.token) {
    setError("Debes iniciar sesión para crear una reserva.");
    return;
  }

  if (!checkInDate || !checkOutDate) {
    setError("Por favor selecciona las fechas de check-in y check-out.");
    return;
  }

  if (new Date(checkInDate) >= new Date(checkOutDate)) {
    setError("La fecha de check-out debe ser posterior a la de check-in.");
    return;
  }

  if (!roomId || !availableRooms.some((room) => room._id === roomId)) {
    setError("Por favor selecciona una cabaña válida.");
    return;
  }

  if (!userId) {
    setError("Por favor selecciona un usuario.");
    return;
  }

  const bookingData = {
    userId,
    roomId,
    checkInDate,
    checkOutDate,
    passengersCount,
  };

  try {
    const res = await axios.post(`${API_URL}/api/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${auth.token}` },
      
    });
    setSuccess("Reserva creada correctamente");
    // Reset form
    setUserId("");
    setRoomId("");
    setCheckInDate("");
    setCheckOutDate("");
    setPassengersCount(1);
    // Actualizar lista de cabañas disponibles
    fetchAvailableRooms();
    onBookingCreated(); // Notificar al padre para actualizar lista
  } catch (err) {
    console.error("Error al crear reserva:", err);
    const backendMessage = err.response?.data?.message;
    if (backendMessage) {
      setError(backendMessage);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Error al crear reserva");
    }
  }
};


  if (loading) return <p>Cargando datos...</p>;

  return (
    <div>
      <h4>Crear Reserva</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="checkInDate">
          <Form.Label>Fecha Check-In</Form.Label>
          <Form.Control
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
            aria-describedby="checkInDateHelp"
          />
          <Form.Text id="checkInDateHelp" muted>
            Selecciona la fecha de ingreso.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-2" controlId="checkOutDate">
          <Form.Label>Fecha Check-Out</Form.Label>
          <Form.Control
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
            min={checkInDate || new Date().toISOString().split("T")[0]}
            aria-describedby="checkOutDateHelp"
          />
          <Form.Text id="checkOutDateHelp" muted>
            Selecciona la fecha de salida.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-2" controlId="passengersCount">
          <Form.Label>Pasajeros</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={6}
            value={passengersCount}
            onChange={(e) => setPassengersCount(parseInt(e.target.value, 10) || 1)}
            required
            aria-describedby="passengersCountHelp"
          />
          <Form.Text id="passengersCountHelp" muted>
            Ingresa el número de pasajeros (1-6).
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-2" controlId="roomSelect">
          <Form.Label>Cabaña</Form.Label>
          <Form.Select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            disabled={!checkInDate || !checkOutDate || availableRooms.length === 0}
            aria-describedby="roomSelectHelp"
          >
            <option value="">Seleccionar</option>
            {availableRooms.length > 0 ? (
              availableRooms.map((room) => (
                <option key={room._id} value={room._id}>
                  N° {room.roomNumber} - {room.type}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {checkInDate && checkOutDate
                  ? "No hay cabañas disponibles"
                  : "Selecciona fechas para verificar disponibilidad"}
              </option>
            )}
          </Form.Select>
          <Form.Text id="roomSelectHelp" muted>
            Selecciona una cabaña disponible.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-2" controlId="userSelect">
          <Form.Label>Usuario</Form.Label>
          <Form.Select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            aria-describedby="userSelectHelp"
          >
            <option value="">Seleccionar</option>
            {users.length > 0 ? (
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
          <Form.Text id="userSelectHelp" muted>
            Selecciona un usuario para la reserva.
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary" className="mb-3 w-100">
          Crear
        </Button>
      </Form>
    </div>
  );
};

export default BookingsCreate;
