import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages'
import { RouterApp } from './routes/RouterApp'
import { ProtectedRoute } from './routes/protectedRoute'
import { AdminPage } from './pages/adminPage'
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/*" 
          element={<RouterApp />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
