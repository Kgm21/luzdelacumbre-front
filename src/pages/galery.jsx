import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../CONFIG/api";
import "./styles/galery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/images`);
        if (!res.ok) throw new Error("Error al obtener las imágenes");
        const payload = await res.json();

        const raw =
          Array.isArray(payload.images)
            ? payload.images
            : Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];

        const formatted = raw.map((img) => {
          let src = img.src;

          // Si src NO es URL absoluta, antepone API_URL
          if (src && !/^https?:\/\//.test(src)) {
            if (!src.startsWith("/")) src = "/" + src;
            src = `${API_URL}${src}`;
          }

          return {
            id: img._id || img.id || img.filename || src,
            src,
            alt: img.alt || img.filename || "Imagen de galería",
          };
        });

        setImages(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <div className="text-center my-5">Cargando galería…</div>;
  if (error) return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <Container className="py-5 gallery-section">
      <h2 className="text-center mb-4">Galería</h2>
      <Row>
        {images.map(({ id, src, alt }) => (
          <Col key={id} sm={6} md={4} lg={3} className="mb-4">
            <div
              className="gallery-card position-relative"
              onClick={() => setSelectedImage({ src, alt })}
              style={{
                cursor: "pointer",
                minHeight: "200px",
                position: "relative",
              }}
            >
              <Image
                src={src}
                alt={alt}
                className="img-fluid"
                loading="lazy"
                onError={(e) => {
                  console.log("Image load failed for:", src);
                  e.target.style.display = "none";
                }}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              <div className="overlay d-flex justify-content-center align-items-center">
                <FontAwesomeIcon icon={faSearchPlus} size="2x" />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        show={!!selectedImage}
        onHide={() => setSelectedImage(null)}
        centered
        size="lg"
      >
        <Modal.Body className="p-0 position-relative">
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={() => setSelectedImage(null)}
            aria-label="Cerrar"
            style={{ zIndex: 1000 }}
          />
          {selectedImage && (
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-100"
              style={{ maxHeight: "90vh", objectFit: "contain" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Gallery;
