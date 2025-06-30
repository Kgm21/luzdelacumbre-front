import React from "react";
import "./styles/Error404.css";

const Error404 = () => {
  return (
    <div className="error-container">
      <img
        src="/public/personajes/error.jpg"
        alt="imagen cabaña"
        className="error-img"
      />

      <p>La cabaña que estás buscando no existe.</p>
    </div>
  );
};

export default Error404;
