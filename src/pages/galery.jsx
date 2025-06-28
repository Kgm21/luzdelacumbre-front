import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../CONFIG/api';
import './styles/galery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/images`);
        if (!response.ok) throw new Error('Error al obtener las imágenes');
        const data = await response.json();

        const formattedImages = data.map((img) => ({
          id: img._id || img.id || `${img.src}-${img.filename}`,
          src: `${API_URL}${img.src}`,
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
            <div className="gallery-card" onClick={() => setSelectedImage({ src, alt })}>
              <Image src={src} alt={alt} className="img-fluid" />
              <div className="overlay">
                <FontAwesomeIcon icon={faSearchPlus} />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Modal de imagen ampliada */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="lg">
        <Modal.Body className="p-0 position-relative">
          <button
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={() => setSelectedImage(null)}
            aria-label="Cerrar"
            style={{ zIndex: 1000 }}
          ></button>
          {selectedImage && (
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-100"
              style={{ maxHeight: '90vh', objectFit: 'contain' }}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Gallery;
