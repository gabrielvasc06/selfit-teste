import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Equipamentos from './pages/Equipamentos.jsx';
import Login from './pages/Login.jsx';
import Manutencoes from './pages/Manutencoes.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/equipamentos" element={<Equipamentos />} />
          <Route path="/manutencoes" element={<Manutencoes />} />
          <Route path="/garantias" element={<Equipamentos initialFilter="GARANTIA" />} />
          <Route path="/unidades" element={<Dashboard />} />
          <Route path="/regioes" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
