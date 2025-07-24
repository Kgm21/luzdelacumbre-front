// src/pages/CabanasPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { API_URL } from "../CONFIG/api";
import { Link } from "react-router-dom";
import "./styles/cabanas.css";

const CabanasPage = () => {
  const [cabanas, setCabanas] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/rooms`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener las cabañas");
        return response.json();
      })
      .then((data) => {
        // Tu API devuelve { rooms: [...], total }
        const listado = Array.isArray(data.rooms) ? data.rooms : [];

        // Filtrar solo las cabañas disponibles
        const disponibles = listado.filter((cabana) => cabana.isAvailable);

        // Escoger una imagen al azar de cada cabaña
        const conImagenRandom = disponibles.map((cabana) => {
          let imagenRandom = "/images/default-cabana.jpg"; // fallback

          if (Array.isArray(cabana.imageUrls) && cabana.imageUrls.length > 0) {
            const seleccionada =
              cabana.imageUrls[
                Math.floor(Math.random() * cabana.imageUrls.length)
              ];
            imagenRandom = seleccionada.startsWith("http")
              ? seleccionada
              : `${API_URL}${seleccionada}`;
          }

          return {
            ...cabana,
            imagenRandom,
          };
        });

        setCabanas(conImagenRandom);
      })
      .catch((err) => {
        console.error("Error fetching cabañas:", err);
        setCabanas([]);
      });
  }, []);

  return (
    <Container fluid className="p-4">
      <Row>
        {cabanas.length === 0 && (
          <p className="text-center w-100">No hay cabañas disponibles en este momento.</p>
        )}
        {cabanas.map((cabana) => (
          <Col md={6} lg={6} key={cabana._id || cabana.id} className="mb-4">
            <div className="cabana-card">
              <img
                src={cabana.imagenRandom}
                alt={`Cabaña ${cabana.roomNumber}`}
                className="cabana-img"
              />
              <div className="cabana-text">
                <h2>Cabaña {cabana.roomNumber}</h2>
                <p>Capacidad: {cabana.capacity} personas</p>
                <Link to={`/cabanas/${cabana._id}`} className="btn btn-info">
                  Más información
                </Link>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CabanasPage;
