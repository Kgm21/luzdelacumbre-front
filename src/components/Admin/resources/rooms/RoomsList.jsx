import React, { useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const RoomsList = ({ rooms, auth, onEditRoom, refreshRooms }) => {
  const [error, setError] = useState("");

  const handleToggleAvailability = async (roomId, currentAvailability) => {
    setError("");
    const newAvailability = !currentAvailability;
    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ isAvailable: newAvailability }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar la disponibilidad");

      if (refreshRooms) await refreshRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!Array.isArray(rooms)) {
    return <Alert variant="warning">No hay habitaciones para mostrar</Alert>;
  }

  if (rooms.length === 0) {
    return <Alert variant="info">No hay habitaciones disponibles</Alert>;
  }

  const sortedRooms = [...rooms].sort((a, b) => {
    if (typeof a.roomNumber === "string" && typeof b.roomNumber === "string") {
      return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
    }
    return 0;
  });

  return (
    <div>
      <h4>Lista de Habitaciones</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Número</th>
            <th>Precio</th>
            <th>Capacidad</th>
            <th>Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedRooms.map((room) => (
            <tr key={room._id}>
              <td>{room.roomNumber}</td>
              <td>${room.price}</td>
              <td>{room.capacity}</td>
              <td>{room.isAvailable ? "Disponible" : "No disponible"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onEditRoom(room._id)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant={room.isAvailable ? "danger" : "success"}
                  size="sm"
                  onClick={() => handleToggleAvailability(room._id, room.isAvailable)}
                >
                  {room.isAvailable ? "Deshabilitar" : "Habilitar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RoomsList;

