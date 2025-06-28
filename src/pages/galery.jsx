import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import GLightbox from 'glightbox';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'glightbox/dist/css/glightbox.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../CONFIG/api'; // Importar la URL de la API

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: '.glightbox',
    });

    return () => {
      lightbox.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/images`); // Usar /api/images
        if (!response.ok) throw new Error('Error al obtener las imágenes');
        const data = await response.json();

        // Ajustar las rutas a URLs completas usando API_URL
        const formattedImages = data.map((img) => ({
          id: img.id,
          src: `${API_URL}${img.src}`, // Ejemplo: https://luzdelacumbre-back.onrender.com/images/cabana1/1.jpg
          alt: img.alt,
        }));

        setImages(formattedImages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container className="py-5 gallery-section">
      <h2 className="text-center mb-4">Galería</h2>
      <Row>
        {images.map(({ id, src, alt }) => (
          <Col key={id} sm={6} md={4} lg={3} className="mb-4">
            <a href={src} className="glightbox d-block position-relative">
              <Image src={src} alt={alt} fluid rounded />
              <div
                className="overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  color: 'white',
                  fontSize: '2rem',
                  borderRadius: '0.25rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <FontAwesomeIcon icon={faSearchPlus} />
              </div>
            </a>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Gallery;