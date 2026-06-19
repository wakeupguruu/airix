# Airix

Airix is a next-generation AI-powered web platform for designing aircraft, fighter jets, and drones. It provides an intelligent workspace for aerospace engineers, enthusiasts, and designers, seamlessly integrating generative AI for 3D modeling and predictive maintenance.

## Key Features

- **AI-Powered Design Workspaces**: 
  - **Text-to-Image-to-Model**: Generate 4 design concept images from a text prompt, select your favorite, and convert it into a 3D model.
  - **Text-to-Model & Image-to-Model**: Direct generation of 3D aircraft components and full models from descriptions or reference images.
  - **Blank Workspace**: A fully customizable 3D canvas for manual design and component assembly.
- **Predictive Maintenance & Failure Analysis**: Monitor existing aircraft or drones. Upload CSV sensor data or manually enter flight details. Our integrated Gen AI analyzes the telemetry to predict component failures, estimate remaining flight hours, and provide actionable maintenance insights.
- **AI Physics & Cost Analyst**: Within the 3D workspace, an intelligent chatbot acts as your co-engineer. Ask for physical analyses (e.g., real-world feasibility, weight, aerodynamics). The AI will proactively request necessary specifications (such as body material or engine type) to calculate manufacturing costs, weight distribution, and physics metrics accurately.
- **Project Library**: A centralized dashboard to list, manage, and revisit all your design workspaces.

## Monorepo Architecture

This project is structured as a modern Turborepo workspace.

- `apps/web`: The primary Next.js frontend application.
- `packages/ui`: Shared React UI component library.
- `packages/tailwind-config`: Shared Tailwind CSS v4 design tokens and configurations.
- `packages/typescript-config`: Shared TypeScript rules.
- `packages/eslint-config`: Shared ESLint settings.

## Getting Started

1. Install dependencies using `pnpm` (from the repository root):
   ```bash
   pnpm install
   ```

2. Start the development servers:
   ```bash
   pnpm run dev
   ```

3. The primary web application will be available at `http://localhost:3001`.

## Development Commands

- `pnpm run build` - Build all applications and packages.
- `pnpm run lint` - Run ESLint checks across the monorepo.
- `pnpm run check-types` - Run TypeScript compiler checks.
- `pnpm run format` - Format the codebase using Prettier.
