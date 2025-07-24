// src/components/Admin/resources/contacts/ContactsEdit.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const ContactsEdit = ({ auth, contactData, onContactResponded, onCancel }) => {
  const [response, setResponse] = useState(contactData.response || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!response.trim()) {
      setError('La respuesta es obligatoria');
      return;
    }

    // Simulación de envío de respuesta
    setSending(true);
    setTimeout(() => {
      setSuccess('Respuesta simulada enviada correctamente');
      setSending(false);
      onContactResponded({
        ...contactData,
        response,
        status: 'respondido', // 🔄 aseguramos coherencia con AdminPage
      });
    }, 1000);
  };

  return (
    <div>
      <h4 className="mb-4">Responder Mensaje de Contacto</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" value={contactData.name} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={contactData.email} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control type="text" value={contactData.phone || 'N/A'} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control as="textarea" rows={4} value={contactData.message} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Respuesta</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit" disabled={sending}>
            {sending ? 'Enviando...' : 'Enviar Respuesta'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={sending}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ContactsEdit;
