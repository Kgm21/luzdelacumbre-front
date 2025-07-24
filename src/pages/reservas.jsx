import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DateRange } from 'react-date-range';
import { format, differenceInDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { API_URL } from '../CONFIG/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/reservas.css';
import { FaCalendarAlt, FaUserFriends, FaSearch } from 'react-icons/fa';
import CardsCabanas from '../components/cabanias/listadeCabanias';
import ResumenReserva from '../components/ResumenReserva.jsx';

function Reservas() {
  console.log('Base URL:', API_URL);

  const navigate = useNavigate();
  const { auth, validateToken } = useAuth();

  // Mover el log de auth a un useEffect para evitar el error de inicialización
  useEffect(() => {
    console.log('🔍 [Reservas] Auth state:', auth);
  }, [auth]);

  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [habitaciones, setHabitaciones] = useState(1);
  const [codigoPromocional, setCodigoPromocional] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarHuespedes, setMostrarHuespedes] = useState(false);
  const [cabanasDisponibles, setCabanasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [selectedCabana, setSelectedCabana] = useState(null);

  const calendarioRef = useRef(null);
  const huespedesRef = useRef(null);
  const searchBarRef = useRef(null);

  const MIN_NIGHTS = 5;

  useEffect(() => {
    const manejarClickAfuera = (e) => {
      // Cierra el calendario si el click es fuera de él, del input que lo activa y de sus componentes internos
      if (
        calendarioRef.current &&
        !calendarioRef.current.contains(e.target) &&
        !e.target.closest('.search-bar-item div[onClick*="setMostrarCalendario"]') &&
        !e.target.closest('.rdrDateRangeWrapper') // Elemento interno del componente DateRange
      ) {
        setMostrarCalendario(false);
      }
      // Cierra el selector de huéspedes si el click es fuera de él y del input que lo activa
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
      endDate: new Date(new Date().setDate(new Date().getDate() + MIN_NIGHTS)),
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

      const totalGuests = adultos + ninos;
      // Ajuste para permitir hasta 8 huéspedes según la capacidad de tus cabañas en Postman
      // Si solo quieres 6, déjalo en totalGuests > 6
      if (totalGuests < 1 || totalGuests > 8) { // Cambiado de 6 a 8
        setError('La cantidad de pasajeros debe estar entre 1 y 8.'); // Mensaje ajustado
        setCabanasDisponibles([]);
        return;
      }

      const formattedStartDate = format(start, 'yyyy-MM-dd');
      const formattedEndDate = format(end, 'yyyy-MM-dd');

      // Asegúrate de que API_URL es la base de tu backend (ej: https://luzdelacumbre-back.onrender.com)
      const apiUrl = `${API_URL}/api/availability/search/rooms?checkInDate=${formattedStartDate}&checkOutDate=${formattedEndDate}&guests=${totalGuests}`;

      console.log('🔍 [Reservas] Fetching from:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 [Reservas] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.log('🔍 [Reservas] Error data:', errorData);
        throw new Error(errorData.message || response.statusText);
      }

      const rawData = await response.json(); // Esto ahora será tu array directo desde el backend

      let roomsArray = [];
      if (Array.isArray(rawData)) {
        roomsArray = rawData; // Este caso será el que se ejecute ahora
      } else if (rawData && Array.isArray(rawData.rooms)) {
        roomsArray = rawData.rooms;
      } else if (rawData && Array.isArray(rawData.roomsArray)) { // En caso de que se haya envuelto en otra propiedad como 'roomsArray'
        roomsArray = rawData.roomsArray;
      } else if (rawData && Array.isArray(rawData.cabanas)) {
        roomsArray = rawData.cabanas;
      } else {
        // Si la estructura no es la esperada, registra un error y no proceses
        console.error('🔍 [Reservas] Formato de datos de cabañas inesperado:', rawData);
        setError('Formato de datos de cabañas inesperado del servidor. Por favor, contacte a soporte.');
        setCabanasDisponibles([]);
        return;
      }

      const adjustedData = roomsArray.map(cabana => ({
        ...cabana,
        // Construye la URL completa de la imagen.
        // Asegúrate que `API_URL.replace('/api', '')` apunte a la base donde se sirven las estáticas.
        // Si API_URL es https://luzdelacumbre-back.onrender.com/api, esto se convierte en https://luzdelacumbre-back.onrender.com
        imageUrls: Array.isArray(cabana.imageUrls)
          ? cabana.imageUrls.map(url => `${API_URL.replace('/api', '')}${url}`)
          : [],
        image: Array.isArray(cabana.imageUrls) && cabana.imageUrls.length > 0
          ? `${API_URL.replace('/api', '')}${cabana.imageUrls[0]}`
          : null, // Asigna null si no hay imágenes para evitar errores en el renderizado
        price: cabana.price, // Asegura que el precio esté presente si es necesario para CardsCabanas
      }));

      console.log('🔍 [Reservas] Datos recibidos y ajustados:', adjustedData);
      setCabanasDisponibles(adjustedData);

    } catch (e) {
      console.error('🔍 [Reservas] Error al obtener cabañas:', e);
      setError(`No se pudieron cargar las cabañas: ${e.message}. Por favor, verifica tu conexión o intenta más tarde.`);
      setCabanasDisponibles([]);
    } finally {
      setCargando(false);
    }
  }, [rangoFecha, adultos, ninos, API_URL]); // Dependencias correctas

  useEffect(() => {
    // Llama a fetchCabanas al montar el componente para tener una lista inicial
    fetchCabanas();
  }, [fetchCabanas]); // Asegura que se ejecuta cuando fetchCabanas cambia (que es raro, pero es buena práctica)

  const buscarHospedaje = () => {
    fetchCabanas(); // Re-ejecuta la búsqueda con los filtros actuales
    const inicio = format(rangoFecha[0].startDate, 'dd MMM');
    const fin = format(rangoFecha[0].endDate, 'dd MMM');
    console.log(
      `🔍 [Reservas] Buscando hospedaje del ${inicio} al ${fin}, para ${adultos} adultos, ${ninos} niños y ${habitaciones} habitación(es). Código promocional: ${codigoPromocional}`
    );
  };

  const handleReservarClick = async (cabana) => {
    console.log('🔍 [Reservas] handleReservarClick - Auth state:', auth);
    if (!auth.isAuthenticated || !auth.token) {
      setError('Debes iniciar sesión para reservar.');
      // Opcional: Puedes mostrar un modal o alert en lugar de navegar directamente
      navigate('/login');
      return;
    }

    // Validar el token antes de proceder
    const validation = await validateToken(auth.token);
    console.log('🔍 [Reservas] Token validation:', validation);
    if (!validation.valid) {
      setError('Sesión inválida. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

    setSelectedCabana(cabana);
    setError(null); // Limpiar cualquier error previo
    setMostrarResumen(true);
  };

  const handleConfirmarReserva = async () => {
    console.log('🔍 [Reservas] handleConfirmarReserva - Auth state:', auth);
    if (!auth.isAuthenticated || !auth.token) {
      setError('Debes iniciar sesión para confirmar la reserva.');
      navigate('/login');
      return;
    }

    // Validar el token antes de enviar la solicitud
    const validation = await validateToken(auth.token);
    console.log('🔍 [Reservas] Token validation for booking:', validation);
    if (!validation.valid) {
      setError('Sesión inválida. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

    if (!selectedCabana) {
      setError('No hay cabaña seleccionada para la reserva.');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          cabanaId: selectedCabana._id,
          checkInDate: rangoFecha[0].startDate.toISOString(),
          checkOutDate: rangoFecha[0].endDate.toISOString(),
          passengersCount: adultos + ninos,
        }),
      });

      const data = await response.json();
      console.log('🔍 [Reservas] Booking response:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Error al confirmar la reserva');
      }

      alert('Reserva confirmada con éxito!');
      setMostrarResumen(false);
      setSelectedCabana(null);
      navigate('/my-bookings'); // Redirigir a la página de mis reservas
    } catch (error) {
      console.error('🔍 [Reservas] Error en la reserva:', error.message);
      setError(`Error al confirmar la reserva: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarResumen = () => {
    setMostrarResumen(false);
    setSelectedCabana(null);
    setError(null); // Limpiar error al cerrar el resumen
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
                setMostrarHuespedes(false); // Cierra huéspedes al abrir calendario
              }}
            >
              <span>{format(rangoFecha[0].startDate, 'dd/MM/yyyy')}</span>
              <FaCalendarAlt className="text-gray-400" />
            </div>
            {mostrarCalendario && (
              <div ref={calendarioRef} className="absolute z-20 mt-2"> {/* Agregado z-20 para asegurar que esté encima */}
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setRangoFecha([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={rangoFecha}
                  minDate={new Date()}
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
                setMostrarHuespedes(false); // Cierra huéspedes al abrir calendario
              }}
            >
              <span>{format(rangoFecha[0].endDate, 'dd/MM/yyyy')}</span>
              <FaCalendarAlt className="text-gray-400" />
            </div>
            {/* El calendario se muestra una sola vez, por eso no repetimos el bloque aquí */}
          </div>
          <div className="search-bar-item">
            <label>Huéspedes</label>
            <div
              className="search-bar-input flex items-center justify-between"
              onClick={() => {
                setMostrarHuespedes(!mostrarHuespedes);
                setMostrarCalendario(false); // Cierra calendario al abrir huéspedes
              }}
            >
              <span>{`${adultos} adultos, ${ninos} niños`}</span> {/* Eliminada "habitacion" para ser más genérico */}
              <FaUserFriends className="text-gray-400" />
            </div>
            {mostrarHuespedes && (
              <div
                className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg rounded-lg huespedes-popover z-20" /* Agregado z-20 */
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
                {/* La opción de habitaciones se maneja a nivel de cabaña, no como filtro de búsqueda global
                   Puedes re-añadirla si es una necesidad real para tu UI, pero no suele ser común en búsquedas de hospedaje */}
                {/*
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
                */}
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
        <h2 className="text-2xl font-bold mb-8 mt-4 text-center">
          Vouchers seleccionados especialmente para usted
        </h2>
      </section>
      <div className="reservas-main-content">
        <section className="max-w-6xl mx-auto px-6 w-full mt-0">
          <h2 className="text-3xl font-bold mb-8 text-[var(--marron)] text-center">
            Cabañas disponibles
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {!cargando && !error &&
              [...cabanasDisponibles]
                .sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber)) // Ordena por número de cabaña
                .map((c) => (
                  <CardsCabanas
                    key={c._id}
                    cabana={c}
                    userId={auth.isAuthenticated ? auth.userId : null}
                    checkInDate={rangoFecha[0].startDate.toISOString()}
                    checkOutDate={rangoFecha[0].endDate.toISOString()}
                    passengersCount={adultos + ninos}
                    onBookingSuccess={(booking) => {
                      console.log('🔍 [Reservas] Reserva creada:', booking);
                      navigate('/my-bookings');
                    }}
                    onReservarClick={() => handleReservarClick(c)}
                  />
                ))}
          </div>
        </section>
      </div>
      {mostrarResumen && selectedCabana && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ResumenReserva
            cabana={selectedCabana}
            checkIn={format(rangoFecha[0].startDate, 'dd/MM/yyyy')}
            checkOut={format(rangoFecha[0].endDate, 'dd/MM/yyyy')}
            guests={`${adultos} adultos, ${ninos} niños`}
            firstName={auth?.user?.name || 'Usuario'}
            lastName={auth?.user?.apellido || ''}
            onClose={handleCerrarResumen}
            onConfirm={handleConfirmarReserva}
          />
        </div>
      )}
    </>
  );
}

export default Reservas;