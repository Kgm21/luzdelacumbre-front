import React, { useState, useRef } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";
import ImageSelector from "../../../ImageSelector";

const RoomsCreate = ({ auth, onRoomCreated }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("cabana");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [photos, setPhotos] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (!roomNumber || price <= 0 || capacity <= 0) {
      setError("Por favor completa todos los campos obligatorios correctamente.");
      return;
    }

    const formData = new FormData();
    formData.append("roomNumber", roomNumber);
    formData.append("type", type);
    formData.append("price", Number(price));
    formData.append("description", description);
    formData.append("capacity", Number(capacity));
    formData.append("isAvailable", String(isAvailable));

    // Imágenes subidas manualmente
    if (photos) {
      Array.from(photos).forEach((photo) => {
        formData.append("photos", photo);
      });
    }

    // Imagen seleccionada desde galería
    if (selectedImage) {
      formData.append("selectedImage", selectedImage);
    }

    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear la habitación");

      setSuccess("Habitación creada correctamente");
      // Resetear formulario
      setRoomNumber("");
      setType("cabana");
      setPrice(0);
      setDescription("");
      setCapacity(1);
      setIsAvailable(true);
      setPhotos(null);
      setSelectedImage("");
      if (fileInputRef.current) fileInputRef.current.value = null;
      if (onRoomCreated) onRoomCreated();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h4>Crear Habitación</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group>
          <Form.Label>Número de Habitación</Form.Label>
          <Form.Control
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Imágenes (subir archivos)</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          {photos && (
            <div className="mt-2">
              {[...photos].map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  height="80"
                  className="me-2 mb-2 rounded border"
                />
              ))}
            </div>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Seleccionar imagen desde galería</Form.Label>
          <ImageSelector selectedImage={selectedImage} onSelect={setSelectedImage} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="number"
            inputMode="numeric"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Disponible</Form.Label>
          <Form.Check
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            label="¿Disponible?"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Crear
        </Button>
      </Form>
    </div>
  );
};

export default RoomsCreate;
