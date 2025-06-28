import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./styles/reservas.css"; // Reusamos estilos de reservas
import CardsCabanas from '../components/cabanias/listadeCabanias';
import { API_URL } from "../CONFIG/api";
import Gallery from './galery';
import "./styles/homepage.css"; // Make sure this import is present for your custom styles

const HomePage = () => {
  const navigate = useNavigate();
  const [cabanas, setCabanas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchCabanas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error("Error al obtener las cabañas");
      }
      const data = await response.json();

      // ✅ Filtrar solo las disponibles
      const disponibles = data.filter(cabana => cabana.isAvailable !== false);

      const cabanasConURLs = disponibles.map(cabana => ({
        ...cabana,
        imageUrls: cabana.imageUrls.map(url =>
          url.startsWith("http") ? url : `${API_URL}${url}`
        ),
      }));

      setCabanas(cabanasConURLs);
    } catch (err) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchCabanas();
  }, []);

  return (
    <>
      {/* Header with background image (Hero Section) */}
      <header
        className="relative h-[36rem] bg-cover bg-center text-white shadow-lg flex flex-col items-center justify-center p-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')`,
        }}
      >
        {/* Overlay to darken the background image for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content of the header (Title and Subtitle) */}
        <div className="relative z-10 text-center mb-8">
          {/* Main Title with text shadow */}
          <h1 className="text-9xl font-bold mb-2 text-with-shadow">Cabañas Luz de la Cumbre</h1>
          {/* Subtitle with a slightly lighter text shadow */}
          <p className="text-4xl subtitle-with-shadow">Descubre el descanso perfecto en la naturaleza</p>
        </div>

        
      </header>

      {/* Cabins Section */}
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
                    <CardsCabanas cabana={cabana} modoSimple={true} />
                  </Col>
              ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;