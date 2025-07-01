# Architecture Document

## 1. Introduction
*   **Project Name:** OutGo
*   **Document Version:** 1.0
*   **Date:** June 30, 2025
*   **Author(s):** Engineering Team
*   **Purpose:** This document describes the architecture of the OutGo application.

## 2. Goals
*   **Architectural Goals:** Scalability to support 100,000 DAUs, high performance with low latency, robust security for user data, and high maintainability.
*   **Business Goals:** Support a seamless user experience for discovering and booking activities, and provide effective tools for merchants and administrators.

## 3. System Overview
*   **System Context Diagram:**
    ```mermaid
    graph TD
        User[User] -- Interacts with --> Frontend[Next.js Frontend]
        Merchant[Merchant] -- Interacts with --> Frontend[Next.js Frontend]
        Admin[Admin] -- Interacts with --> Frontend[Next.js Frontend]
        Frontend -- API Calls --> Backend[Next.js API Routes]
        Backend -- Accesses --> Supabase[Supabase]
        Supabase -- Provides --> DB[(Database)]
        Supabase -- Provides --> Auth[(Authentication)]
        Supabase -- Provides --> Storage[(File Storage)]
        User -- Provides Location --> BrowserAPI[Browser Geolocation API]
        BrowserAPI -- Sends Location --> Frontend
    end
    ```
*   **Component Diagram:**
    ```mermaid
    graph TD
        subgraph "Client (Browser)"
            WebApp[Next.js React App]
        end
        subgraph "Server (Vercel)"
            APIRoutes[Next.js API Routes]
        end
        subgraph "Backend as a Service (Supabase)"
            Database[PostgreSQL DB]
            Auth[Authentication]
            Storage[File Storage]
        end
        WebApp -- HTTP Requests --> APIRoutes
        APIRoutes -- SDK Calls --> Database
        APIRoutes -- SDK Calls --> Auth
        APIRoutes -- SDK Calls --> Storage
    ```

## 4. Components
### 4.1. Frontend
*   **Description:** A web application built with Next.js and React that serves as the user interface for all roles (User, Merchant, Admin).
*   **Responsibilities:** Render UI, handle user interactions, manage client-side state, and communicate with the backend API.
*   **Interfaces:** Web Interface (Desktop).
*   **Dependencies:** Next.js API Routes, Browser Geolocation API.

### 4.2. Backend
*   **Description:** A serverless backend implemented using Next.js API Routes.
*   **Responsibilities:** Handle business logic, process data, and interact with Supabase services.
*   **Interfaces:** RESTful API consumed by the frontend.
*   **Dependencies:** Supabase.

### 4.3. Supabase
*   **Description:** Backend-as-a-Service provider for database, authentication, and storage.
*   **Responsibilities:** Persist application data, manage user identities and sessions, and store user-generated files (e.g., profile pictures).
*   **Interfaces:** PostgreSQL interface, GoTrue API, Storage API.
*   **Dependencies:** None.

## 5. Data Architecture
*   **Data Model:** A relational data model will be used, with tables for Users, Activities, Bookings, Merchants, Reviews, etc.
*   **Data Storage:** Data will be stored in a PostgreSQL database managed by Supabase.
*   **Data Flow:** The frontend sends requests to the backend, which then queries or mutates data in the Supabase database.

## 6. Security
*   **Security Measures:**
    *   User authentication and authorization managed by Supabase Auth.
    *   Row-Level Security (RLS) in PostgreSQL to enforce data access policies.
    *   Secure API endpoints with proper validation and sanitation.
    *   HTTPS for all communication.

## 9. Technology Stack
*   **Programming Language:** TypeScript
*   **Framework:** Next.js (for both frontend and backend)
*   **Database:** PostgreSQL (via Supabase)
*   **Authentication:** Supabase Auth
*   **File Storage:** Supabase Storage
*   **Deployment:** Vercel

## 10. Deployment
*   The application will be deployed on Vercel, connected to a GitHub repository for continuous integration and deployment (CI/CD).

## 11. Monitoring
*   Vercel Analytics for web vitals and traffic.
*   Supabase Dashboard for database health and API usage.
