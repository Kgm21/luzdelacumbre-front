// src/pages/admin/BookingsEdit.jsx
import { Edit, SimpleForm, DateInput, TextInput, SelectInput, NumberInput } from 'react-admin';

const BookingsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="userId" label="ID Usuario" />
      <TextInput source="roomId" label="ID Habitación" />
      <DateInput source="checkInDate" label="Fecha de entrada" />
      <DateInput source="checkOutDate" label="Fecha de salida" />
      <NumberInput source="totalPrice" label="Precio total" />
      <SelectInput source="status" label="Estado" choices={[
        { id: 'confirmed', name: 'Confirmada' },
        { id: 'cancelled', name: 'Cancelada' },
        { id: 'pending', name: 'Pendiente' },
      ]} />
      <NumberInput source="passengersCount" label="Pasajeros" />
    </SimpleForm>
  </Edit>
);

export default BookingsEdit;
