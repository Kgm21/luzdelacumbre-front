import React from "react";

export const CardsCabañas= () => {
  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="card shadow rounded-4 overflow-hidden mx-auto" style={{ maxWidth: '600px' }}>
          
          {/* Carrusel */}
          <div id="cabanaCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="https://www.barilochehoy.com/wp-content/uploads/2019/07/cabanas-e1563289993505.jpg"
                  className="d-block w-100"
                  alt="Cabaña 1"
                  style={{ height: '260px', objectFit: 'cover' }}
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://www.patagoniasinfronteras.com/fotos/accesibles_m.jpg?1537400227387"
                  className="d-block w-100"
                  alt="Cabaña 2"
                  style={{ height: '260px', objectFit: 'cover' }}
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://cabañasenbariloche.com/wp-content/uploads/mejores-cabanas-en-bariloche-las-marias-de-nahuel-3.jpg"
                  className="d-block w-100"
                  alt="Cabaña 3"
                  style={{ height: '260px', objectFit: 'cover' }}
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://cabañasbariloche.com.ar/images/cabanas/cabanas-villa-labrador/cabanas-villa-labrador-bariloche.jpg"
                  className="d-block w-100"
                  alt="Cabaña 4"
                  style={{ height: '260px', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Botones del carrusel */}
            <button className="carousel-control-prev" type="button" data-bs-target="#cabanaCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#cabanaCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>

            {/* Indicadores */}
            <div className="carousel-indicators">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#cabanaCarousel"
                  data-bs-slide-to={i}
                  className={i === 0 ? 'active' : ''}
                  aria-current={i === 0 ? 'true' : undefined}
                  aria-label={`Slide ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="card-body">
            <h5 className="card-title">Cabaña para 3 personas</h5>
            <p className="card-text text-muted">Cama matrimonial y de una plaza</p>
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-success me-2">9.3</span>
              <span className="text-muted">Excelente (950 opiniones)</span>
            </div>
            <div className="text-muted text-decoration-line-through">AR$ 350.000</div>
            <div className="fs-4 fw-bold text-dark">AR$ 280.000</div>
            <p className="text-muted small mb-0">por noche · AR$ 140.000</p>
            <p className="text-muted small">2-3 días (dos noches)</p>
          </div>
        </div>
      </div>
    </div>
  );
};


