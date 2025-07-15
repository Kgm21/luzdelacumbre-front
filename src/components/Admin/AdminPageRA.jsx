// src/admin/AdminPageRA.jsx
import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { API_URL } from '../../CONFIG/api';
import RoomsList from './resources/rooms/RoomsList';
import RoomsEdit from './resources/rooms/RoomsEdit';
import RoomsCreate from './resources/rooms/RoomsCreate';
import UsersList from './resources/users/UsersList';
import UsersEdit from './resources/users/UsersEdit';
import UsersCreate from './resources/users/UsersCreate';
import BookingsList from './resources/reservas/BookingsList';
import BookingsEdit from './resources/reservas/BookingsEdit';
import BookingsCreate from './resources/reservas/BookingsCreate';
import ContactsList from './resources/contact/ContactMessagesList';
import ContactsEdit from './resources/contact/ContactMessagesEdit';

const dataProvider = simpleRestProvider(`${API_URL}`);

const AdminPageRA = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="rooms" list={RoomsList} edit={RoomsEdit} create={RoomsCreate} />
    <Resource name="users" list={UsersList} edit={UsersEdit} create={UsersCreate} />
    <Resource name="reservas" list={BookingsList} edit={BookingsEdit} create={BookingsCreate} />
    <Resource name="contact" list={ContactsList} edit={ContactsEdit} />
  </Admin>
);

export default AdminPageRA;