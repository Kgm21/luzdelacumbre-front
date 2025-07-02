import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

const ReservationsPanel = ({ API_URL, auth }) => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(bookings)
  useEffect(() => {
    if (!auth?.token) return;
     fetchBookings()
    
 
  }, [auth.token, API_URL]);
const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error("No se pudieron cargar las reservas.");
        const data = await res.json();
        console.log(data)
        setBookings(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(err.message || "Error desconocido.");
      } finally {
        setLoading(false);
      }
    };
  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      checkInDate: booking.checkInDate.slice(0, 10), // yyyy-mm-dd
      checkOutDate: booking.checkOutDate.slice(0, 10),
      status: booking.status,
      passengersCount: booking.passengersCount,
      totalPrice: booking.totalPrice,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
  if (!auth?.token) {
    alert("Falta el token de autenticación.");
    return;
  }

  // Aseguramos que los valores numéricos se envíen correctamente
  const payload = {
    ...formData,
    passengersCount: Number(formData.passengersCount),
    totalPrice: parseFloat(formData.totalPrice),
  };

  // Logs para depuración
  console.log("📤 Enviando datos de reserva:", payload);
  console.log("🔐 Token de autenticación:", auth.token);

  try {
    const res = await fetch(`${API_URL}/api/bookings/${editingBooking._id}`, {
      method: "PUT", // O PATCH si tu backend lo requiere
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    });

    // Si falla, mostramos el error detallado
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al guardar la reserva: ${res.status} ${errorText}`);
    }

    const updated = await res.json();

    // Actualizamos la lista de reservas en pantalla
    setBookings((prev) =>
      prev.map((b) => (b._id === updated._id ? updated : b))
    );

    // Salimos del modo edición
    setEditingBooking(null);
  } catch (error) {
    alert(error.message);
  }
};


  const handleCancel = () => {
    setEditingBooking(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar esta reserva?")) return;

    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar la reserva");

      setBookings((bks) => bks.filter((b) => b._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  if (!auth?.token) return <div>Cargando autorización...</div>;
  if (loading) return <div>Cargando reservas...</div>;

  return (
    <div>
      <h3>Reservas</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {editingBooking ? (
        <div style={{ border: "1px solid black", padding: "10px", marginBottom: "20px" }}>
          <h4>Editar Reserva {editingBooking._id}</h4>
          <label>
            Fecha Check In:{" "}
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Fecha Check Out:{" "}
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Estado:{" "}
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="pending">Pendiente</option>
            </select>
          </label>
          <br />
          <label>
            Pasajeros:{" "}
            <input
              type="number"
              name="passengersCount"
              value={formData.passengersCount}
              onChange={handleChange}
              min={1}
            />
          </label>
          <br />
          <label>
            Precio Total:{" "}
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              min={0}
              step="0.01"
            />
          </label>
          <br />
          <button onClick={handleSave}>Guardar</button>{" "}
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      ) : null}

      {bookings.length == 0 ? (
        <div>No hay reservas.</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Habitación</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.userId?.name || "N/A"}</td>
                <td>{booking.roomId?.roomNumber || "N/A"}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => handleEdit(booking)}>Editar</button>{" "}
                  <button onClick={() => handleDelete(booking._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ReservationsPanel;
