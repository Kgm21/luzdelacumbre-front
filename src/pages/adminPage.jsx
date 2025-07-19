import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Nav, Table } from "react-bootstrap";
import "./styles/adminPage.css";

import UsersList from "../components/Admin/resources/usuarios/UsersList";
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

  // Usuarios
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");
  const [editUserId, setEditUserId] = useState(null);

  // Habitaciones
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errorRooms, setErrorRooms] = useState("");
  const [editRoomId, setEditRoomId] = useState(null);

  // Reservas
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [errorBookings, setErrorBookings] = useState("");
  const [editBookingData, setEditBookingData] = useState(null);

  // Contactos
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [errorContacts, setErrorContacts] = useState("");

  // Disponibilidad
  const [availabilityEndDate, setAvailabilityEndDate] = useState(null);
  const [info, setInfo] = useState(false);

  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
  };

  // Fetch Usuarios
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { usuarios } = await fetchJson(
        `${API_URL}/api/usuarios?pagina=0&limite=50`
      );
      setUsers(usuarios);
      setErrorUsers("");
    } catch (err) {
      setErrorUsers(err.message);
    }
    setLoadingUsers(false);
  };

  // Handlers Usuarios
  const handleUserEditClick = (id) => setEditUserId(id);
  const handleUserCancelEdit = () => setEditUserId(null);
  const handleUserUpdated = () => {
    fetchUsers();
    setEditUserId(null);
  };

  // Fetch Rooms
  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data } = await fetchJson(`${API_URL}/api/rooms`);
      setRooms(data);
      setErrorRooms("");
    } catch (err) {
      setErrorRooms(err.message);
    }
    setLoadingRooms(false);
  };

  // Handlers Rooms
  const handleRoomEditClick = (room) => setEditRoomId(room._id);
  const handleRoomCancelEdit = () => setEditRoomId(null);
  const handleRoomUpdated = () => {
    fetchRooms();
    setEditRoomId(null);
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await fetchJson(`${API_URL}/api/bookings`);
      setBookings(data);
      setErrorBookings("");
    } catch (err) {
      setErrorBookings(err.message);
    }
    setLoadingBookings(false);
  };

  // Handlers Bookings
  const handleBookingEditClick = (booking) => setEditBookingData(booking);
  const handleBookingCancelEdit = () => setEditBookingData(null);
  const handleBookingUpdated = () => {
    fetchBookings();
    setEditBookingData(null);
  };
  const handleBookingCreated = () => fetchBookings();

  // Fetch Contacts
  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await fetchJson(`${API_URL}/api/contact`);
      res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setContacts(res);
      setErrorContacts("");
    } catch (err) {
      setErrorContacts(err.message);
    }
    setLoadingContacts(false);
  };

  // Delete Contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm("¿Eliminar este contacto?")) return;
    await fetchJson(`${API_URL}/api/contact/${id}`, { method: "DELETE" });
    fetchContacts();
  };

  // Init Availability
  const handleInitAvailability = async () => {
    setInfo(false);
    await fetchJson(`${API_URL}/api/availability/init`, { method: "POST" });
    const end = new Date();
    end.setMonth(end.getMonth() + 5);
    setAvailabilityEndDate(end);
    setInfo(true);
  };

  useEffect(() => {
    if (!auth.token) return;

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
      case "contact":
        fetchContacts();
        break;
      case "availability":
        handleInitAvailability();
        break;
      default:
        break;
    }
  }, [activeSection, auth.token]);

  return (
    <Container className="my-4">
      <h2>Panel de Administración</h2>
      <Nav variant="tabs" activeKey={activeSection} onSelect={setActiveSection}>
        <Nav.Item><Nav.Link eventKey="users">Usuarios</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="rooms">Habitaciones</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="bookings">Reservas</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="contact">Contactos</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="availability">Disponibilidad</Nav.Link></Nav.Item>
      </Nav>

      <Row className="mt-3">
        {activeSection === "users" && (
          <Col>
            <h3>Usuarios</h3>
            {loadingUsers && <Alert variant="info">Cargando usuarios...</Alert>}
            {errorUsers && <Alert variant="danger">{errorUsers}</Alert>}
            <UsersList
              users={users}
              onEdit={handleUserEditClick}
              loading={loadingUsers}
            />
            {editUserId && (
              <>
                <h3>Editar Usuario</h3>
                <UsersEdit
                  userId={editUserId}
                  onUserUpdated={handleUserUpdated}
                  onCancel={handleUserCancelEdit}
                />
              </>
            )}
          </Col>
        )}

        {activeSection === "rooms" && (
          <>
            <Col md={6}>
              <h3>Habitaciones</h3>
              {loadingRooms && <Alert variant="info">Cargando habitaciones...</Alert>}
              {errorRooms && <Alert variant="danger">{errorRooms}</Alert>}
              <RoomsList
                rooms={rooms}
                onEditRoom={handleRoomEditClick}
                loading={loadingRooms}
              />
            </Col>
            <Col md={6}>
              {editRoomId ? (
                <RoomsEdit
                  id={editRoomId}
                  onRoomUpdated={handleRoomUpdated}
                  onCancel={handleRoomCancelEdit}
                />
              ) : (
                <RoomsCreate onRoomCreated={fetchRooms} />
              )}
            </Col>
          </>
        )}

        {activeSection === "bookings" && (
          <>
            <Col md={6}>
              <h3>Reservas</h3>
              {loadingBookings && <Alert variant="info">Cargando reservas...</Alert>}
              {errorBookings && <Alert variant="danger">{errorBookings}</Alert>}
              <BookingsList
                bookings={bookings}
                onEditBooking={handleBookingEditClick}
                loading={loadingBookings}
              />
            </Col>
            <Col md={6}>
              {editBookingData ? (
                <BookingsEdit
                  booking={editBookingData}
                  onBookingUpdated={handleBookingUpdated}
                  onCancel={handleBookingCancelEdit}
                />
              ) : (
                <BookingsCreate onBookingCreated={handleBookingCreated} />
              )}
            </Col>
          </>
        )}

        {activeSection === "contact" && (
          <Col>
            <h3>Contactos</h3>
            {loadingContacts && <Alert variant="info">Cargando contactos...</Alert>}
            {errorContacts && <Alert variant="danger">{errorContacts}</Alert>}
            <Table striped bordered hover responsive>
              <thead><tr><th>Nombre</th><th>Email</th><th>Mensaje</th><th>Acciones</th></tr></thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c._id}>
                    <td>{c.name}</td><td>{c.email}</td><td>{c.message}</td>
                    <td><Button variant="danger" size="sm" onClick={() => handleDeleteContact(c._id)}>Eliminar</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        )}

        {activeSection === "availability" && (
          <Col>
            <h3>Disponibilidad</h3>
            {info ? (
              <Alert variant="success">
                Activa hasta {availabilityEndDate.toLocaleDateString()}
              </Alert>
            ) : (
              <Alert variant="info">Inicializando disponibilidad...</Alert>
            )}
          </Col>
        )}
      </Row>

      <Row className="mt-4">
        <Col>
          <Button variant="secondary" onClick={logout}>
            Cerrar sesión
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
