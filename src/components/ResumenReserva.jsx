import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../CONFIG/api';
import '../pages/styles/resumenReserva.css';

const ResumenReserva = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.cabana) {
    return (
      <div className="error-message">
        No hay datos de reserva disponibles. <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const usuario = JSON.parse(localStorage.getItem("user"));
  const userId = usuario?.id;
  const token = localStorage.getItem('token');

  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(null);
  const [animar, setAnimar] = useState(false);
  const [cargando, setCargando] = useState(false); // 👈 Nuevo estado

  const calcularNoches = (checkIn, checkOut) => {
    const entrada = new Date(checkIn);
    const salida = new Date(checkOut);
    const diffTime = salida - entrada;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const noches = calcularNoches(state.checkInDate, state.checkOutDate);
  const precioPorNoche = state.cabana.price || 0;
  const totalPrice = noches * precioPorNoche;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (mensajeConfirmacion) {
      setAnimar(true);
      const timer = setTimeout(() => setAnimar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [mensajeConfirmacion]);

  const confirmarReserva = async () => {
    try {
      setCargando(true); // 👈 Activamos loading

      if (!userId) throw new Error('Usuario no autenticado o ID inválido');

      const reservaData = {
        roomId: state.cabana._id,
        userId,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        passengersCount: state.passengersCount,
        totalPrice,
      };

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservaData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al confirmar reserva');
      }

      setMensajeConfirmacion('¡Reserva confirmada con éxito! Se envió un mail a su correo.');
    } catch (error) {
      setMensajeConfirmacion('No se pudo confirmar la reserva: ' + error.message);
    } finally {
      setCargando(false); // 👈 Desactivamos loading
    }
  };

  const cancelarReserva = () => {
    navigate(-1);
  };

  if (mensajeConfirmacion) {
    return (
      <div className={`mensaje-confirmacion ${animar ? 'aparecer' : ''}`} role="alert" aria-live="polite">
        {mensajeConfirmacion}
      </div>
    );
  }

  return (
    <div className="resumen-reserva-container">
      <h2 className="resumen-reserva-title">Resumen de Reserva</h2>

      <div className="resumen-reserva-info">
        <span className="label">Cabaña:</span>
        <span>{state.cabana.roomNumber || 'N/A'}</span>
      </div>
      <div className="resumen-reserva-info">
        <span className="label">Check-in:</span>
        <span>{formatDate(state.checkInDate)}</span>
      </div>
      <div className="resumen-reserva-info">
        <span className="label">Check-out:</span>
        <span>{formatDate(state.checkOutDate)}</span>
      </div>
      <div className="resumen-reserva-info">
        <span className="label">Noches:</span>
        <span>{noches}</span>
      </div>
      <div className="resumen-reserva-info">
        <span className="label">Pasajeros:</span>
        <span>{state.passengersCount || 'N/A'}</span>
      </div>

      <div className="resumen-reserva-total">
        Precio total estimado: USD ${totalPrice.toLocaleString('es-AR')}
      </div>

      <div className="resumen-reserva-buttons">
        <button onClick={confirmarReserva} className="btn-confirmar" disabled={cargando}>
          {cargando ? 'Confirmando...' : 'Confirmar Reserva'}
        </button>
        <button onClick={cancelarReserva} className="btn-cancelar" aria-label="Cancelar reserva">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ResumenReserva;

