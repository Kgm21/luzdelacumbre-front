import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DateRange } from 'react-date-range';
import { format, differenceInDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './styles/reservas.css';
import { FaCalendarAlt, FaUserFriends, FaTag, FaSearch } from 'react-icons/fa';
const baseUrl = 'https://luzdelacumbre-back.onrender.com';
import CardsCabanas from '../components/cabañas/listadeCabanias';

function Reservas() {
  console.log('Base URL:', baseUrl);

  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [habitaciones, setHabitaciones] = useState(1);
  const [codigoPromocional, setCodigoPromocional] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarHuespedes, setMostrarHuespedes] = useState(false);
  const [cabanasDisponibles, setCabanasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const calendarioRef = useRef(null);
  const huespedesRef = useRef(null);
  const searchBarRef = useRef(null);

  const MIN_NIGHTS = 5; // Igual que en el backend

  useEffect(() => {
    const manejarClickAfuera = (e) => {
      if (
        calendarioRef.current &&
        !calendarioRef.current.contains(e.target) &&
        !e.target.closest('.search-bar-item div[onClick*="setMostrarCalendario"]') &&
        !e.target.closest('.rdrDateRangeWrapper')
      ) {
        setMostrarCalendario(false);
      }
      if (
        huespedesRef.current &&
        !huespedesRef.current.contains(e.target) &&
        !e.target.closest('.search-bar-item div[onClick*="setMostrarHuespedes"]')
      ) {
        setMostrarHuespedes(false);
      }
    };

    document.addEventListener('mousedown', manejarClickAfuera);
    return () => {
      document.removeEventListener('mousedown', manejarClickAfuera);
    };
  }, []);

  const [rangoFecha, setRangoFecha] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + MIN_NIGHTS)), // Ajustar fecha inicial
      key: 'selection',
    },
  ]);

  const cambiarCantidad = (tipo, valor) => {
    if (tipo === 'adultos') {
      setAdultos((prev) => Math.max(1, prev + valor));
    } else if (tipo === 'ninos') {
      setNinos((prev) => Math.max(0, prev + valor));
    } else if (tipo === 'habitaciones') {
      setHabitaciones((prev) => Math.max(1, prev + valor));
    }
  };

  const fetchCabanas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const start = rangoFecha[0].startDate;
      const end = rangoFecha[0].endDate;

      // Validar fechas en el frontend
      if (end <= start) {
        setError('La fecha de salida debe ser posterior a la fecha de llegada.');
        setCabanasDisponibles([]);
        return;
      }

      const nights = differenceInDays(end, start);
      if (nights < MIN_NIGHTS) {
        setError(`La reserva debe ser de al menos ${MIN_NIGHTS} noches.`);
        setCabanasDisponibles([]);
        return;
      }

      // Validar totalGuests
      const totalGuests = adultos + ninos;
      if (totalGuests < 1 || totalGuests > 6) {
        setError('La cantidad de pasajeros debe estar entre 1 y 6.');
        setCabanasDisponibles([]);
        return;
      }

      const formattedStartDate = format(start, 'yyyy-MM-dd');
      const formattedEndDate = format(end, 'yyyy-MM-dd');

      const apiUrl = `${baseUrl}/api/availability/available-rooms?startDate=${formattedStartDate}&endDate=${formattedEndDate}&guests=${totalGuests}`;

      console.log('Fetching from:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.log('Error data:', errorData);
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);
      setCabanasDisponibles(data);
      console.log('cabanasDisponibles actualizado:', data);
    } catch (e) {
      console.error('Error al obtener cabañas:', e);
      setError(`No se pudieron cargar las cabañas: ${e.message}. Inténtalo de nuevo.`);
      setCabanasDisponibles([]);
    } finally {
      setCargando(false);
    }
  }, [rangoFecha, adultos, ninos, baseUrl]);

  useEffect(() => {
    fetchCabanas();
  }, [fetchCabanas]);

  const buscarHospedaje = () => {
    fetchCabanas();
    const inicio = format(rangoFecha[0].startDate, 'dd MMM');
    const fin = format(rangoFecha[0].endDate, 'dd MMM');
    console.log(
      `Buscando hospedaje del ${inicio} al ${fin}, para ${adultos} adultos, ${ninos} niños y ${habitaciones} habitación(es). Código promocional: ${codigoPromocional}`
    );
  };

  return (
    <>
      <header
        className="relative h-[36rem] bg-cover bg-center text-white shadow-lg flex flex-col items-center justify-center p-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">¡Reserva Ahora!</h1>
          <p className="text-xl">El mejor precio, sólo en nuestro sitio oficial, garantizado.</p>
        </div>
        <div className="search-bar-container" ref={searchBarRef}>
          <div className="search-bar-item">
            <label>Llegada</label>
            <div
              className="search-bar-input flex items-center justify-between"
              onClick={() => {
                setMostrarCalendario(!mostrarCalendario);
                setMostrarHuespedes(false);
              }}
            >
              <span>{format(rangoFecha[0].startDate, 'dd/MM/yyyy')}</span>
              <FaCalendarAlt className="text-gray-400" />
            </div>
            {mostrarCalendario && (
              <div ref={calendarioRef}>
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setRangoFecha([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={rangoFecha}
                  minDate={new Date()} // Evitar fechas pasadas
                />
              </div>
            )}
          </div>
          <div className="search-bar-item">
            <label>Salida</label>
            <div
              className="search-bar-input flex items-center justify-between"
              onClick={() => {
                setMostrarCalendario(!mostrarCalendario);
                setMostrarHuespedes(false);
              }}
            >
              <span>{format(rangoFecha[0].endDate, 'dd/MM/yyyy')}</span>
              <FaCalendarAlt className="text-gray-400" />
            </div>
          </div>
          <div className="search-bar-item">
            <label>Huéspedes</label>
            <div
              className="search-bar-input flex items-center justify-between"
              onClick={() => {
                setMostrarHuespedes(!mostrarHuespedes);
                setMostrarCalendario(false);
              }}
            >
              <span>{`${adultos} adultos, ${ninos} niños, ${habitaciones} habitación`}</span>
              <FaUserFriends className="text-gray-400" />
            </div>
            {mostrarHuespedes && (
              <div
                className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg rounded-lg huespedes-popover"
                ref={huespedesRef}
              >
                <div className="flex justify-between items-center mb-2">
                  <span>Adultos</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => cambiarCantidad('adultos', -1)} className="cantidad-btn">
                      –
                    </button>
                    <span>{adultos}</span>
                    <button onClick={() => cambiarCantidad('adultos', 1)} className="cantidad-btn">
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Niños</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => cambiarCantidad('ninos', -1)} className="cantidad-btn">
                      –
                    </button>
                    <span>{ninos}</span>
                    <button onClick={() => cambiarCantidad('ninos', 1)} className="cantidad-btn">
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Habitaciones</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => cambiarCantidad('habitaciones', -1)} className="cantidad-btn">
                      –
                    </button>
                    <span>{habitaciones}</span>
                    <button onClick={() => cambiarCantidad('habitaciones', 1)} className="cantidad-btn">
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
         
          <button
            onClick={buscarHospedaje}
            className="boton-ver-tarifas flex items-center justify-center gap-2"
          >
            Ver Tarifas
            <FaSearch className="search-icon" />
          </button>
        </div>
      </header>
      <section className="max-w-6xl mx-auto mt-8 px-6 text-center">
        <h2 className="text-2xl font-bold mb-8 text-[var(--marron)]">
          Vouchers seleccionados especialmente para usted
        </h2>
      </section>
      <div className="reservas-main-content">
        <section className="max-w-6xl mx-auto px-6 w-full mt-0">
          <h2 className="text-3xl font-bold mb-8 text-[var(--marron)] text-center">
            Hospedajes recomendados
          </h2>
          {cargando && <p className="text-center text-xl text-gray-700">Cargando cabañas...</p>}
          {error && (
            <div className="text-center">
              <p className="text-xl text-red-600">{error}</p>
              <button
                onClick={fetchCabanas}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Reintentar
              </button>
            </div>
          )}
          {!cargando && !error && cabanasDisponibles.length === 0 && (
            <p className="text-center text-xl text-gray-700">
              No se encontraron cabañas para los filtros seleccionados.
            </p>
          )}
          <div className="grid grid-cols-1 gap-8">
  {!cargando && !error && cabanasDisponibles.map(c => (
    <CardsCabanas key={c._id} cabana={c} />
  ))}
</div>

        </section>
      </div>
    </>
  );
}

export default Reservas;