import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { Plots } from './pages/Plots';
import { SiteVisit } from './pages/SiteVisit';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { PropertiesManagement } from './pages/admin/PropertiesManagement';
import { ClientsManagement } from './pages/admin/ClientsManagement';
import { PlotsManagement } from './pages/admin/PlotsManagement';
import { SiteVisitsManagement } from './pages/admin/SiteVisitsManagement';
import { ReceiptsManagement } from './pages/admin/ReceiptsManagement';
import { Reports } from './pages/admin/Reports';
import { WebsiteContent } from './pages/admin/WebsiteContent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<Login />} />

            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/plots" element={<Plots />} />
                    <Route path="/site-visit" element={<SiteVisit />} />
                  </Routes>
                  <Footer />
                </>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/properties" element={<PropertiesManagement />} />
                    <Route path="/clients" element={<ClientsManagement />} />
                    <Route path="/plots" element={<PlotsManagement />} />
                    <Route path="/site-visits" element={<SiteVisitsManagement />} />
                    <Route path="/receipts" element={<ReceiptsManagement />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/content" element={<WebsiteContent />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
