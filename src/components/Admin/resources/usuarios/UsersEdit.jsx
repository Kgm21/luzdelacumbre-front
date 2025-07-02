// src/pages/admin/UsersEdit.jsx
import { Edit, SimpleForm, TextInput, SelectInput, BooleanInput } from 'react-admin';

const UsersEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nombre" />
      <TextInput source="apellido" label="Apellido" />
      <TextInput source="email" label="Correo" />
      <SelectInput source="role" label="Rol" choices={[
        { id: 'admin', name: 'Admin' },
        { id: 'client', name: 'Cliente' }
      ]} />
      <BooleanInput source="isActive" label="Activo" />
    </SimpleForm>
  </Edit>
);

export default UsersEdit;
