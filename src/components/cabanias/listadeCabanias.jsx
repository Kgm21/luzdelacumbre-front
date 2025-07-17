import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaUsers } from 'react-icons/fa';
import { API_URL } from '../../CONFIG/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./cardcabanas.css";

function CardsCabanas({ cabana, checkInDate, checkOutDate, passengersCount, userId, onBookingSuccess, showPrice = true, modoSimple = false, isReservation = false, className = "" }) {
  const navigate = useNavigate();
  const [reserva, setReserva] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Depuración: Verificar los datos recibidos
  console.log("Datos de la cabaña:", cabana);

  if (!cabana) {
    return <p>No hay datos de cabaña disponibles.</p>;
  }

  const descriptionParts = cabana.description ? cabana.description.split('\n') : [];
  const detailedDescription = descriptionParts.slice(1).join(' ');
  const allImageUrls = cabana.imageUrls || [];

  const getImageUrl = (url) =>
    url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? url : '/' + url}`;

  const handleReservar = () => {
    if (!userId) {
      alert("Debes iniciar sesión para hacer una reserva.");
      window.setTimeout(() => {
        navigate('/login');
      }, 400);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") {
      setError("Token no válido o no encontrado. Por favor, inicia sesión nuevamente.");
      window.setTimeout(() => {
        navigate('/login');
      }, 400);
      return;
    }

    // Redirigir a /resumen-reserva con los datos de la reserva
    console.log("Redirigiendo a /resumen-reserva con datos:", { cabana, checkInDate, checkOutDate, passengersCount });
    navigate('/resumen-reserva', {
      state: {
        cabana,
        checkInDate,
        checkOutDate,
        passengersCount,
        userId,
      },
    });
  };

  return (
    <div className={`card-cabanas ${isReservation ? 'reservas' : ''} ${modoSimple ? 'homepage-card' : ''} ${className}`}>
      <div className="carousel">
        {allImageUrls.length > 0 ? (
          <Carousel
            showArrows
            showStatus={false}
            showIndicators
            infiniteLoop
            useKeyboardArrows
            autoPlay
            showThumbs={false}
            className="room-carousel"
          >
            {allImageUrls.map((relativeUrl, index) => (
              <div key={index} className="slide-content">
                <img
                  src={getImageUrl(relativeUrl)}
                  alt={`Cabaña ${cabana.title} - ${cabana.roomNumber} imagen ${index + 1}`}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x250'; console.log('Imagen no cargada:', relativeUrl); }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <img
            src="https://via.placeholder.com/300x250"
            alt="Sin imagen disponible"
            className="placeholder-image"
          />
        )}
      </div>

      <div className="content">
        {cabana.roomNumber && (
          <h3 className={`mb-2 ${modoSimple ? '' : 'text-gray-800'}`}>
            Cabaña: {cabana.roomNumber}
          </h3>
        )}

        {modoSimple ? (
          <>
            {detailedDescription && (
              <p>{detailedDescription}</p>
            )}
            <div className="flex">
              <FaUsers className="mr-1" />
              <span className="font-semibold"> Capacidad:</span> Hasta {cabana.capacity} personas
            </div>
          </>
        ) : (
          <>
            {detailedDescription && (
              <p className="text-xs text-gray-600 mb-2">{detailedDescription}</p>
            )}
            <div className="flex items-center text-gray-700 text-xs mb-3">
              <FaUsers className="mr-1 text-gray-600" />
              <span className="font-semibold"> Capacidad:</span> Hasta {cabana.capacity} personas
            </div>

            {showPrice && (
              <div className="price-section">
                <p className="text-xs text-gray-500 mb-0.5">Tarifas desde</p>
                <p className="text-lg font-bold text-blue-700 mb-2">
                  USD ${(cabana.price || 0)} / noche <span className="text-xs text-gray-500">+IVA</span>
                </p>
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 rounded-md transition-colors duration-200 text-sm"
                  onClick={handleReservar}
                  disabled={!!reserva || loading}
                >
                  {reserva ? 'RESERVADO' : loading ? 'Reservando...' : 'Reservar'}
                </button>
                {reserva && (<p className="mensaje-reserva-exitosa">Reserva Exitosa</p>)}
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CardsCabanas;