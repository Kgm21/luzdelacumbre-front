import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../../../CONFIG/api";
import { useAuth } from "../../../../context/AuthContext";

const BookingsCreate = ({ onBookingCreated, rooms }) => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [passengersCount, setPassengersCount] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Memoizar cabañas habilitadas
  const enabledRooms = useMemo(() => rooms.filter((room) => room.isAvailable === true), [rooms]);

  // Memoizar la función de carga de datos
  const loadData = useCallback(async () => {
    if (!auth?.token) {
      setError("Debes iniciar sesión para cargar datos.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [usersResponse, bookingsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/usuarios?pagina=0&limite=50`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          timeout: 10000,
        }).catch(() => ({ data: { usuarios: [] } })),
        axios.get(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          timeout: 10000,
        }).catch(() => ({ data: { data: [] } })),
      ]);

      setUsers(usersResponse.data.usuarios || []);
      setBookings(bookingsResponse.data.data || []);
      console.log("Usuarios cargados:", usersResponse.data.usuarios);
      console.log("Reservas cargadas:", bookingsResponse.data.data);
    } catch (err) {
      setError("Error al cargar datos. Por favor selecciona fechas para verificar disponibilidad.");
      console.error("Error en loadData:", err);
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    console.log("Cabañas recibidas:", rooms);
    console.log("Cabañas habilitadas:", enabledRooms);
    loadData();
  }, [loadData, enabledRooms]);

  // Filtrar cabañas disponibles según fechas
  useEffect(() => {
    console.log("useEffect de filtrado ejecutado");
    if (!checkInDate || !checkOutDate) {
      console.log("Sin fechas seleccionadas, esperando fechas...");
      setAvailableRooms([]);
      setError("");
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError("La fecha de check-out debe ser posterior a la de check-in.");
      setAvailableRooms([]);
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Normalizar fechas a medianoche para evitar problemas con horas
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);

    const filteredRooms = enabledRooms.filter((room) => {
      const conflictingBookings = bookings.filter((booking) => {
        const bookingCheckIn = new Date(booking.checkInDate);
        const bookingCheckOut = new Date(booking.checkOutDate);
        bookingCheckIn.setHours(0, 0, 0, 0);
        bookingCheckOut.setHours(0, 0, 0, 0);
        return (
          booking.roomId === room._id &&
          checkIn < bookingCheckOut &&
          checkOut > bookingCheckIn
        );
      });
      return conflictingBookings.length === 0;
    });

    console.log("Cabañas disponibles filtradas:", filteredRooms);
    setAvailableRooms(filteredRooms);
    if (filteredRooms.length === 0) {
      setError("No hay cabañas disponibles para las fechas seleccionadas.");
    } else {
      setError("");
    }
  }, [checkInDate, checkOutDate, enabledRooms, bookings]);

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
        timeout: 10000,
      });
      console.log("Reserva creada:", res.data);
      setSuccess("Reserva creada correctamente");
      setUserId("");
      setRoomId("");
      setCheckInDate("");
      setCheckOutDate("");
      setPassengersCount(1);
      await loadData(); // Recargar datos para actualizar availableRooms
      onBookingCreated(); // Notificar al padre para actualizar BookingsList
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear reserva");
      console.error("Error al crear reserva:", err);
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

        <Form.Group className="mb-2" controlId="roomSelect">
          <Form.Label>Cabaña</Form.Label>
          <Form.Select
            value={roomId}
            onChange={(e) => {
              console.log("Cabaña seleccionada:", e.target.value);
              setRoomId(e.target.value);
            }}
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

        <Button type="submit" variant="primary" className="mb-3 w-100">
          Crear
        </Button>
      </Form>
    </div>
  );
};

export default BookingsCreate;