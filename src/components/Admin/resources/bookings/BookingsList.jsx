import React from "react";
import { Table, Button, Alert } from "react-bootstrap";

// Función utilitaria para formatear fechas en UTC sin perder un día
function formatDateUTC(dateStr) {
  if (!dateStr) return "Sin fecha";
  const d = new Date(dateStr);
  return isNaN(d) 
    ? "Fecha inválida" 
    : d.toLocaleDateString("es-AR", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
}

const BookingsList = ({ bookings, auth, onEditBooking, refreshBookings }) => {
  const [error, setError] = React.useState("");

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al eliminar reserva");
      refreshBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h4>Lista de Reservas</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Habitación</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Pasajeros</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No hay reservas para mostrar.</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.userId?.name || "-"}</td>
                <td>{booking.roomId?.roomNumber || "-"}</td>
                <td>{formatDateUTC(booking.checkInDate)}</td>
                <td>{formatDateUTC(booking.checkOutDate)}</td>
                <td>{booking.passengersCount ?? "-"}</td>
                <td>{booking.status || "-"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => onEditBooking(booking)}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(booking._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingsList;

