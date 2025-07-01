import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table, Alert, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../CONFIG/api";

const AdminPage = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    userId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    passengersCount: 1,
    status: 'confirmed',
  });
  const [editBookingId, setEditBookingId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editRoomId, setEditRoomId] = useState(null);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    type: "",
    price: "",
    description: "",
    capacity: "",
    isAvailable: true,
    photos: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState(null); // Control which section is visible

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== "admin") {
      navigate("/login");
    } else {
      fetchRooms();
      fetchUsers();
      fetchReservations();
    }
  }, [auth.isAuthenticated, auth.role, navigate]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: al cargar habitaciones`);
      }
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err.message || "Error al cargar habitaciones");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/usuarios?pagina=0&limite=50`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const data = await response.json();
      setUsers(data.usuarios);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: al cargar reservas`);
      }
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message || "Error al cargar reservas");
    }
  };

  const handleRoomChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files : value,
    }));
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(newBooking),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Reserva creada con éxito');
        setShowBookingForm(false);
        fetchReservations();
      } else {
        setError(data.message || 'Error al crear reserva');
      }
    } catch (err) {
      setError('Error al crear reserva: ' + err.message);
    }
  };

  const handleEditBooking = (booking) => {
    setEditBookingId(booking._id);
    setNewBooking({
      userId: typeof booking.userId === 'object' ? booking.userId._id : booking.userId || '',
      roomId: typeof booking.roomId === 'object' ? booking.roomId._id : booking.roomId || '',
      checkInDate: booking.checkInDate ? booking.checkInDate.slice(0, 10) : '',
      checkOutDate: booking.checkOutDate ? booking.checkOutDate.slice(0, 10) : '',
      passengersCount: booking.passengersCount || 1,
      status: booking.status || 'confirmed',
    });
    setShowBookingForm(true);
    setError('');
    setSuccess('');
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_URL}/api/bookings/${editBookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(newBooking),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Reserva actualizada con éxito');
        setShowBookingForm(false);
        setEditBookingId(null);
        fetchReservations();
      } else {
        setError(data.message || 'Error al actualizar reserva');
      }
    } catch (err) {
      setError('Error al actualizar reserva: ' + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Reserva eliminada');
        fetchReservations();
      } else {
        setError(data.message || 'Error al eliminar reserva');
      }
    } catch (err) {
      setError('Error al eliminar reserva: ' + err.message);
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

  const handleUserAction = async (userId, action) => {
    setError("");
    setSuccess("");

    try {
      if (action === "suspend") {
        const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: false }),
        });

        const res = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
            logout();
            navigate("/login");
          } else if (response.status === 403) {
            setError("No tienes permisos para realizar esta acción.");
          } else {
            setError(res.message || "Error al suspender usuario");
          }
          return;
        }

        fetchUsers();
        setSuccess("Usuario suspendido");

      } else if (action === "delete") {
        const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const res = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
            logout();
            navigate("/login");
          } else if (response.status === 403) {
            setError("No tienes permisos para realizar esta acción.");
          } else {
            setError(res.message || "Error al eliminar usuario");
          }
          return;
        }

        fetchUsers();
        setSuccess("Usuario eliminado");
      }
    } catch (err) {
      setError(`Error en la acción de usuario: ${err.message}`);
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
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleUserAction(user._id, "delete")}
                        >
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
      )}

      {activeSection === "reservations" && (
        <Row className="mb-4">
          <Col>
            <h3>Lista de Reservas</h3>
            <Button
              variant="success"
              className="mb-3"
              onClick={() => {
                setShowBookingForm(true);
                setEditBookingId(null);
                setNewBooking({
                  userId: "",
                  roomId: "",
                  checkInDate: "",
                  checkOutDate: "",
                  passengersCount: 1,
                  status: "confirmed",
                });
              }}
            >
              Registrar Reserva
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Habitación</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Pasajeros</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reservations) && reservations.length > 0 ? (
                  reservations.map((res) => (
                    <tr key={res._id}>
                      <td>{res.userId?.name || "Sin nombre"}</td>
                      <td>{res.roomId?.roomNumber || "Sin número"}</td>
                      <td>{new Date(res.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(res.checkOutDate).toLocaleDateString()}</td>
                      <td>{res.passengersCount}</td>
                      <td>{res.totalPrice}</td>
                      <td>{res.status}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEditBooking(res)}
                          className="me-2"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteBooking(res._id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No hay reservas disponibles</td>
                  </tr>
                )}
              </tbody>
            </Table>
            {showBookingForm && (
              <Row className="mb-4">
                <Col>
                  <h4>{editBookingId ? "Editar Reserva" : "Nueva Reserva"}</h4>
                  <Form onSubmit={editBookingId ? handleUpdateBooking : handleAddBooking}>
                    <Form.Group className="mb-3">
                      <Form.Label>Usuario</Form.Label>
                      <Form.Select
                        name="userId"
                        value={newBooking.userId}
                        onChange={handleBookingChange}
                        required
                      >
                        <option value="">Seleccione usuario</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} {user.apellido}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Habitación</Form.Label>
                      <Form.Select
                        name="roomId"
                        value={newBooking.roomId}
                        onChange={handleBookingChange}
                        required
                      >
                        <option value="">Seleccione habitación</option>
                        {rooms.map((room) => (
                          <option key={room._id} value={room._id}>
                            {room.roomNumber}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-in</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkInDate"
                        value={newBooking.checkInDate}
                        onChange={handleBookingChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-out</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkOutDate"
                        value={newBooking.checkOutDate}
                        onChange={handleBookingChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Pasajeros</Form.Label>
                      <Form.Control
                        type="number"
                        name="passengersCount"
                        value={newBooking.passengersCount}
                        onChange={handleBookingChange}
                        min="1"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select
                        name="status"
                        value={newBooking.status}
                        onChange={handleBookingChange}
                        required
                      >
                        <option value="confirmed">Confirmada</option>
                        <option value="cancelled">Cancelada</option>
                      </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      {editBookingId ? "Guardar Cambios" : "Registrar Reserva"}
                    </Button>{" "}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowBookingForm(false);
                        setEditBookingId(null);
                      }}
                    >
                      Cancelar
                    </Button>
                  </Form>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminPage;