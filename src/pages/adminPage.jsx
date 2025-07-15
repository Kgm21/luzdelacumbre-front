import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Nav, Table } from "react-bootstrap";
import axios from "axios";
import "./styles/adminPage.css"

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
  const [availabilityEndDate, setAvailabilityEndDate] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [errorContacts, setErrorContacts] = useState("");
  const [replyingContactId, setReplyingContactId] = useState(null);
const [replyMessage, setReplyMessage] = useState("");


  const [info, setInfo] = useState(false);

  const handleInitAvailability = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/availability/init`,
      {},
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    // Calcula 5 meses a partir de hoy
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 5);
    setAvailabilityEndDate(endDate);

    setInfo(true);
    return response.data;
  } catch (error) {
    console.error("Error al inicializar disponibilidad:", error);
  }
};

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers("");
    try {
      const res = await axios.get(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(res.data.usuarios || []);
    } catch (err) {
      setErrorUsers(err.response?.data?.message || err.message);
      setUsers([]);
    }
    setLoadingUsers(false);
  };

  const fetchRooms = async () => {
    setLoadingRooms(true);
    setErrorRooms("");
    try {
      const res = await axios.get(`${API_URL}/api/rooms`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setRooms(res.data.data || []);
    } catch (err) {
      setErrorRooms(err.response?.data?.message || err.message);
    }
    setLoadingRooms(false);
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setErrorBookings("");
    try {
      const res = await axios.get(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setBookings(res.data.data || []);
    } catch (err) {
      setErrorBookings(err.response?.data?.message || err.message);
    }
    setLoadingBookings(false);
  };

const fetchContacts = async () => {
  setLoadingContacts(true);
  setErrorContacts("");
  try {
    const res = await axios.get(`${API_URL}/api/contact`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    const contactsArray = res.data || [];

   contactsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    setContacts(contactsArray);
  } catch (err) {
    setErrorContacts(err.response?.data?.message || err.message);
  }
  setLoadingContacts(false);
};


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
      case "contact":
        fetchContacts();
        break;
      case "availability":
        setInfo(false); // Reset info al cambiar a disponibilidad
        handleInitAvailability().then(() => {
          fetchRooms().then(() => {
            setInfo(true);
          });
        });
        break;
      default:
        break;
    }
  }, [activeSection, auth]);

  const handleDeleteContact = async (id) => {
  if (!id) return;
  if (!window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) return;

  try {
    // Opcional: puedes mostrar una animación o estado de cargando aquí
    await axios.delete(`${API_URL}/api/contact/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    alert("Contacto eliminado correctamente.");
    fetchContacts(); // Actualiza la lista
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    alert(
      error.response?.data?.message ||
        "Ocurrió un error al intentar eliminar el contacto."
    );
  }
};


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
        <Nav.Link eventKey="contact">Contactos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="availability">Disponibilidad</Nav.Link>
      </Nav.Item>
    </Nav>

    <Row className="mt-3">
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

      {/* Botón para inicializar disponibilidad */}
      <Button onClick={handleInitAvailability} disabled={info} className="mb-2">
        Inicializar Disponibilidad
      </Button>

      {/* Mostrar mensaje con la fecha hasta cuando está disponible */}
      {info && availabilityEndDate && (
        <Alert variant="success">
          Disponibilidad activa hasta{" "}
          {availabilityEndDate.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Alert>
      )}

      {/* Mostrar fecha y hora de la última inicialización */}
      {info && (
        <p>
          Última inicialización:{" "}
          {availabilityEndDate.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      )}

      {loadingRooms || !info ? (
        <p>Cargando disponibilidad...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table responsive striped bordered hover>
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
                  <td>
                    {room.updatedAt
                      ? new Date(room.updatedAt).toLocaleString("es-ES")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Col>
  </Row>
)}

    {activeSection === "contact" && (
      <Row>
        <Col>
          <h3>Contactos</h3>
          {loadingContacts && <p>Cargando contactos...</p>}
          {errorContacts && <Alert variant="danger">{errorContacts}</Alert>}
          {!loadingContacts && !errorContacts && contacts.length === 0 && <p>No hay contactos.</p>}
          {contacts.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Mensaje</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.message}</td>
                      <td>{new Date(contact.createdAt).toLocaleString()}</td>
                      <td>
                        {replyingContactId === contact._id ? (
                          <>
                            <textarea
                              rows={3}
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder={`Escribe tu respuesta a ${contact.name}...`}
                              style={{ width: "100%", marginBottom: "0.5rem" }}
                            />
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                              <Button
                                variant="success"
                                size="sm"
                                className="me-md-2 mb-2 mb-md-0"
                                onClick={() => {
                                  alert(`Respuesta enviada a ${contact.name}:\n\n${replyMessage}`);
                                  setReplyingContactId(null);
                                  setReplyMessage("");
                                }}
                                disabled={!replyMessage.trim()}
                              >
                                Enviar
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setReplyingContactId(null);
                                  setReplyMessage("");
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                            <Button
                              variant="primary"
                              size="sm"
                              className="me-md-2 mb-2 mb-md-0 btn-contact-action"
                              onClick={() => setReplyingContactId(contact._id)}
                            >
                              Responder
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="btn-contact-action"
                              onClick={() => handleDeleteContact(contact._id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    )}
  </Container>
);

};

export default AdminPage;
