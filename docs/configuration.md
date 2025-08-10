# Configuration Guide

The MyRide application uses a centralized configuration system defined in `config.yaml` at the root of the project. This configuration file controls various aspects of the application including branding, features, and business rules.

## Overview

The `config.yaml` file is parsed at build time and provides configuration values that are used throughout the application. The configuration is strongly typed and validated to ensure all required fields are present.

## Configuration Structure

### Supabase Configuration
```yaml
supabase_config:
  supabase_url: "https://your-project.supabase.co"
  supabase_publishable_key: "your-publishable-key"
```

This section contains the credentials needed to connect to your Supabase backend.

### Distributor Information
```yaml
distributor:
  name: "KTM"
  full_name: "KTM Nepal"
  logo_url: "https://example.com/logo.png"
  website: "https://ktm.com.np"
```

This section defines the vehicle distributor for which the system is configured. It's used for branding throughout the application.

### Vehicle Types
```yaml
vehicle_types: ["bike"] # Options: ["car"], ["bike"], ["car", "bike"]
```

Defines which types of vehicles the system will manage. Can be configured for bikes only, cars only, or both.

### Vehicle Models
```yaml
vehicle_models:
  bike:
    - model: "Duke"
      variants:
        - name: "200"
          engine_capacity: 200
          years: [2020, 2024, 2025]
        - name: "250"
          engine_capacity: 250
          years: [2021, 2022, 2023]
        - name: "390"
          engine_capacity: 390
          years: [2022, 2023, 2024]
    - model: "Adventure"
      variants:
        - name: "390"
          engine_capacity: 390
          years: [2022, 2023, 2024]
  car: []
```

Defines the available vehicle models and their variants for each vehicle type. This information is used to populate dropdowns in the vehicle creation form.

### Selectable Colors
```yaml
selectable_colors:
  - name: "Black"
    hex: "#000000"
  - name: "White"
    hex: "#FFFFFF"
  - name: "Orange"
    hex: "#FF5C00"
```

Defines colors that can be selected in the application, used for UI theming and potentially vehicle color tracking.

### Color Theme
```yaml
color_theme:
  primary: "#FF5C00" # KTM Orange
  secondary: "#FFFFFF" # White
  tertiary: "#000000" # Black
  accent: "#F5F5F5" # Light Grey
  muted: "#6B7280" # Grey
  destructive: "#EF4444" # Red
  success: "#10B981" # Green
  warning: "#F59E0B" # Yellow
```

Defines the color scheme used throughout the application. These values are converted to HSL and used as CSS variables.

### Analytics Theme
```yaml
analytics_theme:
  # Chart colors for data visualization
  chart_colors: 
    - "#FF5C00" # Primary (KTM Orange)
    - "#10B981" # Success (Green)
    - "#3B82F6" # Blue
    - "#8B5CF6" # Purple
    - "#F59E0B" # Warning (Yellow)
    - "#EF4444" # Destructive (Red)
    - "#06B6D4" # Cyan
    - "#EC4899" # Pink
  
  # Dashboard color scheme
  dashboard_background: "#FFFFFF" # White
  card_background: "#F9FAFB" # Light Gray
  grid_color: "#E5E7EB" # Gray
  text_color: "#1F2937" # Dark Gray
  axis_color: "#6B7280" # Gray
```

Defines the color scheme used specifically for analytics charts and dashboards. This allows you to customize the appearance of data visualizations to match your brand or preferences.

### Typography
```yaml
typography:
  primary_font: "Inter"
  secondary_font: "Inter"
```

Defines the fonts used in the application. Fonts are loaded dynamically at runtime.

### Currency
```yaml
currency:
  symbol: "Nrs"
  name: "Nepalese Rupees"
```

Defines the currency used for financial transactions in the application.

### Features
```yaml
features:
  analytics: true
  customer_calls: true
  service_history: true
  coupon_system: true
  reports: true
```

Enables or disables specific features in the application. This allows for feature toggling based on business needs.

### Business Settings
```yaml
business_settings:
  service_interval_km: 5000
  default_warranty_months: 12
  service_types:
    - "Regular Service"
    - "Major Service"
    - "Engine Overhaul"
    - "Brake Service"
    - "Oil Change"
    - "Chain & Sprocket"
    - "Tire Replacement"
    - "Battery Service"
```

Defines business rules such as the default service interval in kilometers, warranty period, and available service types.

## Configuration Access

Configuration values are accessed through helper functions in `src/config/index.ts`:

- `isFeatureEnabled(feature)`: Check if a feature is enabled
- `getVehicleTypes()`: Get configured vehicle types
- `getVehicleModels(type)`: Get models for a vehicle type
- `getDistributorName()`: Get the distributor name
- `getCurrencySymbol()`: Get the currency symbol
- `getServiceTypes()`: Get the configured service types
- `getSelectableColors()`: Get the selectable colors

These functions provide a clean interface for accessing configuration values throughout the application.

## Customization

To customize the application for your distributor:

1. Update the `distributor` section with your company information
2. Modify the `vehicle_types` to match what you sell
3. Update the `vehicle_models` with your actual product lineup
4. Adjust the `color_theme` to match your brand colors
5. Update the `currency` to match your local currency
6. Modify `business_settings` to match your service intervals and types
7. Enable or disable features as needed

## Validation

The application validates the configuration at startup and will throw errors if required fields are missing:

- Supabase configuration must be present
- Distributor name must be specified
- At least one vehicle type must be specified

This ensures that the application cannot start with an incomplete configuration.