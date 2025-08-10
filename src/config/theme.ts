import { config, hexToHsl } from './index';

// Generate theme CSS at build time
export const generateThemeCSS = (): string => {
  const theme = config.color_theme;
  
  // Convert hex colors to HSL for CSS variables
  const lightTheme = `
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: ${hexToHsl(theme.primary)};
      --primary-foreground: 0 0% 100%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: ${hexToHsl(theme.muted)};
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: ${hexToHsl(theme.accent)};
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: ${hexToHsl(theme.destructive)};
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 222.2 84% 4.9%;
      --radius: 0.5rem;
      --sidebar-background: 0 0% 98%;
      --sidebar-foreground: 240 5.3% 26.1%;
      --sidebar-primary: 240 5.9% 10%;
      --sidebar-primary-foreground: 0 0% 98%;
      --sidebar-accent: 240 4.8% 95.9%;
      --sidebar-accent-foreground: 240 5.9% 10%;
      --sidebar-border: 220 13% 91%;
      --sidebar-ring: 217.2 91.2% 59.8%;
    }
  `;

  const darkTheme = `
    .dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
      --card: 222.2 84% 4.9%;
      --card-foreground: 210 40% 98%;
      --popover: 222.2 84% 4.9%;
      --popover-foreground: 210 40% 98%;
      --primary: 210 40% 98%;
      --primary-foreground: 222.2 47.4% 11.2%;
      --secondary: 217.2 32.6% 17.5%;
      --secondary-foreground: 210 40% 98%;
      --muted: 217.2 32.6% 17.5%;
      --muted-foreground: 215 20.2% 65.1%;
      --accent: 217.2 32.6% 17.5%;
      --accent-foreground: 210 40% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 210 40% 98%;
      --border: 217.2 32.6% 17.5%;
      --input: 217.2 32.6% 17.5%;
      --ring: 212.7 26.8% 83.9%;
      --sidebar-background: 240 5.9% 10%;
      --sidebar-foreground: 240 4.8% 95.9%;
      --sidebar-primary: 224.3 76.3% 48%;
      --sidebar-primary-foreground: 0 0% 100%;
      --sidebar-accent: 240 3.7% 15.9%;
      --sidebar-accent-foreground: 240 4.8% 95.9%;
      --sidebar-border: 240 3.7% 15.9%;
      --sidebar-ring: 217.2 91.2% 59.8%;
    }
  `;

  return lightTheme + darkTheme;
};

// Apply theme to document head
export const applyTheme = (): void => {
  if (typeof document === 'undefined') return;

  const existingStyle = document.getElementById('dynamic-theme');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = 'dynamic-theme';
  style.textContent = generateThemeCSS();
  document.head.appendChild(style);
};

// Font loading utility
export const loadFonts = (): void => {
  if (typeof document === 'undefined') return;

  const fonts = [config.typography.primary_font, config.typography.secondary_font];
  const uniqueFonts = [...new Set(fonts)];

  uniqueFonts.forEach(font => {
    if (font !== 'Inter') { // Inter is already loaded by default
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  });
};