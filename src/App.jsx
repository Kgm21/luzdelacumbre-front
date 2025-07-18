import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import PrivateRoute from "./routes/PrivateRoute";
import Gallery from "./pages/galery";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import CabanasPage from "./pages/CabanasPage";
import Reservas from "./pages/reservas";
import ResumenReserva from "./components/ResumenReserva";
import MyBookings from "./pages/misReserva";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <NavigateApp />
          <main className="flex-fill">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/contactos" element={<Contactos />} />
              <Route path="/reservas" element={<Reservas />} /> 
              <Route path="/cabanias" element={<CabanasPage />} />
              <Route path="/galery" element={<Gallery />} />
              <Route path="/error404" element={<Error404 />} />
              <Route
                path="/resumen-reserva"
                element={
                  <PrivateRoute>
                    <ResumenReserva />
                  </PrivateRoute>
                }
              />
               <Route
    path="/administracion"
    element={
      <PrivateRoute allowedRoles={['admin']}>
        <AdminPage />
      </PrivateRoute>
    }
  />
              <Route
  path="/mis-reservas"
  element={
    <PrivateRoute allowedRoles={['client', 'admin']}>
      <MyBookings />
    </PrivateRoute>
  }
/>
              <Route path="*" element={<Navigate to="/error404" />} />
            </Routes>
          </main>
          <FooterComponent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;