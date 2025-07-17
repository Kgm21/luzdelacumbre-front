import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./styles/cabanas.css";
import { API_URL } from "../CONFIG/api";
import { Link } from "react-router-dom";


const CabanasPage = () => {
  const [cabanas, setCabanas] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/rooms`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener las cabañas");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.data)) {
          // Filtrar solo las cabañas disponibles
          const cabanasDisponibles = data.data.filter((cabana) => cabana.isAvailable);

          // Mapear y elegir imagen random para cada cabaña
          const cabanasConImagenRandom = cabanasDisponibles.map((cabana) => {
            let imagenRandom = "/images/default-cabana.jpg"; // imagen por defecto

            if (cabana.imageUrls && cabana.imageUrls.length > 0) {
              const imagenSeleccionada =
                cabana.imageUrls[
                  Math.floor(Math.random() * cabana.imageUrls.length)
                ];
              // Si es URL absoluta, usarla tal cual; si es relativa, añadir API_URL
              if (/^https?:\/\//.test(imagenSeleccionada)) {
                imagenRandom = imagenSeleccionada;
              } else {
                imagenRandom = `${API_URL}/${imagenSeleccionada}`;
              }
            }

            return {
              ...cabana,
              imagenRandom,
            };
          });

          setCabanas(cabanasConImagenRandom);
        } else {
          setCabanas([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching cabañas:", error);
        setCabanas([]);
      });
  }, []);

  return (
    <Container fluid className="p-4">
      <Row>
        {cabanas.length === 0 && (
          <p>No hay cabañas disponibles en este momento.</p>
        )}
        {cabanas.map((cabana) => (
          <Col md={6} key={cabana._id || cabana.id} className="mb-4">
            <div className="cabana-card">
              <img
                src={cabana.imagenRandom}
                alt={cabana.nombre || cabana.roomNumber}
                className="cabana-img"
              />
              <div className="cabana-text">
                <h2>Cabaña {cabana.nombre || cabana.roomNumber}</h2>
                <p>Capacidad {cabana.capacity || cabana.capacidad} personas</p>
                <Link to="/error404" className="btn-info btn">
  más información
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
