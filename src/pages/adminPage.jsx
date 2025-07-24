import { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Alert, Spinner, Table, Button } from "react-bootstrap";
import { useMemo } from "react";

import UsersList from "../components/Admin/resources/usuarios/UsersList";
import UsersEdit from "../components/Admin/resources/usuarios/UsersEdit";

import RoomsList from "../components/Admin/resources/rooms/RoomsList";
import RoomsCreate from "../components/Admin/resources/rooms/RoomsCreate";
import RoomsEdit from "../components/Admin/resources/rooms/RoomsEdit";

import BookingsList from "../components/Admin/resources/bookings/BookingsList";
import BookingsCreate from "../components/Admin/resources/bookings/BookingsCreate";
import BookingsEdit from "../components/Admin/resources/bookings/BookingsEdit";

import ContactsEdit from "../components/Admin/resources/contact/ContactMessagesEdit";

import { useAuth } from "../context/AuthContext";
import { API_URL } from "../CONFIG/api";

const AdminPage = () => {
  const { auth, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("users");

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const [availabilityInfo, setAvailabilityInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editRoomId, setEditRoomId] = useState(null);
  const [editBookingData, setEditBookingData] = useState(null);

  const fetchJson = async (url, options = {}) => {
    if (!auth?.token) throw new Error("Token no disponible");
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
  };
   const [today, endDate] = useMemo(() => {
    const now = new Date()
    now.setHours(0,0,0,0)
    const end = new Date(now)
    end.setMonth(end.getMonth() + 5)
    end.setHours(0,0,0,0)
    return [now, end]
  }, [])


  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      switch (activeSection) {
        case "users": {
          const { usuarios } = await fetchJson(`${API_URL}/api/usuarios?pagina=0&limite=50`);
          setUsers(usuarios);
          break;
        }
        case "rooms": {
          const { rooms: roomData } = await fetchJson(`${API_URL}/api/rooms`);
          setRooms(roomData || []);
          break;
        }
        case "bookings": {
          const data = await fetchJson(`${API_URL}/api/bookings`);
          const bookingData =
            Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setBookings(bookingData);
          break;
        }
        case "contact": {
          const contactData = await fetchJson(`${API_URL}/api/contact`);
          setContacts(
            contactData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          );
          break;
        }
        case "availability": {
          const res = await fetchJson(`${API_URL}/api/availability/init`, { method: "POST" });
          if (res?.updatedUntil) {
            setAvailabilityInfo(res.updatedUntil);
          } else {
            setAvailabilityInfo(null);
          }
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchAllData();
    } else {
      setError("Autenticación requerida");
    }
  }, [activeSection, auth?.token]);

  const handleDeleteContact = async (id) => {
    try {
      await fetchJson(`${API_URL}/api/contact/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserUpdated = async () => {
    await fetchAllData();
    setEditUserId(null);
  };

  const handleRoomUpdated = async () => {
    await fetchAllData();
    setEditRoomId(null);
  };

  const handleBookingCreated = async () => {
    await fetchAllData();
    setEditBookingData(null);
  };

  const handleContactResponded = (updatedContact) => {
    setContacts((prevContacts) =>
      prevContacts.map((c) => (c._id === updatedContact._id ? updatedContact : c))
    );
    setSelectedContact(null);
  };

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

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {loading && <Spinner animation="border" className="mt-3" />}

      <Row className="mt-3">
        {activeSection === "users" && (
          <Row>
            <Col md={6}>
              <UsersList
                users={users}
                loading={loading}
                onEdit={setEditUserId}
                fetchUsers={fetchAllData}
              />
            </Col>
            <Col md={6}>
              {editUserId ? (
                <UsersEdit
                  userId={editUserId}
                  auth={auth}
                  onUserUpdated={handleUserUpdated}
                  onCancel={() => setEditUserId(null)}
                  fetchUsers={fetchAllData}
                />
              ) : (
                <Alert variant="info">Selecciona un usuario para editar</Alert>
              )}
            </Col>
          </Row>
        )}

        {activeSection === "rooms" && (
          <Row>
            <Col md={6}>
              <RoomsList
                rooms={rooms}
                auth={auth}
                onEditRoom={setEditRoomId}
                refreshRooms={fetchAllData}
              />
            </Col>
            <Col md={6}>
              {editRoomId ? (
                <RoomsEdit
                  roomId={editRoomId}
                  auth={auth}
                  onRoomUpdated={handleRoomUpdated}
                  onCancel={() => setEditRoomId(null)}
                />
              ) : (
                <RoomsCreate auth={auth} onRoomCreated={handleRoomUpdated} />
              )}
            </Col>
          </Row>
        )}

        {activeSection === "bookings" && (
          <Row>
            <Col md={6}>
              <BookingsList
                bookings={bookings}
                auth={auth}
                onEditBooking={setEditBookingData}
                refreshBookings={fetchAllData}
              />
            </Col>
            <Col md={6}>
              {editBookingData ? (
                <BookingsEdit
                  bookingData={editBookingData}
                  auth={auth}
                  onBookingUpdated={handleBookingCreated}
                  onCancel={() => setEditBookingData(null)}
                />
              ) : (
                <BookingsCreate
                  auth={auth}
                  rooms={rooms}
                  onBookingCreated={handleBookingCreated}
                />
              )}
            </Col>
          </Row>
        )}

        {activeSection === "contact" && (
          <Col>
            {selectedContact ? (
              <ContactsEdit
                auth={auth}
                contactData={selectedContact}
                onContactResponded={handleContactResponded}
                onCancel={() => setSelectedContact(null)}
              />
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Mensaje</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.message}</td>
                        <td>{c.status || "pendiente"}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => setSelectedContact(c)}
                          >
                            Contestar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteContact(c._id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {!contacts.length && <Alert variant="info">No hay mensajes de contacto</Alert>}
              </>
            )}
          </Col>
        )}

       {activeSection === "availability" && (
        <Col>
          <Alert variant="success">
            Disponibilidad inicializada correctamente {/* o “actualizada” */}
            <br />
            <small>
              Desde <strong>{today.toLocaleDateString()}</strong> hasta{" "}
              <strong>{endDate.toLocaleDateString()}</strong>
            </small>
          </Alert>
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
