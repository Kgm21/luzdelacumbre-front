import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Error404.css";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <img
        src="/personajes/error.jpg"
        alt="Error 404 - Página no encontrada"
        className="error-img"
      />
      <h1>Error 404</h1>
      <p>La página que buscás no existe o fue movida.</p>
      <button className="error-btn" onClick={() => navigate("/")}>
        Volver al inicio
      </button>
    </div>
  );
};

export default Error404;
