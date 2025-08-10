import yaml from 'js-yaml';
import configYaml from '../../config.yaml?raw';

export interface AppConfig {
  supabase_config: {
    supabase_url: string;
    supabase_publishable_key: string;
  };
  database?: Record<string, any>;
  distributor: {
    name: string;
    full_name: string;
    logo_url?: string;
    website?: string;
  };
  vehicle_types: ('car' | 'bike')[];
  vehicle_models: {
    bike: {
      model: string;
      variants: {
        name: string;
        engine_capacity: number;
        years: number[];
      }[];
    }[];
    car: {
      model: string;
      variants: {
        name: string;
        engine_capacity: number;
        years: number[];
      }[];
    }[];
  };
  selectable_colors: {
    name: string;
    hex: string;
  }[];
  color_theme: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    muted: string;
    destructive: string;
    success: string;
    warning: string;
  };
  analytics_theme: {
    chart_colors: string[];
    dashboard_background: string;
    card_background: string;
    grid_color: string;
    text_color: string;
    axis_color: string;
  };
  typography: {
    primary_font: string;
    secondary_font: string;
  };
  currency: {
    symbol: string;
    name: string;
  };
  features: {
    analytics: boolean;
    customer_calls: boolean;
    service_history: boolean;
    coupon_system: boolean;
    reports: boolean;
  };
  business_settings: {
    service_interval_km: number;
    default_warranty_months: number;
    service_types: string[];
  };
}

// Parse the config at build time
const config = yaml.load(configYaml) as AppConfig;

// Validate required fields
if (!config.supabase_config?.supabase_url || !config.supabase_config?.supabase_publishable_key) {
  throw new Error('Supabase configuration is required');
}

if (!config.distributor?.name) {
  throw new Error('Distributor name is required');
}

if (!config.vehicle_types?.length) {
  throw new Error('At least one vehicle type must be specified');
}

export { config };

// Helper functions
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature] ?? false;
};

export const getVehicleTypes = (): ('car' | 'bike')[] => {
  return config.vehicle_types;
};

export const hasBikes = (): boolean => {
  return config.vehicle_types.includes('bike');
};

export const hasCars = (): boolean => {
  return config.vehicle_types.includes('car');
};

export const getDistributorName = (): string => {
  return config.distributor.name;
};

export const getDistributorFullName = (): string => {
  return config.distributor.full_name || config.distributor.name;
};

export const getCurrencySymbol = (): string => {
  return config.currency.symbol;
};

export const getServiceTypes = (): string[] => {
  return config.business_settings.service_types;
};

export const getVehicleModels = (type: 'car' | 'bike'): { model: string; variants: { name: string; engine_capacity: number; years: number[] }[] }[] => {
  return config.vehicle_models[type] || [];
};

export const getSelectableColors = (): { name: string; hex: string }[] => {
  return config.selectable_colors || [];
};

// Theme utilities
export const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const generateThemeVariables = (): string => {
  const theme = config.color_theme;
  return `
    --primary: ${hexToHsl(theme.primary)};
    --secondary: ${hexToHsl(theme.secondary)};
    --accent: ${hexToHsl(theme.accent)};
    --muted: ${hexToHsl(theme.muted)};
    --destructive: ${hexToHsl(theme.destructive)};
    --success: ${hexToHsl(theme.success)};
    --warning: ${hexToHsl(theme.warning)};
  `;
};

export const getAnalyticsChartColors = (): string[] => {
  return config.analytics_theme?.chart_colors || [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
  ];
};

export const ANALYTICS_COLORS = getAnalyticsChartColors();
