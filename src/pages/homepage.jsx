// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardsCabanas from "../components/cabanias/listadeCabanias";
import { API_URL } from "../CONFIG/api";
import "./styles/homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cabanas, setCabanas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const fetchCabanas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error("Error al obtener las cabañas");
      }
      const data = await response.json();

      // 1) Tomamos data.rooms en lugar de data.data
      const listado = Array.isArray(data.rooms) ? data.rooms : [];

      // 2) Filtramos solo las disponibles
      const disponibles = listado.filter(cabana => cabana.isAvailable !== false);

      // 3) Normalizamos URLs y ordenamos
      const cabanasConURLs = disponibles.map(cabana => ({
        ...cabana,
        imageUrls: (cabana.imageUrls || []).map(url =>
          url.startsWith("http") ? url : `${API_URL}${url}`
        ),
      }));

      cabanasConURLs.sort((a, b) => {
        const numA = parseInt(a.roomNumber, 10);
        const numB = parseInt(b.roomNumber, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.roomNumber.localeCompare(b.roomNumber);
      });

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
      {/* Hero */}
      <header
        className="relative h-[36rem] bg-cover bg-center text-white shadow-lg flex flex-col items-center justify-center p-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-9xl text-with-shadow mb-2 text-white">
            Cabañas Luz de la Cumbre
          </h1>
          <p className="text-4xl text-white subtitle-with-shadow">
            Descubre el descanso perfecto en la naturaleza
          </p>
        </div>
      </header>

      {/* Sección de cabañas */}
      <section className="reservas-main-content py-8">
        <Container>
          <h2 className="text-3xl font-bold mb-8 text-[var(--marron)] text-center">
            Nuestras Cabañas
          </h2>

          {cargando && (
            <p className="text-center text-xl text-gray-700">
              Cargando cabañas...
            </p>
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
              cabanas.map(cabana => (
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
