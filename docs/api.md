# API Documentation

This document outlines the API endpoints and data structures used in the MyRide Vehicle Service Management System.

## Overview

The application uses Supabase as its backend service, which provides a RESTful API for database operations. All API interactions are handled through the `supabaseService.ts` file in the services directory.

## Authentication

### Login
```javascript
supabase.auth.signInWithPassword({ email, password })
```

### Logout
```javascript
supabase.auth.signOut()
```

### Get User Profile
```javascript
supabase.auth.getUser()
```

## Vehicles

### Get All Vehicles
```javascript
supabase.from('vehicles').select('*')
```

### Get Vehicle by ID
```javascript
supabase.from('vehicles').select('*').eq('id', vehicleId).single()
```

### Create Vehicle
```javascript
supabase.from('vehicles').insert([vehicleData])
```

### Update Vehicle
```javascript
supabase.from('vehicles').update(vehicleData).eq('id', vehicleId)
```

### Delete Vehicle
```javascript
supabase.from('vehicles').delete().eq('id', vehicleId)
```

## Service Records

### Get All Service Records
```javascript
supabase.from('service_records').select('*')
```

### Get Service Records by Vehicle
```javascript
supabase.from('service_records').select('*').eq('vehicle_id', vehicleId)
```

### Create Service Record
```javascript
supabase.from('service_records').insert([serviceRecordData])
```

### Update Service Record
```javascript
supabase.from('service_records').update(serviceRecordData).eq('id', serviceRecordId)
```

### Delete Service Record
```javascript
supabase.from('service_records').delete().eq('id', serviceRecordId)
```

## Call Records

### Get All Call Records
```javascript
supabase.from('call_records').select('*')
```

### Get Call Record by Vehicle
```javascript
supabase.from('call_records').select('*').eq('vehicle_id', vehicleId).single()
```

### Create/Update Call Record
```javascript
supabase.from('call_records').upsert([callRecordData])
```

## Users (Super Admin)

### Get All Users
```javascript
supabase.from('users').select('*')
```

### Get User by ID
```javascript
supabase.from('users').select('*').eq('id', userId).single()
```

### Update User
```javascript
supabase.from('users').update(userData).eq('id', userId)
```

### Delete User
```javascript
supabase.from('users').delete().eq('id', userId)
```

## Data Models

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('bike', 'car')),
  bike_model VARCHAR(100),
  car_model VARCHAR(100),
  year INTEGER NOT NULL,
  engine_capacity DECIMAL NOT NULL,
  owner VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  last_service DATE NOT NULL,
  next_service DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  last_service_kilometers INTEGER NOT NULL,
  current_kilometers INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Service Records Table
```sql
CREATE TABLE service_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(100) NOT NULL,
  parts JSONB NOT NULL,
  labor_cost DECIMAL NOT NULL,
  discount DECIMAL DEFAULT 0,
  technician VARCHAR(100) NOT NULL,
  notes TEXT,
  has_coupon BOOLEAN DEFAULT FALSE,
  coupon_type VARCHAR(50),
  kilometers INTEGER NOT NULL,
  service_center_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Call Records Table
```sql
CREATE TABLE call_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  called BOOLEAN DEFAULT FALSE,
  notes TEXT,
  call_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling

All API responses follow standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include:
```json
{
  "error": {
    "message": "Error description",
    "details": "Additional error details"
  }
}
```

## Rate Limiting

Supabase implements rate limiting to prevent abuse. Current limits:
- 1,000 requests per hour per project
- 30,000 requests per day per project

## Security

### Authentication
- All API requests require authentication via JWT tokens
- Tokens are automatically refreshed by the Supabase client

### Authorization
- Row Level Security (RLS) policies control data access
- Users can only access data associated with their account
- Super admins have broader access for user management

### Data Protection
- All data is encrypted in transit using HTTPS
- Sensitive data is encrypted at rest
- Regular security audits are performed

## Environment Variables

The application requires the following environment variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These should be configured in your deployment environment.

## Webhooks

Currently, the application does not implement webhooks, but future versions may include:
- Service reminder notifications
- Overdue service alerts
- User activity notifications

## Versioning

The API follows the versioning scheme of the underlying Supabase platform. Breaking changes will be communicated in advance.

## Support

For API-related issues, please contact:
- System administrator
- Supabase support (for platform issues)