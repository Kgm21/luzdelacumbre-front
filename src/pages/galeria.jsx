import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./galeria.css";

const images = [
  "src/pages/img/Backend-img/cabanas-en-villa-pehuenia-bahiamia-1.jpg",
  "src/pages/img/Backend-img/cabaña.jpg",
  "src/pages/img/Backend-img/exterior.jpg",
  "src/pages/img/Backend-img/piscina.avif",
  "src/pages/img/Backend-img/cabañaAtardecer.jpg",
  "src/pages/img/Backend-img/8a10personas-768x514.jpg",
];

const Galeria = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Cabañas de Lujo en la Patagonia</h2>
      <div className="row">
        {images.map((src, index) => (
          <div className="col-12 col-sm-6 col-md-4 mb-4" key={index}>
            <div className="image-container">
              <img
                src={src}
                alt={`Cabaña ${index + 1}`}
                className="img-fluid gallery-img"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Galeria;
