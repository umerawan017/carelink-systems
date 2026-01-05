# CareLink Systems

A comprehensive healthcare management platform designed for modern medical practices.

## Features

- **Patient Management**: Complete patient profiles with medical history, allergies, and conditions
- **Appointment Scheduling**: Calendar-based scheduling with conflict detection and real-time updates
- **Vitals Tracking**: Interactive charts for blood pressure, heart rate, weight, and temperature trends
- **Medical Records**: Centralized medical logs with provider attribution
- **User Authentication**: Secure login and signup with role-based access

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: TanStack React Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd carelink-systems

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The application requires the following environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

## Project Structure

```
src/
├── components/
│   ├── appointments/    # Appointment scheduling components
│   ├── dashboard/       # Dashboard widgets
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── patients/        # Patient management components
│   ├── ui/              # Reusable UI components
│   └── vitals/          # Vitals tracking components
├── hooks/               # Custom React hooks
├── pages/               # Route pages
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions
```

## License

Copyright © 2024 CareLink Systems. All rights reserved.
