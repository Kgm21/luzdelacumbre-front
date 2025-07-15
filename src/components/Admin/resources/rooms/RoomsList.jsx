import React from "react";
import { Table, Button, Alert } from "react-bootstrap";
import {API_URL} from '../../../../CONFIG/api'

const RoomsList = ({ rooms, auth, onEditRoom, refreshRooms }) => {
  const [error, setError] = React.useState("");

  const handleToggleAvailability = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar habitación");
      refreshRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!Array.isArray(rooms)) {
    return <Alert variant="warning">No hay habitaciones para mostrar</Alert>;
  }

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
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.roomNumber}</td>
              <td>${room.price}</td>
              <td>{room.capacity}</td>
              <td>{room.isAvailable ? "Disponible" : "No disponible"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onEditRoom(room)}
                >
                  Editar
                </Button>{" "}
                <Button
                  variant={room.isAvailable ? "danger" : "success"}
                  size="sm"
                  onClick={() => handleToggleAvailability(room._id)}
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