import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Nav, Table } from "react-bootstrap";
import axios from "axios";

import UsersList from "../components/Admin/resources/usuarios/UsersList";
import UsersCreate from "../components/Admin/resources/usuarios/UsersCreate";
import UsersEdit from "../components/Admin/resources/usuarios/UsersEdit";

import RoomsList from "../components/Admin/resources/rooms/RoomsList";
import RoomsCreate from "../components/Admin/resources/rooms/RoomsCreate";
import RoomsEdit from "../components/Admin/resources/rooms/RoomsEdit";

import BookingsList from "../components/Admin/resources/bookings/BookingsList";
import BookingsCreate from "../components/Admin/resources/bookings/BookingsCreate";
import BookingsEdit from "../components/Admin/resources/bookings/BookingsEdit";

import { useAuth } from "../context/AuthContext";
import { API_URL } from "../CONFIG/api";

const AdminPage = () => {
  const { auth, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("users");

  // Estados para cada recurso (usuarios, habitaciones, reservas)
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");
  const [editUserId, setEditUserId] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errorRooms, setErrorRooms] = useState("");
  const [editRoomId, setEditRoomId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [errorBookings, setErrorBookings] = useState("");
  const [editBookingData, setEditBookingData] = useState(null);

  const [info, setInfo] = useState(false)


  // -------- Función para inicializar disponibilidad --------
  const handleInitAvailability = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/availability/init`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setInfo(true)
      return response.data;
    } catch (error) {
      console.error("Error al inicializar disponibilidad:", error);
    }
  };

  // Fetchers
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers("");
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar usuarios");

      setUsers(data.usuarios);
    } catch (err) {
      console.error(err);
      setErrorUsers(err.message);
      setUsers([]);
    }
    setLoadingUsers(false);
  };


  const fetchRooms = async () => {
    setLoadingRooms(true);
    setErrorRooms("");
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar habitaciones");
      setRooms(data.data || []);
    } catch (err) {
      setErrorRooms(err.message);
    }
    setLoadingRooms(false);
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setErrorBookings("");
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar reservas");
      setBookings(data.data || []);
    } catch (err) {
      setErrorBookings(err.message);
    }
    setLoadingBookings(false);
  };

  // Cargar datos según sección activa
  useEffect(() => {
    if (!auth?.token) return;
    switch (activeSection) {
      case "users":
        fetchUsers();
        break;
      case "rooms":
        fetchRooms();
        break;
      case "bookings":
        fetchBookings();
        break;
      case "availability":
        handleInitAvailability().then(fetchRooms);
        break;
      default:
        break;
    }
  }, [activeSection, auth]);

  // ---- Handlers para edición (usuarios, habitaciones, reservas) ----
  // Usuarios
  const handleUserUpdated = () => {
    fetchUsers();
    setEditUserId(null);
  };
  const handleUserEditClick = (id) => {
    setEditUserId(id);
  };
  const handleUserCancelEdit = () => {
    setEditUserId(null);
  };

  // Habitaciones
  const handleRoomUpdated = () => {
    fetchRooms();
    setEditRoomId(null);
  };
  const handleRoomEditClick = (room) => {
    setEditRoomId(room._id);
  };
  const handleRoomCancelEdit = () => {
    setEditRoomId(null);
  };

  // Reservas
  const handleBookingUpdated = () => {
    fetchBookings();
    setEditBookingData(null);
  };
  const handleBookingEditClick = (booking) => {
    setEditBookingData(booking);
  };
  const handleBookingCancelEdit = () => {
    setEditBookingData(null);
  };
  const handleBookingCreated = () => {
    fetchBookings();
  };

  return (
    <Container className="my-4">
      <h2>Panel de Administración</h2>

      {/* Menú principal */}
      <Nav variant="tabs" activeKey={activeSection} onSelect={setActiveSection}>
        <Nav.Item>
          <Nav.Link eventKey="users">Usuarios</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="rooms">Habitaciones</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="bookings">Reservas</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="availability">Disponibilidad</Nav.Link>
        </Nav.Item>
      </Nav>

      <Row className="mt-3">
        {/* Usuarios */}
        {activeSection === "users" && (
          <>
            <Col xs={12} md={editUserId ? 8 : 12} className="mb-3">
              <UsersList
                users={users}
                onEdit={handleUserEditClick}
                auth={auth}
                logout={logout}
                fetchUsers={fetchUsers}
              />
            </Col>
            {editUserId && (
              <Col xs={12} md={4}>
                <Button variant="secondary" className="mb-3" onClick={handleUserCancelEdit}>
                  Cancelar Edición
                </Button>
                <UsersEdit
                  userId={editUserId}
                  auth={auth}
                  onUserUpdated={handleUserUpdated}
                  onCancel={handleUserCancelEdit}
                />
              </Col>
            )}
          </>
        )}

        {activeSection === "rooms" && (
          <>
            <Col xs={12} md={editRoomId ? 8 : 12} className="mb-3">
              <RoomsList
                rooms={rooms}
                onEditRoom={handleRoomEditClick}
                auth={auth}
                refreshRooms={fetchRooms}
              />
            </Col>
            {editRoomId && (
              <Col xs={12} md={4}>
                <Button variant="secondary" className="mb-3" onClick={handleRoomCancelEdit}>
                  Cancelar Edición
                </Button>
                <RoomsEdit
                  roomId={editRoomId}
                  auth={auth}
                  onRoomUpdated={handleRoomUpdated}
                />
              </Col>
            )}
          </>
        )}

        {activeSection === "bookings" && (
          <>
            <Col xs={12} md={editBookingData ? 8 : 12} className="mb-3">
              <BookingsList
                bookings={bookings}
                onEditBooking={handleBookingEditClick}
                auth={auth}
                logout={logout}
                refreshBookings={fetchBookings}
              />
            </Col>
            <Col xs={12} md={4}>
              {editBookingData ? (
                <>
                  <Button variant="secondary" className="mb-3" onClick={handleBookingCancelEdit}>
                    Cancelar Edición
                  </Button>
                  <BookingsEdit
                    auth={auth}
                    bookingData={editBookingData}
                    onBookingUpdated={handleBookingUpdated}
                    onCancel={handleBookingCancelEdit}
                  />
                </>
              ) : (
                <BookingsCreate
                  auth={auth}
                  onBookingCreated={handleBookingCreated}
                />
              )}
            </Col>
          </>
        )}
      </Row>
      {activeSection === "availability" && (
        <Row className="mb-4">
          <Col>
            <h3>Disponibilidad Actualizada</h3>
            {errorRooms && <Alert variant="danger">{errorRooms}</Alert>}
            {info ? (<Table striped bordered hover>
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
            </Table>) : (<p>Cargando Disponibilidad...</p>)}

          </Col>
        </Row>
      )}
    </Container >
  );
};

export default AdminPage;
