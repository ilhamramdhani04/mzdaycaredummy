import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

// Pages
import Login from './pages/Login'
import OwnerDashboard from './pages/dashboards/OwnerDashboard'
import SuperadminDashboard from './pages/dashboards/SuperadminDashboard'
import GuruDashboard from './pages/dashboards/GuruDashboard'
import OrangtuaDashboard from './pages/dashboards/OrangtuaDashboard'
import OrangtuaAttendance from './pages/dashboards/OrangtuaAttendance'
import OrangtuaReports from './pages/dashboards/OrangtuaReports'
import OrangtuaInvoices from './pages/dashboards/OrangtuaInvoices'
import OwnerBranches from './pages/dashboards/OwnerBranches'
import OwnerInvoices from './pages/dashboards/OwnerInvoices'
import OwnerFinance from './pages/dashboards/OwnerFinance'
import SuperadminAttendance from './pages/dashboards/SuperadminAttendance'
import SuperadminReports from './pages/dashboards/SuperadminReports'
import SuperadminUsers from './pages/dashboards/SuperadminUsers'
import GuruMenus from './pages/dashboards/GuruMenus'
import GuruBathing from './pages/dashboards/GuruBathing'
import GuruStimulasi from './pages/dashboards/GuruStimulasi'
import GuruMedication from './pages/dashboards/GuruMedication'
import GuruInventory from './pages/dashboards/GuruInventory'
import GuruMedia from './pages/dashboards/GuruMedia'
import GuruOvertime from './pages/dashboards/GuruOvertime'
import GuruReports from './pages/dashboards/GuruReports'
import GuruTeacherConfig from './pages/dashboards/GuruTeacherConfig'

// Layout Components
import Sidebar from './components/layout/Sidebar'
import BottomNavigation from './components/layout/BottomNavigation'
import ProtectedRoute from './components/ProtectedRoute'

// Styles
import './styles/theme.css'
import './styles/animations.css'
import './styles/orangtua.css'
import './styles/orangtua-pages.css'
import './styles/admin-pages.css'
import './styles/guru.css'

// Layout wrapper with sidebar and mobile navigation
function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <div className="app-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(true)}
      >
        ☰
      </button>
      
      {/* Sidebar - Desktop + Mobile Drawer */}
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
      
      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation />
    </div>
  )
}

function App() {
  const { user, isAuthenticated, isOwner, isSuperadmin, isGuru, isOrangtua } = useAuth()
  const navigate = useNavigate()

  // Get default dashboard route based on role
  const getDefaultRoute = () => {
    if (isOwner) return '/dashboard/owner'
    if (isSuperadmin) return '/dashboard/superadmin'
    if (isGuru) return '/dashboard/guru'
    if (isOrangtua) return '/dashboard/orangtua'
    return '/login'
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Dashboard Routes - Owner */}
      <Route
        path="/dashboard/owner"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/owner/branches"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerBranches />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/owner/invoices"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerInvoices />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/owner/finance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerFinance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/owner/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OwnerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Protected Dashboard Routes - Superadmin */}
      <Route
        path="/dashboard/superadmin"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SuperadminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/attendance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SuperadminAttendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SuperadminReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SuperadminUsers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/menus"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruMenus />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/bathing"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruBathing />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/stimulasi"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruStimulasi />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/medication"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruMedication />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/inventory"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruInventory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/media"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruMedia />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/overtime"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruOvertime />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/teacher-config"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruTeacherConfig />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/superadmin/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SuperadminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Protected Dashboard Routes - Guru */}
      <Route
        path="/dashboard/guru"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/menus"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruMenus />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/bathing"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruBathing />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/stimulasi"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruStimulasi />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/medication"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruMedication />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/inventory"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruInventory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/media"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruMedia />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/overtime"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruOvertime />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/guru/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GuruDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Protected Dashboard Routes - Orangtua */}
      <Route
        path="/dashboard/orangtua"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrangtuaDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orangtua/attendance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrangtuaAttendance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orangtua/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrangtuaReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orangtua/invoices"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrangtuaInvoices />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orangtua/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OrangtuaDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Redirect root to appropriate dashboard */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Legacy dashboard redirect */}
      <Route 
        path="/dashboard" 
        element={<Navigate to={getDefaultRoute()} replace />} 
      />
      
      {/* 404 - Redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function AppWithProviders() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  )
}

export default AppWithProviders
