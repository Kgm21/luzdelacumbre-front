import { Create, SimpleForm, TextInput, NumberInput, BooleanInput, ArrayInput, SimpleFormIterator } from 'react-admin';

const RoomsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="roomNumber" label="Número de Habitación" />
      <NumberInput source="price" label="Precio" />
      <TextInput source="description" label="Descripción" multiline />
      <NumberInput source="capacity" label="Capacidad" />
      <BooleanInput source="isAvailable" label="Disponible" defaultValue={true} />
      
      <ArrayInput source="imageUrls" label="URLs de Imágenes">
        <SimpleFormIterator>
          <TextInput label="URL de Imagen" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);

export default RoomsCreate;

