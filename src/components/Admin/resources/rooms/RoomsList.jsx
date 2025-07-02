import * as React from 'react';
import { List, Datagrid, TextField, NumberField, BooleanField, EditButton } from 'react-admin';

const RoomsList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="roomNumber" label="Número de Habitación" />
      <TextField source="type" label="Tipo" />
      <NumberField source="price" label="Precio" />
      <TextField source="description" label="Descripción" />
      <NumberField source="capacity" label="Capacidad" />
      <BooleanField source="isAvailable" label="Disponible" />
      <EditButton />
    </Datagrid>
  </List>
);

export default RoomsList;
