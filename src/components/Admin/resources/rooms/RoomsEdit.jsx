import { Edit, SimpleForm, TextInput, NumberInput, BooleanInput, ArrayInput, SimpleFormIterator } from 'react-admin';

const RoomsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="roomNumber" label="Número de Habitación" />
      <TextInput source="type" label="Tipo" disabled />
      <NumberInput source="price" label="Precio" />
      <TextInput source="description" label="Descripción" multiline />
      <NumberInput source="capacity" label="Capacidad" />
      <BooleanInput source="isAvailable" label="Disponible" />
      
      <ArrayInput source="imageUrls" label="URLs de Imágenes">
        <SimpleFormIterator>
          <TextInput label="URL de Imagen" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export default RoomsEdit;
