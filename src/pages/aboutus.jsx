import React from "react";
import { Container, Row } from "react-bootstrap";
import "./styles/aboutUs.css";

const equipo = [
  {
    name: "Karen",
    role: "Scrun Master",
    description:
      "Con un talento especial para la programación y la resolución de problemas, ella es la mente técnica detrás de Dale Play. Su capacidad para convertir líneas de código en funcionalidades que mejoran la experiencia del usuario es lo que hace posible este proyecto. Amante del cine y siempre buscando nuevas formas de innovar.",
    image: "public/av-img/imgKaren.jpg",
    bgColor: "bg-body-secondary",
  },
  {
    name: "Jazmin",
    role: "developer",
    description:
      "Con un talento especial para la programación y la resolución de problemas, ella es la mente técnica detrás de RollingMovies. Su capacidad para convertir líneas de código en funcionalidades que mejoran la experiencia del usuario es lo que hace posible este proyecto. Amante del cine y siempre buscando nuevas formas de innovar.",
    image: "public/av-img/imgJazmin.jpg",
    bgColor: "bg-body-secondary",
  },
  {
    name: "Enzo",
    role: "developer",
    description:
      "Con un enfoque estratégico y una visión clara, Enzo es el motor que impulsa a RollingMovies hacia adelante. Su pasión por el entretenimiento y la tecnología se traduce en cada detalle del proyecto. Enzo lidera con creatividad y entusiasmo, asegurándose de que el sitio refleje su misión de conectar a los usuarios con las mejores historias.",
    image: "public/av-img/imgEnzo.jpg",
    bgColor: "bg-body-secondary",
  },

  {
    name: "Nanci",
    role: "developer",
    description:
      "Con un talento especial para la programación y la resolución de problemas, ella es la mente técnica detrás de RollingMovies. Su capacidad para convertir líneas de código en funcionalidades que mejoran la experiencia del usuario es lo que hace posible este proyecto. Amante del cine y siempre buscando nuevas formas de innovar.",
    image: "public/av-img/imageNanci.jpg",
    bgColor: "bg-body-secondary",
  },
];

const aboutUs = () => {
  return (
    <Container className="py-5 content">
      <header className="text-center mb-5">
        <h2 className="pb-3 fw-bold text-center titulo">
          Explora y Descubre el Placer del Descanso en Cabañas 'LUZ DE LA
          CUMBRE'
        </h2>
        <p className="fs-5 text-center">
          Nuestras exclusivas cabañas están diseñadas para quienes buscan
          desconectarse del mundo sin renunciar al confort. Éstas son ideales
          para los amantes de la naturaleza , perfectas para escapadas
          románticas o simplemente para disfrutar en familia. Viví una
          experiencia única e inolvidable en un lugar que no vas a querer dejar!
          Tu próxima historia comienza en 'LUZ DE LA CUMBRE'
        </p>
      </header>
      <section className="text-left">
        <h3 className="fw-bold mb-3 text-center">
          Conoce a los creadores de 'LUZ DE LA CUMBRE'
        </h3>
        <p className="fs-5 text-center">
          Cada gran historia necesita un equipo excepcional, y 'Luz de la
          Cumbre' no es la excepción. Detrás de este apasionante proyecto hay un
          grupo de visionarios que combinaron talento, creatividad y dedicación
          para dar vida a una experiencia única. Ellos no solo comparten una
          pasión por el cine, sino también un compromiso por conectar contigo a
          través de cada detalle. Te invitamos a descubrir quiénes son los
          arquitectos de esta maravillosa aventura cinematográfica.
        </p>
      </section>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-lg-4 justify-content-center align-items-center">
        {equipo.map((member, index) => (
          <div
            key={index}
            className={`col my-4 ${member.bgColor} border border-primary rounded`}
          >
            <figure className="d-flex justify-content-center align-items-center text-center flex-column">
              <div className="bs_miembro_img py-2">
                <img
                  src={member.image}
                  alt={`miembro-${member.name.toLowerCase()}`}
                  className="img-fluid rounded-circle"
                />
              </div>
              <figcaption>
                <h4 style={{ color: "black", fontWeight: "bold" }}>
                  {member.name}
                </h4>
                <h5 style={{ color: "black", fontSize: "14px" }}>
                  {member.role}
                </h5>
                <p style={{ color: "black" }}>{member.description}</p>
              </figcaption>
            </figure>
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default aboutUs;
