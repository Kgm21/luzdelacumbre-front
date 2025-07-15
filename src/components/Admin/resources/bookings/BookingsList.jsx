import React from "react";
import { Table, Button, Alert, Badge } from "react-bootstrap";

// Función para formatear fechas en UTC
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

// Función para formatear números como moneda
function formatPrice(price) {
  if (price == null) return "-";
  return price.toLocaleString("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

const BookingsList = ({ bookings, auth, onEditBooking, refreshBookings }) => {
  const [error, setError] = React.useState("");
  const [mostrarPasadas, setMostrarPasadas] = React.useState(false);

  const ahora = new Date();

  const reservasFiltradas = React.useMemo(() => {
    return bookings.filter((booking) =>
      mostrarPasadas
        ? new Date(booking.checkOutDate) < ahora
        : new Date(booking.checkOutDate) >= ahora
    );
  }, [bookings, mostrarPasadas, ahora]);

  const sortedBookings = React.useMemo(() => {
    return [...reservasFiltradas].sort(
      (a, b) => new Date(a.checkInDate) - new Date(b.checkInDate)
    );
  }, [reservasFiltradas]);

  const isActive = (booking) => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    return ahora >= checkIn && ahora <= checkOut;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}: No se pudo eliminar`);
      }
      refreshBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Lista de Reservas</h4>
        <Button
          variant={mostrarPasadas ? "secondary" : "outline-secondary"}
          onClick={() => setMostrarPasadas(!mostrarPasadas)}
          aria-pressed={mostrarPasadas}
        >
          {mostrarPasadas ? "Ver reservas actuales" : "Ver reservas pasadas"}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Habitación</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Pasajeros</th>
            <th>Precio Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No hay reservas para mostrar.
              </td>
            </tr>
          ) : (
            sortedBookings.map((booking) => {
              const active = isActive(booking);

              const estadoColor = {
                confirmada: "success",
                cancelada: "danger",
                pendiente: "warning",
              };

              return (
                <tr key={booking._id} className={active ? "table-success" : ""}>
                  <td>{booking.userId?.name || "-"}</td>
                  <td>{booking.roomId?.roomNumber || "-"}</td>
                  <td>{formatDateUTC(booking.checkInDate)}</td>
                  <td>{formatDateUTC(booking.checkOutDate)}</td>
                  <td>{booking.passengersCount ?? "-"}</td>
                  <td>{formatPrice(booking.totalPrice)}</td>
                  <td>
                    <Badge
                      bg={estadoColor[booking.status] || "secondary"}
                      className="me-1"
                    >
                      {booking.status || "-"}
                    </Badge>
                    {active && (
                      <Badge bg="success" pill>
                        ahora
                      </Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      title="Editar reserva"
                      onClick={() => onEditBooking(booking)}
                    >
                      Editar
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      title="Eliminar reserva"
                      onClick={() => handleDelete(booking._id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingsList;
