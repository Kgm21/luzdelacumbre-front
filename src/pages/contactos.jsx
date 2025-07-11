import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import * as yup from "yup";
import "./styles/contacto.css";
import { API_URL } from "../CONFIG/api";

const schema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  phone: yup.string().required("El teléfono es obligatorio"),
  message: yup
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .required("El mensaje es obligatorio"),
});

const Contactos = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(schema) });
  const [formVisible, setFormVisible] = useState(true);


  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset({
  name: "",
  email: "",
  phone: "",
  message: "",
});
       
      } else {
        const errData = await response.json();
        
      }
    } catch (error) {
      console.error("Error:", error);
      
    }
  };

  return (
    <div className="contact-form-container">
      <div>
        <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Contacto</h2>

          <input
            type="text"
            placeholder="Nombre"
            {...register("name")}
          />
          <p className="error">{errors.name?.message}</p>

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          <p className="error">{errors.email?.message}</p>

          <input
            type="text"
            placeholder="Teléfono"
            {...register("phone")}
          />
          <p className="error">{errors.phone?.message}</p>

          <textarea
            placeholder="Mensaje"
            rows={5}
            {...register("message")}
          />
          <p className="error">{errors.message?.message}</p>

          <button type="submit">Enviar</button>

          {isSubmitSuccessful && (
            <p style={{ color: "green", marginTop: "1rem", textAlign: "center" }}>
              ¡Mensaje enviado con éxito!
            </p>
          )}
        </form>

        {/* Información adicional */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            marginTop: "2rem",
            borderRadius: "12px",
            padding: "1.5rem",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <p><strong>Teléfonos:</strong> +54 (294) 4441790 / 4441936</p>
          <p><strong>Dirección:</strong> Av. Bustillo Km 4.6 - S. C. de Bariloche, Patagonia Argentina</p>
          <p>Te invitamos a que nos contactes para realizar una reserva o por cualquier consulta.</p>
        </div>
      </div>
    </div>
  );
};

export default Contactos;
