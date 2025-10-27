# Nexus - Digital Marketing Agency Website

Nexus is a modern, full-stack website for a digital marketing agency, built with a performance-first approach. It features a dynamic project portfolio, a complete admin dashboard for content management, and a secure Appwrite backend for handling data, authentication, and user messages.

## Live Demo

**You can view the live project deployment here: [https://nexus-nu-livid.vercel.app/](https://nexus-nu-livid.vercel.app/)**

---

## Key Features

- **Appwrite Backend:** Utilizes **Appwrite** for robust backend services, including:
  - **Authentication:** Secure user login, signup, and account management.
  - **Database:** Manages dynamic content for projects, user profiles, and contact messages.
  - **Storage:** Handles image uploads for project case studies.
- **Admin Dashboard:** A protected, role-based admin panel where administrators can:
  - **Create, Read, Update, and Delete (CRUD)** marketing projects/case studies.
  - **Manage Users:** View and manage registered users.
  - **View Messages:** Read and manage messages sent through the contact form.
- **Dynamic Portfolio:** A "Projects" page that fetches and displays case studies directly from the Appwrite database, with individual pages for detailed case studies.
- **Performance Optimized:**
  - **Lazy Loading:** Implements `React.lazy()` and `Suspense` for route-based code splitting, dramatically reducing initial load time.
  - **Custom Loading Screen:** A responsive, theme-aware loading animation provides a smooth user experience during page transitions.
  - **Asset Optimization:** All external images (Unsplash, etc.) have been localized, compressed, and converted to modern formats like `.webp`.
- **Modern UI/UX:**
  - **Tailwind CSS:** A utility-first CSS framework for rapid, responsive UI development.
  - **shadcn/ui:** Beautifully designed, accessible, and composable components.
  - **Light/Dark Mode:** Full support for system-based or user-toggled light and dark themes, with an anti-flicker script on initial load.
- **Contact Form:** A functional "Contact Us" page that submits user messages directly to an Appwrite collection for admin review.

---

## Tech Stack

### Frontend

- **Framework:** [React 18](https://reactjs.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **State Management:** React Context API (for Auth)

### Backend

- **Service:** [Appwrite (Cloud or Self-Hosted)](https://appwrite.io/)
- **Services Used:** Authentication, Databases, Storage

---

## Getting Started

Follow these instructions to get a local copy up and running for development purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)
- An [Appwrite](https://appwrite.io/) project (either self-hosted or on Appwrite Cloud).

### 1. Set Up Your Own Appwrite Backend

Before running the frontend, you **must configure your own Appwrite project**:

1.  **Create a Project:** Log in to your Appwrite console and create a new project.
2.  **Create Web Platform:** Add a new "Web" platform. Use `http://localhost:8080` (or your dev port) for the hostname during development.
3.  **Authentication:**
    - Enable the "Email/Password" login method.
    - Consider adding an `admin` role via the "Teams" section for protected routes.
4.  **Database:**
    - Create a new database (e.g., "NexusDB").
    - Create the following collections:
      - **`users`:**
        - **Attributes:** `name` (string), `email` (string), `isAdmin` (boolean, default: false).
        - **Permissions:** Document-level read/write access for the user who created it.
      - **`projects`:**
        - **Attributes:** `title` (string), `slug` (string, **required**), `client` (string), `imageUrl` (string), `challenge` (string, markdown), `solution` (string, markdown), `results` (string, markdown), `details` (string, JSON - optional).
        - **Permissions:** Open read access for anyone, write access for admins.
        - **Indexes:** Create an index on the `slug` attribute for fast querying.
      - **`messages`:**
        - **Attributes:** `userId` (string), `email` (string), `service` (string), `message` (string, markdown), `status` (string, default: "pending").
        - **Permissions:** Write access for any authenticated user, read/update/delete access for admins.
5.  **Storage:**
    - Create a new storage bucket (e.g., "project-images").
    - **Permissions:** Open read access for anyone, write access for admins.

### 2. Local Frontend Installation

1.  **Clone the repository:**

    ```sh
    git clone [https://github.com/your-username/nexus.git](https://github.com/your-username/nexus.git)
    cd nexus
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    # OR
    bun install
    ```

3.  **Create Environment File:**
    Create a `.env` file in the root of the project. Copy the variables below and **fill them with your own Appwrite project credentials** from Step 1.

    ```.env
    VITE_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
    VITE_APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT
    VITE_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID
    VITE_APPWRITE_USERS_COLLECTION_ID=YOUR_USERS_COLLECTION_ID
    VITE_APPWRITE_MESSAGES_COLLECTION_ID=YOUR_MESSAGES_COLLECTION_ID
    VITE_APPWRITE_PROJECTS_COLLECTION_ID=YOUR_PROJECTS_COLLECTION_ID
    VITE_APPWRITE_STORAGE_BUCKET_ID=YOUR_STORAGE_BUCKET_ID
    ```

    _Note: `VITE_APPWRITE_ENDPOINT` will be `https://cloud.appwrite.io/v1` if you are using Appwrite Cloud, or your self-hosted URL (e.g., `http://localhost/v1`)._

4.  **Run the development server:**
    ```sh
    npm run dev
    # OR
    bun run dev
    ```
    Your site should now be running at `http://localhost:8080` (or the port specified by Vite).

---
