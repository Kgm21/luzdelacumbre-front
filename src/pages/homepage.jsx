import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../pages/styles/reservas.css"; // Reusamos estilos de reservas
import CardsCabanas from "../components/cabanias/listadeCabanias";
import { API_URL } from "../CONFIG/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [cabanas, setCabanas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarHuespedes, setMostrarHuespedes] = useState(false);
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [habitaciones, setHabitaciones] = useState(1);
  const [rangoFecha, setRangoFecha] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 noches por defecto
      key: "selection",
    },
  ]);

  const calendarioRef = useRef(null);
  const huespedesRef = useRef(null);

  // Obtener cabañas disponibles
  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const response = await fetch(`${API_URL}/rooms`);
        if (!response.ok) {
          throw new Error("Error al cargar las cabañas");
        }
        const data = await response.json();
        // Filtrar solo cabañas disponibles y mapear imageUrls
        const availableCabanas = data
          .filter((cabana) => cabana.isAvailable)
          .map((cabana) => ({
            ...cabana,
            imageUrls:cabana.imageUrls.map((url) => `${API_URL.replace('/api', '')}${url}`)
            
          }));
          console.log("imageUrls por cabaña:", availableCabanas.map(c => ({ roomNumber: c.roomNumber, imageUrls: c.imageUrls })));
        setCabanas(availableCabanas);
        setCargando(false);
      } catch (err) {
        setError("No se pudieron cargar las cabañas. Inténtalo de nuevo.");
        setCargando(false);
      }
    };
    fetchCabanas();
  }, []);

  // Manejar clics fuera del calendario y huespedes
  useEffect(() => {
    const manejarClickAfuera = (e) => {
      if (
        calendarioRef.current &&
        !calendarioRef.current.contains(e.target) &&
        !e.target.closest('.search-bar-item div[onClick*="setMostrarCalendario"]') &&
        !e.target.closest(".rdrDateRangeWrapper")
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
    document.addEventListener("mousedown", manejarClickAfuera);
    return () => {
      document.removeEventListener("mousedown", manejarClickAfuera);
    };
  }, []);

  // Cambiar cantidad de adultos, niños, habitaciones
  const cambiarCantidad = (tipo, valor) => {
    if (tipo === "adultos") {
      setAdultos((prev) => Math.max(1, prev + valor));
    } else if (tipo === "ninos") {
      setNinos((prev) => Math.max(0, prev + valor));
    } else if (tipo === "habitaciones") {
      setHabitaciones((prev) => Math.max(1, prev + valor));
    }
  };

  // Buscar hospedaje (redirige a /reservas con parámetros)
  const buscarHospedaje = () => {
    const startDate = format(rangoFecha[0].startDate, "yyyy-MM-dd");
    const endDate = format(rangoFecha[0].endDate, "yyyy-MM-dd");
    const totalGuests = adultos + ninos;
    navigate(
      `/reservas?startDate=${startDate}&endDate=${endDate}&guests=${totalGuests}&rooms=${habitaciones}`
    );
  };

  return (
    <>
      {/* Header con imagen de fondo */}
      <header
        className="relative h-[36rem] bg-cover bg-center text-white shadow-lg flex flex-col items-center justify-center p-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">Cabañas Luz de la Cumbre</h1>
          <p className="text-xl">Descubre el descanso perfecto en la naturaleza</p>
        </div>

        {/* Buscador */}
        <div className="search-bar-container">
          <div className="search-bar-item">
            <label>Llegada</label>
            <div
              className="search-bar-input flex items-center justify-between"
              onClick={() => {
                setMostrarCalendario(!mostrarCalendario);
                setMostrarHuespedes(false);
              }}
            >
              <span>{format(rangoFecha[0].startDate, "dd/MM/yyyy")}</span>
              <FaCalendarAlt className="text-gray-400" />
            </div>
            {mostrarCalendario && (
              <div ref={calendarioRef}>
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
                setMostrarHuespedes(false);
              }}
            >
              <span>{format(rangoFecha[0].endDate, "dd/MM/yyyy")}</span>
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
                    <button
                      onClick={() => cambiarCantidad("adultos", -1)}
                      className="cantidad-btn"
                    >
                      –
                    </button>
                    <span>{adultos}</span>
                    <button
                      onClick={() => cambiarCantidad("adultos", 1)}
                      className="cantidad-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Niños</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cambiarCantidad("ninos", -1)}
                      className="cantidad-btn"
                    >
                      –
                    </button>
                    <span>{ninos}</span>
                    <button
                      onClick={() => cambiarCantidad("ninos", 1)}
                      className="cantidad-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Habitaciones</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cambiarCantidad("habitaciones", -1)}
                      className="cantidad-btn"
                    >
                      –
                    </button>
                    <span>{habitaciones}</span>
                    <button
                      onClick={() => cambiarCantidad("habitaciones", 1)}
                      className="cantidad-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={buscarHospedaje}
            className="boton-ver-tarifas flex items-center justify-center gap-2"
          >
            Buscar
          </Button>
        </div>
      </header>

      {/* Sección de cabañas */}
      <section className="reservas-main-content py-8">
        <Container>
          <h2 className="text-3xl font-bold mb-8 text-[var(--marron)] text-center">
            Nuestras Cabañas
          </h2>
          {cargando && (
            <p className="text-center text-xl text-gray-700">Cargando cabañas...</p>
          )}
          {error && (
            <div className="text-center">
              <p className="text-xl text-red-600">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Reintentar
              </Button>
            </div>
          )}
          {!cargando && !error && cabanas.length === 0 && (
            <p className="text-center text-xl text-gray-700">
              No hay cabañas disponibles en este momento. ¡Vuelve pronto!
            </p>
          )}
          <Row>
            {!cargando &&
              !error &&
              cabanas.map((cabana) => (
                <Col key={cabana._id} xs={12} sm={6} md={4} className="mb-4">
                  <CardsCabanas cabana={cabana} />
                </Col>
              ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;