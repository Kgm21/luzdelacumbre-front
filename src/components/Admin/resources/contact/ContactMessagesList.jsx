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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Respuesta</th>
              <th>Creado</th>
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
                <td>{contact.phone || 'N/A'}</td>
                <td>
                  {contact.message.length > 50
                    ? contact.message.slice(0, 50) + '...'
                    : contact.message}
                </td>
                <td>{contact.status === 'pending' ? 'Pendiente' : 'Respondido'}</td>
                <td>{contact.response || 'Sin respuesta'}</td>
                <td>{new Date(contact.createdAt).toLocaleString()}</td>
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
                  {/* Si querés agregar más acciones: */}
                  {/* <Button variant="secondary" size="sm" className="ms-2" onClick={() => onViewDetails(contact)}>Ver</Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ContactsList;
