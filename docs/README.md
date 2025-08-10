# MyRide - Vehicle Service Management System

MyRide is a comprehensive vehicle service management system designed specifically for vehicle distributors to efficiently handle service history tracking, customer communication, and business analytics.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Core Modules](#core-modules)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

MyRide helps vehicle distributors (particularly bike distributors) manage their entire service operations ecosystem. The system provides tools to track service history, communicate with customers, and analyze business performance through detailed analytics.

## Key Features

### Vehicle Management
- Track vehicle details (model, year, engine capacity)
- Monitor service schedules (last service, next service dates)
- Manage owner information and contact details

### Service History Management
- Detailed service records with parts used and costs
- Technician tracking and service center information
- Coupon/discount tracking
- Service notes and documentation

### Customer Call Management
- Systematic calling workflow for service reminders
- Status tracking (called/not called)
- Call notes and documentation
- Priority-based calling (overdue services first)

### Analytics & Reporting
- Revenue tracking and service value analysis
- Service type distribution
- Technician performance metrics
- Repeat business tracking

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn-ui components
- **State Management**: React Query for server state
- **Routing**: React Router
- **Build Tool**: Vite
- **Data Visualization**: Recharts for analytics dashboards

## Getting Started

### Prerequisites
- Node.js & npm installed

### Installation
```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/          # React contexts (AuthContext)
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API service integrations
├── types/             # TypeScript type definitions
├── config/            # Configuration files
└── utils/             # Utility functions
```

## User Roles

### Regular Users
- Manage vehicles and service records
- Track customer communications
- View analytics and reports

### Super Admin
- All regular user capabilities
- User management and system configuration

## Core Modules

### Dashboard
The main interface providing an overview of key metrics and quick access to all system features.

### Vehicle Management
Central module for adding, editing, and viewing vehicle information including service schedules.

### Service History
Detailed tracking of all service activities with cost breakdowns and technician information.

### Customer Calls
Systematic approach to customer communication with status tracking and notes.

### Analytics
Comprehensive business insights through visual dashboards and reports.

## Deployment

The application can be deployed directly through Lovable:
1. Open [Lovable Project](https://lovable.dev/projects/207dd849-7efa-408f-bd08-60ca46fbf44a)
2. Navigate to Share -> Publish

## Contributing

Contributions are welcome! Please follow standard GitHub workflows for submitting issues and pull requests.