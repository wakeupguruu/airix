# Airix Web Application

This is the primary frontend application for **Airix**, an AI-powered platform for designing aircraft, fighter jets, and drones. 

Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **React Three Fiber**, it provides a premium, interactive 3D environment for aerospace design, physics analysis, and predictive maintenance.

## Application Routes & Structure

The application is organized into the following key pages:

- `/` - **Home**: The landing page featuring an interactive 3D showroom and platform introduction.
- `/pricing` - **Pricing**: Subscription tiers and access plans.
- `/login` & `/register` - **Authentication**: User onboarding, login, and registration flows.
- `/library` - **Project Library**: A dashboard listing all user workspaces and past designs.
- `/workspace` - **Workspace Creation**: The entry point to start a new project. Users can choose to generate designs via Text-to-Image (pick 1 of 4 to generate a model), Text-to-Model, Image-to-Model, or start from a Blank canvas.
- `/workspace/[project-id]` - **Active Workspace**: The core 3D modeling environment. Includes the **AI Physics Chatbot** which gathers requirements (like materials and engine specs) to calculate weight, cost, and real-world physics behavior.
- `/maintenance` - **Predictive Maintenance**: A dashboard to track existing aircraft health. Users can upload sensor CSVs or enter data manually for AI-driven failure prediction and lifespan estimation.
- `/profile` - **User Profile**: Manage personal information and account details.
- `/settings` - **Settings**: Application preferences and configurations.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 (configured with a warm cream/coral premium editorial theme)
- **3D Rendering**: React Three Fiber, Drei, and Three.js
- **Animations**: GSAP
- **Theming**: `next-themes` for seamless Light/Dark mode transitions

## Local Development

To run this application locally, ensure you are in the root of the monorepo or within this directory, then execute:

```bash
# Start the Next.js development server
pnpm run dev
```

The application will start on port `3001`. Open [http://localhost:3001](http://localhost:3001) in your browser.
