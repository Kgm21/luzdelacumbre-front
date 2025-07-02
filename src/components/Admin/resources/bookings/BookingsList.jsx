import { useState } from 'react';
import { List, Datagrid, TextField, DateField, NumberField, EditButton, DeleteButton, Filter, SelectInput } from 'react-admin';

const BookingsFilter = (props) => (
  <Filter {...props}>
    <SelectInput
      source="past"
      label="Mostrar"
      choices={[
        { id: 'false', name: 'Reservas Activas' },
        { id: 'true', name: 'Reservas Pasadas' },
      ]}
      alwaysOn
    />
  </Filter>
);

const BookingsList = (props) => (
  <List {...props} filters={<BookingsFilter />} filterDefaultValues={{ past: 'false' }} perPage={100}>
    <Datagrid rowClick="edit">
      <TextField source="userId.name" label="Nombre" />
      <TextField source="userId.apellido" label="Apellido" />
      <TextField source="roomId.roomNumber" label="Cabaña" />
      <TextField source="roomId.type" label="Tipo" />
      <DateField source="checkInDate" label="Entrada" />
      <DateField source="checkOutDate" label="Salida" />
      <NumberField source="totalPrice" label="Precio total" />
      <TextField source="status" label="Estado" />
      <NumberField source="passengersCount" label="Pasajeros" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default BookingsList;
