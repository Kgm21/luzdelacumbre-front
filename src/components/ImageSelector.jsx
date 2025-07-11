import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { API_URL } from "../CONFIG/api";

const ImageSelector = ({ selectedImage, onSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/images`);
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Error cargando imágenes:", err);
        setError("No se pudieron cargar las imágenes.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <>
          <Form.Select
            value={selectedImage}
            onChange={(e) => onSelect(e.target.value)}
          >
            <option value="">Selecciona una imagen</option>
            {images.map((img) => (
              <option key={img._id} value={img.src}>
                {img.alt || img.filename}
              </option>
            ))}
          </Form.Select>

          {selectedImage && (
            <div className="mt-2">
              <img
                src={`${API_URL}${selectedImage}`}
                alt="Vista previa"
                style={{ maxHeight: "200px", border: "1px solid #ddd", padding: "4px" }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ImageSelector;
