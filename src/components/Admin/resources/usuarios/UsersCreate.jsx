// src/pages/admin/UsersCreate.jsx
import { Create, SimpleForm, TextInput, SelectInput, BooleanInput } from 'react-admin';

const UsersCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nombre" />
      <TextInput source="apellido" label="Apellido" />
      <TextInput source="email" label="Correo" />
      <TextInput source="password" label="Contraseña" type="password" />
      <SelectInput source="role" label="Rol" choices={[
        { id: 'admin', name: 'Admin' },
        { id: 'client', name: 'Cliente' }
      ]} />
      <BooleanInput source="isActive" label="Activo" />
    </SimpleForm>
  </Create>
);

export default UsersCreate;
