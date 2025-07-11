import * as React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { API_URL } from "../../CONFIG/api"; // debe exportar un string con la URL base, ej: 'http://localhost:3000/api'
import RoomsList from './resources/rooms/RoomsList';
import RoomsEdit from './resources/rooms/RoomsEdit';
import RoomsCreate from './resources/rooms/RoomsCreate'

const dataProvider = simpleRestProvider(`${API_URL}`);


const AdminPageRA = () => (
  <Admin dataProvider={dataProvider}>
     <Resource name="rooms" list={RoomsList} edit={RoomsEdit} create={RoomsCreate} />
    <Resource name="users" list={UsersList} edit={UsersEdit} create={UsersCreate} />
    <Resource name="reservas" list={BookingsList} edit={BookingsEdit} create={BookingsCreate} />
  </Admin>
);

export default AdminPageRA;

