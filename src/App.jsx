import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages'
import { RouterApp } from './routes/RouterApp'
import { ProtectedRoute } from './routes/protectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <RouterApp />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
