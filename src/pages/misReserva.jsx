import React, { useEffect, useState } from 'react';
import { API_URL } from '../CONFIG/api';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  // corregido import
import { Card, Button, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import '../pages/styles/MyBookings.css';

function MyBookings() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function formatDateUTC(dateStr) {
  if (!dateStr) return "Sin fecha";
  const d = new Date(dateStr);
  return isNaN(d)
    ? "Fecha inválida"
    : d.toLocaleDateString("es-AR", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
}

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

    try {
      const res = await fetch(`${API_URL}/api/bookings/mias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al cancelar la reserva.');
      }

      setReservas((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(auth.token);
      userId = decoded.uid || decoded._id;
    } catch {
      setError('Error al decodificar el token. Contacta al administrador.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/bookings/mias`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            [401, 403].includes(res.status)
              ? data.message || 'No tienes permisos para ver las reservas.'
              : data.message || 'Error al cargar reservas.'
          );
        }

        const data = await res.json();
       console.log('Reservas recibidas:', data);


        // Validar que data.data sea array
        setReservas(Array.isArray(data) ? data : []);

      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    return () => controller.abort();
  }, [auth]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
          {error.includes('autenticado') && (
            <div className="mt-3">
              <Button variant="primary" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
            </div>
          )}
        </Alert>
      </Container>
    );
  }

  // Protección segura ante reservas no definidas o no array
  if (!reservas || !Array.isArray(reservas) || reservas.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info" className="text-center">
          No tienes reservas realizadas.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center section-title">Mis Reservas</h2>
      <Row className="g-4">
        {reservas.map((r) => {
          const checkIn = format(parseISO(r.checkInDate), 'dd/MM/yyyy');
          const checkOut = format(parseISO(r.checkOutDate), 'dd/MM/yyyy');
          return (
            <Col key={r._id} xs={12} md={6} lg={4}>
              <Card className="booking-card h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold mb-2">
                    Cabaña #{r.roomId?.roomNumber || '—'}
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    <div><strong>Fechas:</strong> {checkIn} – {checkOut}</div>
                    <div><strong>Huéspedes:</strong> {r.passengersCount}</div>
                    <div><strong>Total:</strong> USD ${r.totalPrice?.toLocaleString()}</div>
                    <div>
                      <strong>Estado:</strong>{' '}
                      <span className={`status-badge status-${r.status}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>
                  </Card.Text>

                  <div className="d-grid gap-2 mt-auto">
                    {!r.paid && (
                      <Button variant="success" onClick={() => navigate(`/pago/${r._id}`)}>
                        Pagar ahora
                      </Button>
                    )}
                    <Button variant="outline-danger" onClick={() => handleDelete(r._id)}>
                      Cancelar reserva
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted text-end small">
                  Creada: {format(parseISO(r.createdAt), 'dd/MM/yyyy')}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default MyBookings;
