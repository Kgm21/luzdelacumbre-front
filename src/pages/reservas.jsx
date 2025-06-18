import React, { useState } from 'react';
import "./styles/reservas.css";

function CardsCabanas() {
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [noches, setNoches] = useState('1 noche');
  const [mes, setMes] = useState('Junio 2025');

  const cambiarCantidad = (tipo, valor) => {
    if (tipo === 'adultos') {
      setAdultos(prev => Math.max(0, prev + valor));
    } else if (tipo === 'ninos') {
      setNinos(prev => Math.max(0, prev + valor));
    }
  };

  const buscarHospedaje = () => {
    alert(`Buscando hospedaje en ${mes}, por ${noches}, para ${adultos} adultos y ${ninos} niños.`);
  };

  const cabanas = [
    {
      nombre: 'Cabaña La Montaña',
      ubicacion: 'San Martín de los Andes',
      precio: 'AR$ 23.400',
      imagen: 'https://source.unsplash.com/featured/?forest,mountain,cabaña'
    },
    {
      nombre: 'Refugio del Bosque',
      ubicacion: 'Villa La Angostura',
      precio: 'AR$ 28.000',
      imagen: 'https://source.unsplash.com/featured/?cabin,woods,lake'
    },
    {
      nombre: 'Amanecer Serrano',
      ubicacion: 'Mina Clavero',
      precio: 'AR$ 19.900',
      imagen: 'https://source.unsplash.com/featured/?mountain,river,argentina'
    },
    {
      nombre: 'Rincón Escondido',
      ubicacion: 'Bariloche',
      precio: 'AR$ 32.000',
      imagen: 'https://source.unsplash.com/featured/?lake,patagonia,cabaña'
    }
  ];

  return (
    <>
     

      {/* Header con buscador */}
      <header
        className="relative h-[36rem] bg-cover bg-center text-white shadow-lg"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')` }}
      >
        <div className="bg-black bg-opacity-40 h-full w-full flex flex-col items-center justify-end p-8">
          <div className="buscador rounded-2xl shadow-2xl flex flex-wrap items-center justify-center gap-6 p-8 max-w-5xl w-full bg-white text-black">
            {/* Fechas */}
            <div>
              <label className="block text-sm font-semibold mb-1">Fechas</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-52"
                value={noches}
                onChange={(e) => setNoches(e.target.value)}
              >
                <option>1 noche</option>
                <option>2-3 noches</option>
                <option>4-5 noches</option>
                <option>6-7 noches</option>
              </select>
            </div>

            {/* Mes */}
            <div>
              <label className="block text-sm font-semibold mb-1">Mes</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-52"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              >
                <option>Junio 2025</option>
                <option>Julio 2025</option>
                <option>Agosto 2025</option>
                <option>Septiembre 2025</option>
                <option>Octubre 2025</option>
                <option>Noviembre 2025</option>
              </select>
            </div>

            {/* Adultos */}
            <div>
              <label className="block text-sm font-semibold mb-1">Adultos</label>
              <div className="flex items-center gap-2">
                <button onClick={() => cambiarCantidad('adultos', -1)} className="cantidad-btn">–</button>
                <span className="text-base font-semibold w-6 text-center">{adultos}</span>
                <button onClick={() => cambiarCantidad('adultos', 1)} className="cantidad-btn">+</button>
              </div>
            </div>

            {/* Niños */}
            <div>
              <label className="block text-sm font-semibold mb-1">Niños</label>
              <div className="flex items-center gap-2">
                <button onClick={() => cambiarCantidad('ninos', -1)} className="cantidad-btn">–</button>
                <span className="text-base font-semibold w-6 text-center">{ninos}</span>
                <button onClick={() => cambiarCantidad('ninos', 1)} className="cantidad-btn">+</button>
              </div>
            </div>

            <button
              onClick={buscarHospedaje}
              className="boton-principal px-6 py-2 rounded-xl mt-2 font-semibold text-sm shadow-md"
            >
              Buscar hospedaje
            </button>
          </div>
        </div>
      </header>

      {/* Hospedajes Recomendados */}
      <section className="max-w-6xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-[var(--marron)]">Hospedajes recomendados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {cabanas.map((cabana, index) => (
            <div key={index} className="tarjeta rounded-xl shadow-md overflow-hidden bg-white">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('${cabana.imagen}')` }}
              ></div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-1">{cabana.nombre}</h3>
                <p className="text-sm text-gray-500 mb-2">{cabana.ubicacion}</p>
                <p className="precio font-bold text-lg">{cabana.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
    </>
  );
}

export default CardsCabanas;
