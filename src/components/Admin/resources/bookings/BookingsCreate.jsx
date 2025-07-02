// src/pages/admin/BookingsCreate.jsx
import { Create, SimpleForm, DateInput, TextInput, SelectInput, NumberInput } from 'react-admin';

const BookingsCreate = () => (
  <Create>
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
  </Create>
);

export default BookingsCreate;
