// src/components/Admin/resources/contacts/ContactsList.jsx
import React, { useState } from 'react';
import { Table, Button, Alert, Form } from 'react-bootstrap';
import { API_URL } from "../../../../CONFIG/api";

const ContactsList = ({ contacts, onEditContact, auth, refreshContacts }) => {
  const [respuesta, setRespuesta] = useState('');
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResponder = async () => {
    setError('');
    setSuccess('');

    if (!respuesta.trim()) {
      setError('La respuesta no puede estar vacía.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/contacts/${contactoSeleccionado._id}/responder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ response: respuesta }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Error al responder mensaje");
      }

      setSuccess('Respuesta enviada correctamente.');
      setRespuesta('');
      setContactoSeleccionado(null);
      refreshContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>Lista de Mensajes de Contacto</h3>
      <p><strong>Total:</strong> {contacts.length} mensajes</p>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {contacts.length === 0 ? (
        <Alert variant="info">No hay mensajes de contacto.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th className="d-none d-md-table-cell">Teléfono</th>
                <th>Mensaje</th>
                <th className="d-none d-md-table-cell">Estado</th>
                <th className="d-none d-md-table-cell">Respuesta</th>
                <th className="d-none d-md-table-cell">Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className={contact.status === 'pending' ? 'table-warning' : ''}
                >
                  <td>{contact._id}</td>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td className="d-none d-md-table-cell">{contact.phone || 'N/A'}</td>
                  <td style={{ maxWidth: '200px' }} className="text-truncate">
                    {contact.message.length > 50
                      ? contact.message.slice(0, 50) + '...'
                      : contact.message}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {contact.status === 'pending' ? 'Pendiente' : 'Respondido'}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {contact.response || 'Sin respuesta'}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setContactoSeleccionado(contact);
                        setRespuesta(contact.response || '');
                        setSuccess('');
                        setError('');
                      }}
                      disabled={contact.status === 'responded' || contact.status === 'respondido'}
                    >
                      Contestar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {contactoSeleccionado && (
        <div className="mt-4">
          <h5>Responder a: {contactoSeleccionado.name}</h5>
          <Form.Group>
            <Form.Label>Mensaje de respuesta</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
          </Form.Group>
          <div className="mt-2">
            <Button onClick={handleResponder} variant="success" className="me-2">
              Enviar Respuesta
            </Button>
            <Button variant="secondary" onClick={() => setContactoSeleccionado(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsList;

