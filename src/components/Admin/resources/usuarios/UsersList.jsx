// src/pages/admin/UsersList.jsx
import { List, Datagrid, TextField, EmailField, BooleanField } from 'react-admin';

const UsersList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Nombre" />
      <TextField source="apellido" label="Apellido" />
      <EmailField source="email" label="Correo" />
      <TextField source="role" label="Rol" />
      <BooleanField source="isActive" label="Activo" />
    </Datagrid>
  </List>
);

export default UsersList;
