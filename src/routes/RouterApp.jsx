import React from 'react';
import { NavigateApp } from '../components/NavigateApp';
import { FooterComponent } from '../components/footerComponent';
import { Route, Routes } from 'react-router-dom';
import { AboutUs, Error404, HomePage, LoginPage } from '../pages';
import { Contactos } from '../pages/contactos';
import {CardsCabañas} from '../pages/reservas';

export const RouterApp = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <NavigateApp />

      {/* Contenido principal */}
      <main className="flex-fill">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Error404 />} />
          <Route path='/contactos' element={<Contactos/>}></Route>
          <Route path='/reservas' element={<CardsCabañas/>}></Route>
        </Routes>
      </main>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
};
