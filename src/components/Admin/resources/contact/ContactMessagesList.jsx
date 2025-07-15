// src/components/Admin/resources/contacts/ContactsList.jsx
import React from 'react';
import { Table, Button, Alert } from 'react-bootstrap';

const ContactsList = ({ contacts, onEditContact, auth, refreshContacts }) => {
  return (
    <div>
      <h3>Lista de Mensajes de Contacto</h3>
      <p><strong>Total:</strong> {contacts.length} mensajes</p>

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
                      onClick={() =>
                        onEditContact({ ...contact, id: contact._id })
                      }
                      disabled={contact.status === 'responded'}
                    >
                      Responder
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
