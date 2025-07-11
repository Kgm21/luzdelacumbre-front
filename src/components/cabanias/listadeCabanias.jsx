import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaUsers } from 'react-icons/fa';
import { API_URL } from '../../CONFIG/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./cardcabanas.css";
import { set } from 'date-fns/set';

function CardsCabanas({ cabana, checkInDate, checkOutDate, passengersCount, userId, onBookingSuccess, showPrice = true, modoSimple = false, className = "" }) {
    const navigate = useNavigate();
    const [reserva, setreserva] = useState("")

  
  if (!cabana) {
    return <p>No hay datos de cabaña disponibles.</p>;
  }

  const descriptionParts = cabana.description ? cabana.description.split('\n') : [];
  const detailedDescription = descriptionParts.slice(1).join(' ');
  const allImageUrls = cabana.imageUrls || [];

  const getImageUrl = (url) =>
    url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? url : '/' + url}`;

const handleReservar = async () => {
  if (!userId) {
    navigate('/login')
  }
  const token = localStorage.getItem("token")

  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` ,
      },
      body: JSON.stringify({
        roomId: cabana._id,
        checkInDate,
        checkOutDate,
        passengersCount,
      }),
    });

    const data = await response.json();

    console.log("DATA RESERVA: ", data)

    if (!response.ok) {
       if (data.errors) {
      console.error("Errores de validación:", data.errors);
      alert(
        `Errores:\n${data.errors.map((err) => `• ${err.msg}`).join("\n")}`
      );
    } else {
      alert(`Error: ${data.message || 'Error al crear la reserva'}`);
    }
    throw new Error(data.message || 'Error al crear la reserva');
    }
   

    setreserva("reserva")
    if (onBookingSuccess) onBookingSuccess(data.booking);

  } catch (error) {
    console.error('Error en la reserva:', error);
  }
};

  return (
    <div className={`card-cabanas ${modoSimple ? 'homepage-card' : ''} ${className}`}>
      {/* Imagen / carrusel a la izquierda */}
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

      {/* Contenido a la derecha */}
      <div className="content">
        {cabana.roomNumber && (
          <h3 className={`mb-2 ${modoSimple ? '' : 'text-gray-800'}`}>
            Cabaña: {cabana.roomNumber}
          </h3>
        )}

        {modoSimple ? (
          <>
            {detailedDescription && (
              <p className="line-clamp-2">{detailedDescription}</p>
            )}
            <div className="flex">
              <FaUsers className="mr-1" />
              <span className="font-semibold">Capacidad:</span> Hasta {cabana.capacity} personas
            </div>
          </>
        ) : (
          <>
            {detailedDescription && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{detailedDescription}</p>
            )}
            <div className="flex items-center text-gray-700 text-xs mb-3">
              <FaUsers className="mr-1 text-gray-600" />
              <span className="font-semibold">Capacidad:</span> Hasta {cabana.capacity} personas
            </div>

            {showPrice && (
              <div className="price-section">
                <p className="text-xs text-gray-500 mb-0.5">Tarifas desde</p>
                <p className="text-lg font-bold text-blue-700 mb-2">
                  USD ${cabana.price} / noche <span className="text-xs text-gray-500">+IVA</span>
                </p>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 rounded-md transition-colors duration-200 text-sm" onClick={handleReservar}>
                  {reserva?'RESERVADO': 'Reservar'}
                </button>
                {reserva && (<p className="mensaje-reserva-exitosa">Reserva Exitosa</p>)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CardsCabanas;
