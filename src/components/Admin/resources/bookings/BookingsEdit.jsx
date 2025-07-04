import { Edit, SimpleForm, DateInput, TextInput, SelectInput, NumberInput } from 'react-admin';

const BookingsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="userId" label="ID Usuario" />
      <TextInput source="roomId" label="ID Habitación" />
      <DateInput source="checkInDate" label="Fecha de entrada" />
      <DateInput source="checkOutDate" label="Fecha de salida" />
      <NumberInput source="totalPrice" label="Precio total" min={0} step={0.01} />
      <SelectInput
        source="status"
        label="Estado"
        choices={[
          { id: 'confirmed', name: 'Confirmada' },
          { id: 'cancelled', name: 'Cancelada' },
          { id: 'pending', name: 'Pendiente' },
        ]}
      />
      <NumberInput source="passengersCount" label="Pasajeros" min={1} />
    </SimpleForm>
  </Edit>
);

export default BookingsEdit;
