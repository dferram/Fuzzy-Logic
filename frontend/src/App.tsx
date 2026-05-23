import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import DiagnosticoGeneral from './pages/DiagnosticoGeneral'
import DiagnosticoEspecifico from './pages/DiagnosticoEspecifico'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/diagnostico-general" element={<DiagnosticoGeneral />} />
          <Route path="/diagnostico-especifico" element={<DiagnosticoEspecifico />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
