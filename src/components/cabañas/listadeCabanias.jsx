import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import { FaUsers } from 'react-icons/fa';
import {API_URL} from '../../CONFIG/api';
import './cardcabanas.css'
function CardsCabanas({ cabana }) {
  if (!cabana) {
    return <p>No hay datos de cabaña disponibles.</p>;
  }

  const mainDescription = cabana.description.split('\n')[0];
  const detailedDescription = cabana.description.split('\n').slice(1).join(' ');
  const allImageUrls = cabana.imageUrls || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row mb-6 max-w-xl mx-auto">
      {/* Sección del Carrusel */}
      <div className="md:w-2/5 flex-shrink-0">
        {allImageUrls.length > 0 ? (
          <Carousel
            showArrows
            showStatus={false}
            showIndicators
            infiniteLoop
            useKeyboardArrows
            autoPlay
            showThumbs={false}
            className="h-48 md:h-full"
          >
            {allImageUrls.map((relativeUrl, index) => {
              const finalUrl = `${API_URL}${relativeUrl}`;
              return (
                <div key={index} className="h-48 md:h-full">
                  <img
                    src={finalUrl}
                    alt={`Cabaña ${cabana.type} - ${cabana.roomNumber} imagen ${index + 1}`}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                </div>
              );
            })}
          </Carousel>
        ) : (
          <img
            src="https://via.placeholder.com/400x300?text=Sin+imagen"
            alt="Sin imagen"
            className="w-full h-48 object-cover rounded-l-lg"
          />
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 md:w-3/5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Cabaña {cabana.type.charAt(0).toUpperCase() + cabana.type.slice(1)} {mainDescription}
          </h3>

          {detailedDescription && (
            <p className="text-xs text-gray-600 mb-2">{detailedDescription}</p>
          )}

          <div className="flex items-center text-gray-700 text-xs mb-3">
            <FaUsers className="mr-1 text-gray-600" />
            <span className="font-semibold">Capacidad:</span> Hasta {cabana.capacity} personas
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-0.5">Tarifas desde</p>
          <p className="text-xl font-bold text-blue-700 mb-2">
            USD ${cabana.totalPrice} <span className="text-xs text-gray-500">+IVA</span>
          </p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition-colors duration-200 text-sm">
            Ver Tarifas
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardsCabanas;