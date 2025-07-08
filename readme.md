# Creative Portfolio SAAS Application created with Bolt.new

A full-stack SaaS application designed for creative professionals to showcase their work, manage projects, and grow their business. This platform includes robust user authentication, a dynamic portfolio system, an administrative dashboard for managing plans and coupons, and integrated tools like a faceswap studio and a todo board.

## Features

*   **User Authentication**: Secure sign-up, sign-in, password reset, and social login (Google, Facebook) powered by Supabase.
*   **Admin Dashboard**: (Accessible to super admin user: `admin@admin.com` with password `admin@123`)
    *   **User Management**: View and manage user accounts, including activation/deactivation and password resets.
    *   **Plan Management**: Create, edit, and delete subscription plans with configurable features (e.g., max published items, faceswap enabled, custom domain, priority support) and pricing.
    *   **Coupon Management**: Add, update, and delete discount coupons, define their applicability to specific plans, discount percentages, expiry dates, and usage limits.
    *   **Statistics**: Overview of total users, active plans, active coupons, and potential monthly revenue.
*   **Subscription & Pricing**:
    *   Users can view available plans and upgrade their subscriptions.
    *   Apply coupon codes during plan upgrades for discounts.
    *   Direct upgrade for zero-cost plans (e.g., after coupon application).

*   **Todo Board**: A Kanban-style board to manage tasks with "To Do", "In Progress", and "Done" columns.
*   **Responsive Design**: Optimized for various screen sizes using Tailwind CSS.
*   **Theme Toggling**: Switch between light and dark themes.
*   **Toast Notifications**: User-friendly feedback for actions.

## Technologies Used

*   **Frontend**:
    *   **React**: A JavaScript library for building user interfaces.
    *   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
    *   **Vite**: A fast build tool for modern web projects.
    *   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    *   **React Router DOM**: For client-side routing.
    *   **Lucide React**: A collection of beautiful and customizable open-source icons.
    *   **React Hot Toast**: For elegant and responsive toast notifications.
*   **Backend (Mocked/Local Storage)**:
    *   **Supabase**: Used for user authentication.
    *   **Local Storage**: For managing application data (work items, todos, admin data, faceswap data) in a client-side mock database.

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd creative-portfolio-saas
```

### 2. Install Dependency

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
Create a .env file in the root directory and add your Supabase credentials:
```bash

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
### 4. Run the Development Server
```bash

npm run dev
# or
yarn dev

```

### 5. Features
* Landing Page <domain>
* Admin panel : <domain>/admin
* Supabase authentication and backend support
    * Social Auth Authentication
    * Email Authentication and Email confirmation. 
* User Panel
    * Dashboard
    * Profile Page
    * Settings

* Admin Panel(<domain>/admin)
    * User management 
    * Plan management
    * Coupon Management
    * Payment Gateway(to do)

*  Type-safe and modular components using TypeScript
* 🎨 Beautiful UIs with Tailwind CSS
* 🔁 Smooth navigation with React Router
* 📢 Elegant toast notifications with React Hot Toast
* 🎯 Pixel-perfect icons using Lucide React

