# Pharmacy Order & Prescription Management System

A complete full-stack pharmacy platform with separate frontend, backend, and documentation workspaces.

## Tech Stack

- **Frontend**: React with Vite, React Router, TailwindCSS
- **Backend**: Spring Boot, Spring Security, Spring Data JPA
- **Database**: PostgreSQL

## Setup & Running Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be accessible at `http://localhost:5173`.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or on Windows:
```powershell
.\mvnw.cmd spring-boot:run
```

The backend API will run on `http://localhost:8080`.
**Database Setup**: Before running the backend, make sure PostgreSQL is available. The application will connect using `jdbc:postgresql://localhost:5432/postgres` with default credentials (`postgres`/`loveushriji` as per `application.properties`).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate users (Patient, Pharmacist, Delivery)
- `POST /api/auth/register` - Register a new Patient account
- `GET /api/auth/me` - Get current authenticated user details

### Patient APIs
- `GET /api/patient/prescriptions` - Get patient's uploaded prescriptions
- `POST /api/patient/prescriptions/upload` - Upload a new prescription
- `POST /api/patient/orders/checkout` - Checkout cart
- `GET /api/patient/orders` - Get patient's order history

### Pharmacist & Admin APIs
- `GET /api/medicines` - Fetch all medicines
- `GET /api/prescriptions` - List all uploaded prescriptions
- `PUT /api/prescriptions/{id}/status` - Verify/Reject prescriptions
- `GET /api/orders` - Fetch all orders
- `PUT /api/orders/{id}/status` - Update order status (Pharmacist/Delivery)

## Team Collaboration Notes

To keep ownership boundaries clear and prevent merge conflicts, please adhere to the following workflow:

- **Patient Flows**: UI updates for patient dashboard, catalog, cart, and tracking should remain in `frontend/src/pages/patient`
- **Pharmacist Flows**: Inventory and verification workflows should be edited within `frontend/src/pages/pharmacist`
- **Delivery Flows**: Delivery tracking UI is contained in `frontend/src/pages/delivery`
- **Shared Components**: Add shared UI components to `frontend/src/components/common` or `layout`.
- **Backend API**: When modifying endpoints, ensure DTOs (`backend/src/main/java/.../dto`) and Controllers are consistently updated. Update the frontend `apiClient.js` and relevant `services/*.js` files to reflect those changes.

See `docs/folder-structure.md` for a fuller explanation of responsibilities and naming conventions.
