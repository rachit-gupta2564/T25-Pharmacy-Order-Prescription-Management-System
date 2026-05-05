export const PUBLIC_ROUTES = {
  landing: '/',
  auth: '/auth',
}

export const ROUTES = {
  patientDashboard: '/patient/dashboard',
  medicineCatalog: '/patient/catalog',
  prescriptionUpload: '/patient/prescriptions/upload',
  cartCheckout: '/patient/cart',
  orderTracking: '/patient/orders',
  pharmacistDashboard: '/pharmacist/dashboard',
  verification: '/pharmacist/verification',
  inventory: '/pharmacist/inventory',
  deliveryDashboard: '/delivery/dashboard',
}

export const SIDEBAR_SECTIONS = [
  {
    roles: ['PATIENT'],
    title: 'Patient',
    links: [
      { label: 'Dashboard', short: 'PD', to: ROUTES.patientDashboard },
      { label: 'Medicine Catalog', short: 'MC', to: ROUTES.medicineCatalog },
      { label: 'Prescription Upload', short: 'PU', to: ROUTES.prescriptionUpload },
      { label: 'Cart & Checkout', short: 'CC', to: ROUTES.cartCheckout },
      { label: 'Order Tracking', short: 'OT', to: ROUTES.orderTracking },
    ],
  },
  {
    roles: ['PHARMACIST'],
    title: 'Pharmacist',
    links: [
      { label: 'Dashboard', short: 'PH', to: ROUTES.pharmacistDashboard },
      { label: 'Verification', short: 'VR', to: ROUTES.verification },
      { label: 'Inventory', short: 'IV', to: ROUTES.inventory },
    ],
  },
  {
    roles: ['DELIVERY'],
    title: 'Delivery',
    links: [{ label: 'Dashboard', short: 'DD', to: ROUTES.deliveryDashboard }],
  },
]

export const QUICK_LINKS = [
  { label: 'Patient Home', roles: ['PATIENT'], to: ROUTES.patientDashboard, scope: '/patient' },
  { label: 'Medicine Catalog', roles: ['PATIENT'], to: ROUTES.medicineCatalog, scope: '/patient' },
  { label: 'Prescriptions', roles: ['PATIENT'], to: ROUTES.prescriptionUpload, scope: '/patient' },
  { label: 'Orders', roles: ['PATIENT'], to: ROUTES.orderTracking, scope: '/patient' },
  { label: 'Verification Queue', roles: ['PHARMACIST'], to: ROUTES.verification, scope: '/pharmacist' },
  { label: 'Inventory', roles: ['PHARMACIST'], to: ROUTES.inventory, scope: '/pharmacist' },
  { label: 'Delivery Board', roles: ['DELIVERY'], to: ROUTES.deliveryDashboard, scope: '/delivery' },
]

export function getDefaultRouteForRole(role) {
  if (role === 'PHARMACIST') {
    return ROUTES.pharmacistDashboard
  }

  if (role === 'DELIVERY') {
    return ROUTES.deliveryDashboard
  }

  return ROUTES.patientDashboard
}
