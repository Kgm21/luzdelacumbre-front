// src/components/Admin/resources/contacts/ContactsEdit.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { API_URL } from '../../../../CONFIG/api';

const ContactsEdit = ({ auth, contactData, onContactResponded, onCancel }) => {
  const [response, setResponse] = useState(contactData.response || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!response.trim()) {
      setError('La respuesta es obligatoria');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/contact/${contactData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ response }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar la respuesta');
      }

      setSuccess('Respuesta enviada correctamente');
      setTimeout(() => {
        onContactResponded();
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error al responder:', err);
    }
  };

  return (
    <div>
      <h4>Responder Mensaje de Contacto</h4>
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
        <Button variant="primary" type="submit" className="me-2">
          Enviar Respuesta
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default ContactsEdit;