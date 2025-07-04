import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

// Función para formatear fecha UTC con mes en español
const formatDateFromUTC = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} de ${month} de ${year}`;
};

// Validar solapamiento de fechas
const validarDisponibilidad = (roomId, checkIn, checkOut, reservas, idReservaActual) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  for (const reserva of reservas) {
    if (reserva._id === idReservaActual) continue;
    if (reserva.roomId?._id === roomId) {
      const reservaCheckIn = new Date(reserva.checkInDate);
      const reservaCheckOut = new Date(reserva.checkOutDate);
      if (checkInDate < reservaCheckOut && checkOutDate > reservaCheckIn) {
        return false;
      }
    }
  }
  return true;
};

const ReservationsPanel = ({ API_URL, auth }) => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const [mostrarPasadas, setMostrarPasadas] = useState(false);

  useEffect(() => {
    if (!auth?.token) return;
    fetchRooms();
    fetchBookings();
  }, [auth?.token, API_URL]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar las reservas.");
      const data = await res.json();
      setBookings(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const rawData = await res.text();
      const data = JSON.parse(rawData);
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      setError("Error al cargar las habitaciones.");
    }
  };

  const handleEdit = async (booking) => {
    if (rooms.length === 0) await fetchRooms();
    setEditingBooking(booking);
    setFormData({
      roomId: booking.roomId?._id || "",
      checkInDate: booking.checkInDate?.slice(0, 10) || "",
      checkOutDate: booking.checkOutDate?.slice(0, 10) || "",
      status: booking.status || "pending",
      passengersCount: booking.passengersCount || 1,
      totalPrice: booking.totalPrice?.toFixed(2) || "0.00",
    });
  };

  const handleSave = async () => {
    if (!auth?.token) return alert("Falta el token de autenticación.");

    const disponible = validarDisponibilidad(
      formData.roomId,
      formData.checkInDate,
      formData.checkOutDate,
      bookings,
      editingBooking._id
    );

    if (!disponible) {
      return alert("La habitación no está disponible para esas fechas.");
    }

    const payload = {
      ...formData,
      passengersCount: Number(formData.passengersCount),
      totalPrice: parseFloat(formData.totalPrice),
    };

    try {
      const res = await fetch(`${API_URL}/api/bookings/${editingBooking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al guardar: ${res.status} ${errorText}`);
      }

      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      setEditingBooking(null);
      await fetchRooms();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => setEditingBooking(null);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar esta reserva?")) return;

    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar la reserva");

      setBookings((prev) => prev.filter((b) => b._id !== id));
      await fetchRooms();
    } catch (error) {
      alert(error.message);
    }
  };

  const isPastBooking = (booking) => {
    const today = new Date();
    return new Date(booking.checkOutDate) < today;
  };

  const sortedBookings = [...bookings]
    .filter((booking) => {
      if (mostrarPasadas) return true;
      return new Date(booking.checkOutDate) >= new Date();
    })
    .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));

  if (!auth?.token) return <div>Cargando autorización...</div>;
  if (loading) return <div>Cargando reservas...</div>;

  return (
    <div>
      <h3>Reservas</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <button class="mb-3" onClick={() => setMostrarPasadas(!mostrarPasadas)}>
        {mostrarPasadas ? "Ocultar reservas pasadas" : "Mostrar reservas pasadas"}
      </button>

      {editingBooking && (
        <div style={{ border: "1px solid black", padding: "10px", margin: "20px 0" }}>
          <h4>Editar Reserva</h4>
          <label>
            Habitación:
            <select name="roomId" value={formData.roomId} onChange={handleChange}>
              <option value="">Seleccione habitación</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomNumber}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Check In:
            <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} />
          </label>
          <br />
          <label>
            Check Out:
            <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} />
          </label>
          <br />
          <label>
            Estado:
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="pending">Pendiente</option>
            </select>
          </label>
          <br />
          <label>
            Pasajeros:
            <input type="number" name="passengersCount" value={formData.passengersCount} min={1} onChange={handleChange} />
          </label>
          <br />
          <label>
            Precio Total:
            <input type="number" name="totalPrice" value={formData.totalPrice} min={0} step="0.01" onChange={handleChange} />
          </label>
          <br />
          <button onClick={handleSave}>Guardar</button>{" "}
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      )}

      {sortedBookings.length === 0 ? (
        <div>No hay reservas.</div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Habitación</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Estado</th>
                <th>Pasajeros</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedBookings.map((booking) => (
                <tr key={booking._id} style={{ color: isPastBooking(booking) ? "red" : "inherit" }}>
                  <td>{booking._id}</td>
                  <td>{booking.userId?.name || "N/A"}</td>
                  <td>{booking.roomId?.roomNumber || "N/A"}</td>
                  <td>{formatDateFromUTC(booking.checkInDate)}</td>
                  <td>{formatDateFromUTC(booking.checkOutDate)}</td>
                  <td>{booking.status}</td>
                  <td>{booking.passengersCount}</td>
                  <td>${booking.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td>
                    <button onClick={() => handleEdit(booking)}>Editar</button>{" "}
                    <button onClick={() => handleDelete(booking._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ReservationsPanel;
