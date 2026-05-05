# Folder Structure Explanation

## Why This Layout

This monorepo is structured so the frontend, backend, and project documentation can evolve independently while staying in one repository. The goal is to make team ownership obvious and keep changes localized.

## Frontend

`frontend/src/components`
- Reusable UI building blocks that can be shared across multiple pages.

`frontend/src/components/layout`
- Navigation, page shell, and shared structural wrappers.

`frontend/src/pages`
- Route-level screens grouped by user role to reduce collisions between teammates.

`frontend/src/services`
- API clients and service adapters for backend communication.

`frontend/src/hooks`
- Reusable React hooks such as data-fetching helpers or form-state helpers.

`frontend/src/utils`
- Pure utility helpers that do not depend on React.

`frontend/src/routes`
- Central place for route definitions and router composition.

## Backend

`backend/src/main/java/com/pharmacy/pharmacy_management/config`
- Spring configuration classes such as CORS, OpenAPI, or bean wiring.

`backend/src/main/java/com/pharmacy/pharmacy_management/controller`
- REST controllers and request entry points.

`backend/src/main/java/com/pharmacy/pharmacy_management/service`
- Business orchestration layer.

`backend/src/main/java/com/pharmacy/pharmacy_management/repository`
- Spring Data repositories for persistence.

`backend/src/main/java/com/pharmacy/pharmacy_management/entity`
- JPA entities mapped to PostgreSQL tables.

`backend/src/main/java/com/pharmacy/pharmacy_management/dto`
- Request and response models exchanged with clients.

`backend/src/main/java/com/pharmacy/pharmacy_management/exception`
- Custom exceptions and global exception handling.

`backend/src/main/java/com/pharmacy/pharmacy_management/security`
- Security configuration, RBAC, JWT filters, and authentication helpers.

## Naming Conventions

- Use `PascalCase` for React components and Java classes.
- Use `camelCase` for JavaScript utilities, hooks, and service helpers.
- Use feature-focused names such as `PrescriptionUploadPage`, `OrderController`, or `InventoryService`.
- Keep one main class or component per file where possible.

## Suggested Team Ownership

- Frontend customer journey: upload, catalog, cart, and checkout pages
- Frontend pharmacist dashboard: verification queue, approvals, inventory screens
- Frontend delivery flow: assignments, status updates, handover screen
- Backend platform: controllers, services, repositories, security, and database setup

## Conflict Reduction Tips

- Add new files rather than repeatedly expanding one oversized shared file.
- Route-level pages should mostly change inside their own role folders.
- Shared contracts between frontend and backend should be documented before implementation.
- If a change touches shared layout or security, keep the PR focused and small.
