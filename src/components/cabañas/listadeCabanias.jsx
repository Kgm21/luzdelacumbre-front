import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa los estilos del carrusel

const baseUrl = 'https://luzdelacumbre-back.onrender.com';

import { FaUsers, FaSearch } from 'react-icons/fa';

function CardsCabanas({ cabana }) {
    console.log('Cabaña recibida:', cabana.roomNumber);

  if (!cabana) {
    return <p>No hay datos de cabaña disponibles.</p>;
  }

  const mainDescription = cabana.description.split('\n')[0];
  const detailedDescription = cabana.description.split('\n').slice(1).join(' ');

  const allImageUrls = cabana.imageUrls || [];

  return (
    <div className="card-cabana-horizontal bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row mb-6">
      {/* Sección del Carrusel */}
      <div className="md:w-2/5 flex-shrink-0">
        {allImageUrls.length > 0 ? (
          <Carousel 
            showArrows={true} 
            showStatus={false} 
            showIndicators={true} 
            infiniteLoop={true} 
            useKeyboardArrows={true} 
            autoPlay={true} 
            thumbWidth={80} // Ancho de las miniaturas (si showThumbs es true)
            showThumbs={false} // No mostrar miniaturas por defecto (puedes cambiarlas a true)
            className="carousel-container h-full" // Clase para tu contenedor de carrusel
          >
          {allImageUrls.map((relativeUrl, index) => {
  const finalUrl = `${baseUrl}${relativeUrl}`;
  return (
    <div key={index} className="h-full">
      <img
        src={finalUrl}
        alt={`Cabaña ${cabana.type} - ${cabana.roomNumber} imagen ${index + 1}`}
        className="w-full h-full object-cover"
        style={{ minHeight: '200px', maxHeight: '400px' }}
      />
    </div>
  );
})}
          </Carousel>
        ) : (
          // Placeholder si no hay imágenes
          <img
            src="https://via.placeholder.com/400x300?text=Sin+imagen"
            alt="Sin imagen"
            className="w-full h-full object-cover"
            style={{ minHeight: '200px' }}
          />
        )}
      </div>

      {/* Resto del código... */}
      <div className="p-4 md:w-3/5 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Cabaña {cabana.type.charAt(0).toUpperCase() + cabana.type.slice(1)} {mainDescription}
          </h3>

          {detailedDescription && (
            <p className="text-sm text-gray-600 mb-2">{detailedDescription}</p>
          )}

          <div className="flex items-center text-gray-700 text-sm mb-4">
            <FaUsers className="mr-2 text-gray-600" />
            <span className="font-semibold">Capacidad:</span> Hasta {cabana.capacity} personas
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Tarifas desde</p>
          <p className="text-2xl font-bold text-blue-700 mb-2">
            USD ${cabana.price} <span className="text-sm text-gray-500">+IVA</span>
          </p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
            Ver Tarifas
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardsCabanas;