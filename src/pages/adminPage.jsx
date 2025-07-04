import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table, Alert, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../CONFIG/api";
import ReservationsPanel from "../components/BookingPanel";
import axios from "axios";

const AdminPage = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    type: "",
    price: "",
    description: "",
    capacity: "",
    isAvailable: true,
    photos: null,
  });
  const [editRoomId, setEditRoomId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [reservations, setReservations] = useState([])

  useEffect(() => {
  console.log("auth", auth);
  if (!auth.isAuthenticated || auth.role !== "admin") {
    navigate("/login");
  } else {
    fetchRooms();
    fetchUsers();
    fetchReservations();
  }
}, [auth.isAuthenticated, auth.role, auth.token, navigate]);

const handleInitAvailability = async () => {
  try {
    const response = await axios.post('/api/availability/init');
    const data = response.json()
    return data
  } catch (error) {
   console.log(error)
  }
};

const fetchReservations = async () => {
  if (!auth?.token) {
    console.log("No token, abortando fetchReservations");
    return;
  }

  try {
    console.log("fetchReservations: iniciando fetch...");
    const res = await fetch(`${API_URL}/api/bookings`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    console.log("fetchReservations: respuesta status", res.status);

    if (!res.ok) throw new Error("Error cargando reservas");
    const data = await res.json();
    console.log("fetchReservations: data recibida", data);
    setReservations(data);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
};


  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Error al cargar habitaciones");
      }
      
      setRooms(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios?pagina=0&limite=50`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      setUsers(data.usuarios);
    } catch (err) {
      setError("Error al cargar usuarios");
    }
  };

  const handleRoomChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setNewRoom((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setNewRoom((prev) => ({ ...prev, [name]: files }));
    } else {
      setNewRoom((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrUpdateRoom = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("roomNumber", newRoom.roomNumber);
    formData.append("type", newRoom.type);
    formData.append("price", Number(newRoom.price));
    formData.append("description", newRoom.description);
    formData.append("capacity", Number(newRoom.capacity));
    formData.append("isAvailable", String(newRoom.isAvailable));
    if (newRoom.photos) {
      Array.from(newRoom.photos).forEach((photo) => formData.append("photos", photo));
    }

    const method = editRoomId ? "PUT" : "POST";
    const url = editRoomId ? `${API_URL}/api/rooms/${editRoomId}` : `${API_URL}/api/rooms`;

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${auth.token}` },
        body: formData,
      });

      const res = await response.json();

      if (response.ok) {
        setSuccess(editRoomId ? "Habitación actualizada" : "Habitación agregada con éxito");
        setNewRoom({
          roomNumber: "",
          type: "",
          price: "",
          description: "",
          capacity: "",
          isAvailable: true,
          photos: null,
        });
        setEditRoomId(null);
        fetchRooms();
      } else {
        if (response.status === 401) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          logout();
          navigate("/login");
        } else if (response.status === 403) {
          setError("No tienes permisos para realizar esta acción.");
        } else {
          setError(res.message || `Error al ${editRoomId ? "actualizar" : "agregar"} habitación`);
        }
      }
    } catch (err) {
      setError(`Error al ${editRoomId ? "actualizar" : "agregar"} habitación: ${err.message}`);
    }
  };

  const handleEditRoom = (room) => {
    setEditRoomId(room._id);
    setNewRoom({
      roomNumber: room.roomNumber,
      type: room.type || "",
      price: room.price || "",
      description: room.description || "",
      capacity: room.capacity || "",
      isAvailable: room.isAvailable,
      photos: null,
    });
    setError("");
    setSuccess("");
  };

  const handleDeleteRoom = async (roomId) => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_URL}/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const res = await response.json();
      if (response.ok) {
        fetchRooms();
        setSuccess("Habitación deshabilitada");
      } else {
        if (response.status === 401) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          logout();
          navigate("/login");
        } else if (response.status === 403) {
          setError("No tienes permisos para realizar esta acción.");
        } else {
          setError(res.message || "Error al deshabilitar habitación");
        }
      }
    } catch (err) {
      setError(`Error al deshabilitar habitación: ${err.message}`);
    }
  };

  return (
    <Container>
      <h2 className="my-4">Panel de Administración</h2>
      <Button variant="danger" onClick={logout} className="mb-3">
        Cerrar Sesión
      </Button>

      <Dropdown className="mb-4">
        <Dropdown.Toggle variant="primary" id="dropdown-sections">
          Seleccionar Sección
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setActiveSection("rooms")}>
            Ver/Editar Habitaciones
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setActiveSection("users")}>
            Ver/Editar Usuarios
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setActiveSection("reservations")}>
            Ver/Editar Reservas
          </Dropdown.Item>
          <Dropdown.Item onClick={async () => {
  setActiveSection("availability");
  await handleInitAvailability();
  await fetchRooms();
}}>
  Ampliar disponibilidad
</Dropdown.Item>
          
        </Dropdown.Menu>
      </Dropdown>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {editRoomId && <Alert variant="info">Estás editando una habitación</Alert>}

      {activeSection === "rooms" && (
        <>
          <Row className="mb-4">
            <Col>
              <h3>{editRoomId ? "Editar Habitación" : "Agregar Nueva Habitación"}</h3>
              <Form onSubmit={handleAddOrUpdateRoom}>
                <Form.Group className="mb-3">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    name="roomNumber"
                    value={newRoom.roomNumber}
                    onChange={handleRoomChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select name="type" value={newRoom.type} onChange={handleRoomChange} required>
                    <option value="">Selecciona un tipo</option>
                    <option value="cabaña">Cabaña</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={newRoom.price}
                    onChange={handleRoomChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={newRoom.description}
                    onChange={handleRoomChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={newRoom.capacity}
                    onChange={handleRoomChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="¿Está disponible?"
                    name="isAvailable"
                    checked={newRoom.isAvailable}
                    onChange={handleRoomChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fotos</Form.Label>
                  <Form.Control
                    type="file"
                    name="photos"
                    onChange={handleRoomChange}
                    multiple
                    accept="image/jpeg,image/png"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {editRoomId ? "Guardar Cambios" : "Agregar"}
                </Button>{" "}
                {editRoomId && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditRoomId(null);
                      setNewRoom({
                        roomNumber: "",
                        type: "",
                        price: "",
                        description: "",
                        capacity: "",
                        isAvailable: true,
                        photos: null,
                      });
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Cancelar
                  </Button>
                )}
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
                    <th>Capacidad</th>
                    <th>Disponible</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td>{room.roomNumber}</td>
                      <td>{room.type}</td>
                      <td>${room.price}</td>
                      <td>{room.capacity}</td>
                      <td>{room.isAvailable ? "Sí" : "No"}</td>
                      <td>
                        <Button variant="secondary" size="sm" onClick={() => handleEditRoom(room)}>
                          Editar
                        </Button>{" "}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteRoom(room._id)}>
                          Deshabilitar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}

      {activeSection === "users" && (
        <Row className="mb-4">
          <Col>
            <h3>Lista de Usuarios</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.isActive ? "Activo" : "Suspendido"}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        disabled={!user.isActive}
                        onClick={() => alert("Función de editar usuario pendiente")}
                      >
                        Editar
                      </Button>{" "}
                      <Button
                        variant={user.isActive ? "danger" : "success"}
                        size="sm"
                        onClick={() => alert("Función de activar/desactivar usuario pendiente")}
                      >
                        {user.isActive ? "Suspender" : "Activar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}

    
      {activeSection === "reservations" && (
  <Row className="mb-4">
    <Col>
      <ReservationsPanel
        API_URL={API_URL}
        auth={auth} // 👈 CAMBIADO de authToken a auth
        reservations={reservations}
        refreshReservations={fetchReservations}
      />
    </Col>
  </Row>
)}

{activeSection === "availability" && (
  <Row className="mb-4">
    <Col>
      <h3>Disponibilidad Actualizada</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>N° Habitación</th>
            <th>Disponible</th>
            <th>Última Actualización</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.roomNumber}</td>
              <td>{room.isAvailable ? "Sí" : "No"}</td>
              <td>{room.updatedAt ? new Date(room.updatedAt).toLocaleString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  </Row>
)}



    </Container>
  );
};

export default AdminPage;
