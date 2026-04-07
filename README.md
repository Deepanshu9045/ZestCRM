# ZestCRM

ZestCRM is a modern customer relationship management application built with Next.js, React, TypeScript, and Firebase. The project is structured to support core CRM workflows such as lead management, customer tracking, pipeline visibility, task coordination, reporting, and account settings.

## Overview

The application uses the Next.js App Router and is organized around feature-focused routes. Users are redirected from the root route to the main application experience under `/home`, with additional sections for:

- Authentication
- Customers
- Dashboard
- Leads
- Pipeline
- Reports
- Settings
- Tasks

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Firebase and Firebase Admin
- NextAuth
- Tailwind CSS 4
- Recharts
- `@dnd-kit` for drag-and-drop interactions

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file for the EmailJS contact form:

```bash
cp .env.example .env.local
```

Then add your EmailJS service ID, template ID, and public key to `.env.local`.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` checks the codebase with ESLint

## Project Structure

Key folders in the repository include:

- `app/` for routes, layouts, and feature pages
- `components/` for reusable UI building blocks
- `lib/` for shared utilities and helpers
- `services/` for application service logic
- `types/` for shared TypeScript definitions
- `public/` for static assets

## Development Notes

- The application uses the App Router architecture in Next.js.
- The default entry route redirects to `/home`.
- Styling is managed with Tailwind CSS.

## Deployment

For production deployment, build the application and run the generated output with Node.js:

```bash
npm run build
npm run start
```

You can deploy the project on any platform that supports Next.js applications.
