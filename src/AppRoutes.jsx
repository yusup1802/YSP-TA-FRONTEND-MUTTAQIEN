import { Routes, Route } from 'react-router';
import Loginpage from './pages/Loginpage'
import ProtectedRoute from './middleware/ProtectedRoute';
import GuruProfilePage from './pages/guruPage/GuruProfilePage';
import AbsensiMuridPage from './pages/guruPage/AbsensiMuridPage';
import MuridPages from './pages/muridPage/MuridPages';
import AdminprofilePage from './pages/adminPage/AdminprofilePage'
import DashboardPage from './pages/DashboardPage';
import IsAuthenticated from './middleware/IsAuthenticated';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <IsAuthenticated>
          <DashboardPage />
        </IsAuthenticated>
      } />
      <Route path="/login" element={
        <IsAuthenticated>
          <Loginpage />
        </IsAuthenticated>
      }
      />
      <Route
        path="/murid"
        element={
          <ProtectedRoute allowedRoles={["MURID"]}>
            <MuridPages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guru"
        element={
          <ProtectedRoute allowedRoles={["GURU"]}>
            <GuruProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminprofilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/murid/:muridId/absensi"
        element={
          <ProtectedRoute allowedRoles={["GURU"]}>
            <AbsensiMuridPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
