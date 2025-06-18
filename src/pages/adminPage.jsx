import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminPage = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [newRoom, setNewRoom] = useState({
    number: "",
    type: "",
    price: "",
    availability: "",
    photo: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== "admin") {
      navigate("/login");
    } else {
      fetchRooms();
      fetchUsers();
    }
  }, [auth, navigate]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/rooms", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        setError("");
      } else {
        setError("Error al cargar habitaciones");
      }
    } catch {
      setError("Error al cargar habitaciones");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setError("");
      } else {
        setError("Error al cargar usuarios");
      }
    } catch {
      setError("Error al cargar usuarios");
    }
  };

  const handleRoomChange = (e) => {
    const { name, value, files } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("number", newRoom.number);
      formData.append("type", newRoom.type);
      formData.append("price", newRoom.price);
      formData.append("availability", newRoom.availability);
      if (newRoom.photo) formData.append("photo", newRoom.photo);

      const response = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` }, 
        body: formData,
      });
      if (response.ok) {
        setSuccess("Habitación agregada con éxito");
        setNewRoom({ number: "", type: "", price: "", availability: "", photo: null });
        fetchRooms();
      } else {
        setError("Error al agregar habitación");
      }
    } catch {
      setError("Error al agregar habitación");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.ok) {
        fetchRooms();
        setSuccess("Habitación eliminada");
      } else {
        setError("Error al eliminar habitación");
      }
    } catch {
      setError("Error al eliminar habitación");
    }
  };

  const handleUserAction = async (userId, action) => {
    setError("");
    setSuccess("");
    const endpoint = action === "suspend" ? "suspend" : "delete";
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${userId}/${endpoint}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchUsers();
        setSuccess(`Usuario ${action === "suspend" ? "suspendido" : "eliminado"}`);
      } else {
        setError(`Error al ${action} usuario`);
      }
    } catch {
      setError(`Error al ${action} usuario`);
    }
  };

  return (
    <Container>
      <h2 className="my-4">Panel de Administración</h2>
      <Button variant="danger" onClick={logout} className="mb-3">
        Cerrar Sesión
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="mb-4">
        <Col>
          <h3>Agregar Nueva Habitación</h3>
          <Form onSubmit={handleAddRoom}>
            <Form.Group className="mb-3">
              <Form.Label>Número</Form.Label>
              <Form.Control type="text" name="number" value={newRoom.number} onChange={handleRoomChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control type="text" name="type" value={newRoom.type} onChange={handleRoomChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name="price" value={newRoom.price} onChange={handleRoomChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Disponibilidad (fecha, ej: 2025-06-18)</Form.Label>
              <Form.Control type="text" name="availability" value={newRoom.availability} onChange={handleRoomChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto</Form.Label>
              <Form.Control type="file" name="photo" onChange={handleRoomChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Agregar
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3>Lista de Habitaciones</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Número</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Disponibilidad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.number}</td>
                  <td>{room.type}</td>
                  <td>${room.price}</td>
                  <td>{room.availability}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteRoom(room._id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Lista de Usuarios</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.apellido}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleUserAction(user._id, "suspend")}>
                        Suspender
                      </Button>{" "}
                      <Button variant="danger" onClick={() => handleUserAction(user._id, "delete")}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay usuarios disponibles</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
