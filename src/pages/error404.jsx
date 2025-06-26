import React from "react";
import "./Error404.css";

const Error404 = () => {
  return (
    <div className="error-container">
      <img
        src="/imagenes/cabana-vieja.png" // poné una imagen relativa en public/
        alt="Cabaña antigua"
        className="error-img"
      />
      <h1>404 - Página no encontrada</h1>
      <p>La cabaña que estás buscando no existe.</p>
    </div>
  );
};

export default Error404;
