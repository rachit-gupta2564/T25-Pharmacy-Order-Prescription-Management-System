import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/routing/ProtectedRoute'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DeliveryDashboardPage } from '../pages/delivery/DeliveryDashboardPage'
import { PatientDashboardPage } from '../pages/patient/PatientDashboardPage'
import { CartCheckoutPage } from '../pages/patient/CartCheckoutPage'
import { MedicineCatalogPage } from '../pages/patient/MedicineCatalogPage'
import { OrderTrackingPage } from '../pages/patient/OrderTrackingPage'
import { PrescriptionUploadPage } from '../pages/patient/PrescriptionUploadPage'
import { InventoryPage } from '../pages/pharmacist/InventoryPage'
import { PharmacistDashboardPage } from '../pages/pharmacist/PharmacistDashboardPage'
import { VerificationPage } from '../pages/pharmacist/VerificationPage'
import { AuthPage } from '../pages/shared/AuthPage'
import { LandingPage } from '../pages/shared/LandingPage'
import { PUBLIC_ROUTES, ROUTES } from './routeConfig'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<LandingPage />} path={PUBLIC_ROUTES.landing} />
      <Route element={<AuthPage />} path={PUBLIC_ROUTES.auth} />

      <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
        <Route element={<DashboardLayout />} path="/">
          <Route element={<PatientDashboardPage />} path={ROUTES.patientDashboard.slice(1)} />
          <Route element={<MedicineCatalogPage />} path={ROUTES.medicineCatalog.slice(1)} />
          <Route
            element={<PrescriptionUploadPage />}
            path={ROUTES.prescriptionUpload.slice(1)}
          />
          <Route element={<CartCheckoutPage />} path={ROUTES.cartCheckout.slice(1)} />
          <Route element={<OrderTrackingPage />} path={ROUTES.orderTracking.slice(1)} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['PHARMACIST']} />}>
        <Route element={<DashboardLayout />} path="/">
          <Route
            element={<PharmacistDashboardPage />}
            path={ROUTES.pharmacistDashboard.slice(1)}
          />
          <Route element={<VerificationPage />} path={ROUTES.verification.slice(1)} />
          <Route element={<InventoryPage />} path={ROUTES.inventory.slice(1)} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['DELIVERY']} />}>
        <Route element={<DashboardLayout />} path="/">
          <Route
            element={<DeliveryDashboardPage />}
            path={ROUTES.deliveryDashboard.slice(1)}
          />
        </Route>
      </Route>

      <Route element={<Navigate replace to={PUBLIC_ROUTES.landing} />} path="*" />
    </Routes>
  )
}
