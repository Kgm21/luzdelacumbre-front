import React, { useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const BookingsList = ({ bookings, auth, onEditBooking, refreshBookings }) => {
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}`, {
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
      <Table striped bordered hover>
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
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.userId?.name || "-"}</td>
              <td>{booking.roomId?.roomNumber || "-"}</td>
              <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
              <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
              <td>{booking.passengersCount}</td>
              <td>{booking.status}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => onEditBooking(booking)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(booking._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingsList;
