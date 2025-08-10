# Triumph Nepal Configuration

This document provides information about the Triumph Nepal configuration file and how to use it with the MyRide vehicle service management system.

## Overview

The `config.triumph.yaml` file is a pre-configured configuration for Triumph Nepal dealerships. It includes Triumph's motorcycle lineup, brand colors, and other settings specific to Triumph's branding and product offerings in Nepal.

Based on research from the official Triumph Nepal website (https://www.triumphmotorcyclesnepal.com), this configuration accurately reflects the current models and brand identity.

## Using the Triumph Configuration

To use this configuration with your MyRide installation:

1. Backup your existing `config.yaml` file:
   ```bash
   cp config.yaml config.yaml.backup
   ```

2. Replace the existing configuration with the Triumph configuration:
   ```bash
   cp config.triumph.yaml config.yaml
   ```

3. Restart your development server or rebuild the application:
   ```bash
   npm run dev
   ```

## Configuration Details

### Brand Information
The configuration is set up with Triumph Nepal's brand information:
- Distributor name: "Triumph"
- Full name: "Triumph Nepal"
- Website: https://www.triumphmotorcyclesnepal.com
- Logo: Official Triumph Nepal logo

### Vehicle Models
Based on the Triumph Nepal website, the configuration includes the currently available models:
- Speed 400 (399cc)
- Scrambler 400X (399cc)

Each model includes typical engine capacities and model years (2022-2025).

### Brand Colors
The color theme is configured with Triumph's signature black as the primary color:
- Primary: #000000 (Triumph Black)
- Secondary: #FFFFFF (White)
- Tertiary: #F6F6F6 (Light Gray)

### Warranty and Service
Triumph motorcycles typically come with a 2-year warranty, which is reflected in the configuration:
- Default warranty: 24 months
- Service interval: Every 5,000 km

## Customization

While this configuration is tailored for Triumph Nepal, you may need to customize it further based on:

1. **Model Availability**: The configuration currently includes Speed 400 and Scrambler 400X, which are the models featured on the Triumph Nepal website. If other models become available, they can be added to the configuration.

2. **Actual Variants**: Engine capacities and model years should be verified against current Nepal offerings.

3. **Pricing**: The currency is set to Nepalese Rupees (Nrs), which is correct for Nepal.

4. **Service Types**: The service types included are standard motorcycle services. Add or remove based on Triumph's specific service offerings.

## Updating Model Information

To update model information:

1. Edit the `vehicle_models` section in `config.yaml`
2. Modify the model names, variants, engine capacities, and years as needed
3. Save the file and restart the application

Example:
```yaml
vehicle_models:
  bike:
    - model: "Speed"
      variants:
        - name: "400"
          engine_capacity: 399
          years: [2022, 2023, 2024, 2025]
```

## Updating Brand Colors

To update brand colors:

1. Modify the `color_theme` section in `config.yaml`
2. Change the hex values to match current brand guidelines
3. Save the file and restart the application

Example:
```yaml
color_theme:
  primary: "#000000" # Triumph Black
```

## Verification

After applying the configuration, verify that:

1. The Triumph logo appears in the header
2. The correct color scheme is applied throughout the application
3. Triumph motorcycle models appear in the vehicle creation forms
4. The warranty period is set to 24 months
5. The service interval is set to 5,000 km

## Support

If you encounter issues with the configuration:

1. Verify that all required fields are present
2. Check that the YAML syntax is correct
3. Ensure that at least one vehicle type is specified
4. Confirm that the Supabase configuration is correct

For further assistance, contact the MyRide support team or refer to the main documentation.