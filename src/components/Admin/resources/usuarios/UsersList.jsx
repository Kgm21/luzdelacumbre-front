import React, { useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { API_URL } from "../../../../CONFIG/api";

const UsersList = ({ users, onEdit, auth, logout, fetchUsers }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleUserStatus = async (userId) => {
    setError("");
    setLoading(true);

    try {
      const authToken = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensaje || "Error al cambiar el estado del usuario");
      }

      fetchUsers(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" className="mb-2" />}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No hay usuarios registrados.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? "Activo" : "Suspendido"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => onEdit(user._id)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant={user.isActive ? "danger" : "success"}
                    size="sm"
                    onClick={() => toggleUserStatus(user._id)}
                  >
                    {user.isActive ? "Suspender" : "Activar"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default UsersList;
