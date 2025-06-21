import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import NavigateApp from "./components/navbar/NavigateApp";
import FooterComponent from "./components/footer/FooterComponent";
import HomePage from "./pages/homepage";
import AboutUs from "./pages/aboutus";
import LoginPage from "./pages/login";
import Error404 from "./pages/error404";
import Contactos from "./pages/contactos";
import AdminPage from "./pages/adminPage";
import Registro from "./pages/registro";
import ProtectedRoute from "/src/routes/protectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Cabanias  from './pages/cabanias';
import Reservas from "./pages/reservas";


function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <NavigateApp usuarioAutenticado={usuarioAutenticado} setUsuarioAutenticado={setUsuarioAutenticado} />
          <main className="flex-fill">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<LoginPage setUsuarioAutenticado={setUsuarioAutenticado} />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/contactos" element={<Contactos />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path='/cabanias' element={<Cabanias/>}></Route>
            
            <Route
                path="/administracion"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </main>
          <FooterComponent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;