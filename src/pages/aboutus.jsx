import React from "react";
import { Container, Row } from "react-bootstrap";
import "./styles/aboutUs.css";

const equipo = [
  {
    name: "Karen",
    role: "Scrum Master",
    description:
      "Líder nata y organizadora incansable, Karen es el corazón estratégico de 'Luz de la Cumbre'. Con una visión clara y una gestión impecable del equipo, garantiza que cada tarea fluya con armonía y eficiencia. Su pasión por la tecnología se combina con una profunda empatía, lo que hace que cada integrante se sienta escuchado y motivado. Siempre lista para resolver conflictos y alentar nuevas ideas, Karen es quien marca el rumbo del proyecto.",
    image: "/personajes/imgKaren.jpg",
    bgColor: "bg-body-secondary",
  },
  {
    name: "Enzo",
    role: "Developer",
    description:
      "Visionario y apasionado por el desarrollo, Enzo es un motor constante de ideas y mejoras para el proyecto. Su capacidad para pensar a largo plazo lo convierte en una pieza clave para diseñar funciones que realmente marcan la diferencia. Además de programar, aporta una energía positiva que contagia al equipo y mantiene siempre encendida la llama del entusiasmo.",
    image: "/personajes/imgEnzo.jpg",
    bgColor: "bg-body-secondary",
  },
  {
    name: "Jazmin",
    role: "Developer",
    description:
      "Creativa, meticulosa y comprometida con la excelencia, Jazmin transforma ideas en soluciones funcionales. Con un ojo agudo para los detalles y una mente lógica, convierte el código en una experiencia fluida para los usuarios. Su entusiasmo por aprender y mejorar cada día se refleja en cada línea que programa. En 'Luz de la Cumbre', su trabajo es sinónimo de calidad e innovación.",
    image: "/personajes/imgJazmin.jpg",
    bgColor: "bg-body-secondary",
  },
  {
    name: "Nanci",
    role: "Developer",
    description:
      "Precisa, intuitiva y con una sensibilidad especial para la experiencia del usuario, Nanci se destaca por su enfoque en hacer que la tecnología se sienta humana. Su código no solo funciona: conecta. En 'Luz de la Cumbre', es quien vela porque cada clic sea sencillo y cada visita, memorable. Su pasión por el cine y la tecnología se reflejan en su manera de ver el mundo y de programarlo.",
    image: "/personajes/imageNanci.jpg",
    bgColor: "bg-body-secondary",
  },
];

const AboutUs = () => {
  return (
    <Container className="py-5 content">
      <header className="text-center mb-5">
        <h2 className="pb-3 fw-bold text-center titulo text-primary">
          Explora y Descubre el Placer del Descanso en Cabañas 'LUZ DE LA CUMBRE'
        </h2>
        <p className="fw-bold text-white fs-5 text-center bg-dark p-3 rounded">
          Nuestras exclusivas cabañas están diseñadas para quienes buscan
          desconectarse del mundo sin renunciar al confort. Éstas son ideales
          para los amantes de la naturaleza, perfectas para escapadas
          románticas o simplemente para disfrutar en familia. Viví una
          experiencia única e inolvidable en un lugar que no vas a querer
          dejar. Tu próxima historia comienza en 'LUZ DE LA CUMBRE'
        </p>
      </header>
      <section className="text-left mb-5">
        <h3 className="fw-bold mb-3 text-center text-success">
          Conocé a los creadores de 'LUZ DE LA CUMBRE'
        </h3>
        <p className="fs-5 text-center text-muted">
          Cada gran historia necesita un equipo extraordinario, y 'Luz de la
          Cumbre' no es la excepción. Detrás de este apasionante proyecto hay un
          grupo de visionarios que combinaron talento, creatividad y dedicación
          para dar vida a una experiencia única. Ellos no solo comparten una
          pasión por la programación, sino también un compromiso por conectar
          contigo a través de cada detalle. Te invitamos a descubrir quiénes son
          los arquitectos de esta maravillosa aventura.
        </p>
      </section>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {equipo.map((member, index) => (
          <div key={index} className="col d-flex">
            <div className={`card-miembro w-100 ${member.bgColor} p-3 rounded`}>
              <figure className="text-center">
                <div className="bs_miembro_img py-2">
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.role} of Luz de la Cumbre`}
                    className="img-fluid rounded-circle"
                    onError={(e) => {
                      e.target.src = "/path/to/default-image.jpg";
                    }}
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
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default AboutUs;