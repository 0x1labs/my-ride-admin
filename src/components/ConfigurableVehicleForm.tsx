import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from "@/types/vehicle";
import { config, hasBikes, hasCars, getDistributorName } from "@/config";

interface ConfigurableVehicleFormProps {
  formData: Partial<Vehicle>;
  onChange: (updates: Partial<Vehicle>) => void;
}

const ConfigurableVehicleForm: React.FC<ConfigurableVehicleFormProps> = ({ formData, onChange }) => {
  const vehicleTypes = config.vehicle_types;
  const distributorName = getDistributorName();

  // Generate model options based on vehicle type and distributor
  const getModelOptions = (type: string) => {
    if (distributorName.toLowerCase() === 'ktm' && type === 'bike') {
      return ['Duke 200', 'Duke 250', 'Duke 390', 'Adventure 390', 'RC 200', 'RC 390'];
    }
    if (distributorName.toLowerCase() === 'toyota' && type === 'car') {
      return ['Corolla', 'Camry', 'Prius', 'RAV4', 'Highlander', 'Land Cruiser'];
    }
    if (distributorName.toLowerCase() === 'honda' && type === 'car') {
      return ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'Insight'];
    }
    if (distributorName.toLowerCase() === 'hyundai' && type === 'car') {
      return ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Creta'];
    }
    
    // Default generic options
    return type === 'bike' 
      ? ['Sport Bike', 'Cruiser', 'Adventure', 'Standard', 'Touring'] 
      : ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Wagon', 'Truck'];
  };

  return (
    <div className="grid gap-4">
      {/* Vehicle Type Selection - only show if multiple types are supported */}
      {vehicleTypes.length > 1 && (
        <div className="grid gap-2">
          <Label htmlFor="type">Vehicle Type</Label>
          <Select value={formData.type || ''} onValueChange={(value) => onChange({ type: value as 'bike' | 'car', bikeModel: '', carModel: '' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {hasBikes() && <SelectItem value="bike">Bike</SelectItem>}
              {hasCars() && <SelectItem value="car">Car</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Model Selection based on vehicle type */}
      {formData.type && (
        <div className="grid gap-2">
          <Label htmlFor="model">{formData.type === 'bike' ? 'Bike' : 'Car'} Model</Label>
          <Select 
            value={formData.type === 'bike' ? formData.bikeModel || '' : (formData as any).carModel || ''} 
            onValueChange={(value) => 
              formData.type === 'bike' 
                ? onChange({ bikeModel: value })
                : onChange({ carModel: value } as any)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${formData.type} model`} />
            </SelectTrigger>
            <SelectContent>
              {getModelOptions(formData.type as 'car' | 'bike').map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Year */}
      <div className="grid gap-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          min="1990"
          max={new Date().getFullYear() + 1}
          value={formData.year || ''}
          onChange={(e) => onChange({ year: parseInt(e.target.value) || 0 })}
          placeholder="e.g., 2023"
        />
      </div>

      {/* Engine Capacity */}
      <div className="grid gap-2">
        <Label htmlFor="engineCapacity">
          {formData.type === 'bike' ? 'Engine Capacity (CC)' : 'Engine Capacity (L)'}
        </Label>
        <Input
          id="engineCapacity"
          type="number"
          min="0"
          value={formData.engineCapacity || ''}
          onChange={(e) => onChange({ engineCapacity: parseInt(e.target.value) || 0 })}
          placeholder={formData.type === 'bike' ? "e.g., 390" : "e.g., 2.0"}
        />
      </div>

      {/* Owner Name */}
      <div className="grid gap-2">
        <Label htmlFor="owner">Owner Name</Label>
        <Input
          id="owner"
          value={formData.owner || ''}
          onChange={(e) => onChange({ owner: e.target.value })}
          placeholder="Enter owner name"
        />
      </div>

      {/* Phone Number */}
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="Enter phone number"
        />
      </div>

      {/* Current Kilometers */}
      <div className="grid gap-2">
        <Label htmlFor="currentKilometers">Current {formData.type === 'bike' ? 'Kilometers' : 'Mileage'}</Label>
        <Input
          id="currentKilometers"
          type="number"
          min="0"
          value={formData.currentKilometers || ''}
          onChange={(e) => onChange({ currentKilometers: parseInt(e.target.value) || 0 })}
          placeholder="Enter current reading"
        />
      </div>

      {/* Last Service Kilometers */}
      <div className="grid gap-2">
        <Label htmlFor="lastServiceKilometers">Last Service {formData.type === 'bike' ? 'Kilometers' : 'Mileage'}</Label>
        <Input
          id="lastServiceKilometers"
          type="number"
          min="0"
          value={formData.lastServiceKilometers || ''}
          onChange={(e) => onChange({ lastServiceKilometers: parseInt(e.target.value) || 0 })}
          placeholder="Enter last service reading"
        />
      </div>

      {/* Last Service Date */}
      <div className="grid gap-2">
        <Label htmlFor="lastService">Last Service Date</Label>
        <Input
          id="lastService"
          type="date"
          value={formData.lastService || ''}
          onChange={(e) => onChange({ lastService: e.target.value })}
        />
      </div>

      {/* Next Service Date */}
      <div className="grid gap-2">
        <Label htmlFor="nextService">Next Service Date</Label>
        <Input
          id="nextService"
          type="date"
          value={formData.nextService || ''}
          onChange={(e) => onChange({ nextService: e.target.value })}
        />
      </div>
    </div>
  );
};

export default ConfigurableVehicleForm;