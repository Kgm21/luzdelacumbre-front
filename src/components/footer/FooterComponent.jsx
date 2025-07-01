import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { BsFacebook, BsTwitter, BsInstagram } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./footer.css";

export const FooterComponent = () => {
  return (
    <footer className="footer py-8 mt-16 text-center text-sm">
      <div className="max-w-6xl mx-auto px-6 mt-3">
        <p className="text-white">&copy; 2025 Cabañas Luz de la Cumbre. Todos los derechos reservados.</p>
        
        <div className="mt-4 space-x-4">
          <a href="/error404" className="hover:underline">Política de Privacidad</a>
          <a href="/error404" className="hover:underline">Términos de Servicio</a>
          
        </div>
        
        <div className="mt-4 text-lg space-x-4">
          <a href="/error404" className="hover:text-gray-300"><i className="fab fa-facebook"></i></a>
          <a href="/error404" className="hover:text-gray-300"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
