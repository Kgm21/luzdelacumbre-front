import React from 'react';
import "./listadeCabanias.css";

function CardsCabanas({ cabana }) {
  if (!cabana) {
    return <p>No hay datos de cabaña disponibles</p>;
  }

  return (
    <div className="cabana-card rounded-lg shadow-lg overflow-hidden">
      <img
        className="cabana-img w-full h-48 object-cover"
        src={cabana.imageUrls?.[0] || 'https://placehold.co/600x400?text=Sin+imagen'}
        alt={cabana.roomNumber}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{`${cabana.type} ${cabana.description.split('\n')[0]}`}</h3>
        <p className="text-gray-700 mb-2">Capacidad: {cabana.capacity}</p>
        <p className="text-gray-700 font-bold">${cabana.price} / noche</p>
      </div>
    </div>
  );
}

export default CardsCabanas;