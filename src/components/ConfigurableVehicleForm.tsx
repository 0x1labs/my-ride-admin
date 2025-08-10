import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from "@/types/vehicle";
import { config, hasBikes, hasCars, getVehicleModels } from "@/config";

interface ConfigurableVehicleFormProps {
  formData: Partial<Vehicle>;
  onChange: (updates: Partial<Vehicle>) => void;
}

const ConfigurableVehicleForm: React.FC<ConfigurableVehicleFormProps> = ({ formData, onChange }) => {
  const vehicleTypes = config.vehicle_types;
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const vehicleModels = getVehicleModels(formData.type as 'car' | 'bike');

  useEffect(() => {
    setSelectedModel(null);
    setSelectedVariant(null);
    setAvailableYears([]);
  }, [formData.type]);

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    setSelectedVariant(null);
    setAvailableYears([]);
  };

  const handleVariantChange = (variantName: string) => {
    setSelectedVariant(variantName);
    const model = vehicleModels.find(m => m.model === selectedModel);
    if (model) {
      const variant = model.variants.find(v => v.name === variantName);
      if (variant) {
        setAvailableYears(variant.years);
        const fullModelName = `${model.model} ${variant.name}`;
        const updates: Partial<Vehicle> = {
          engineCapacity: variant.engine_capacity,
        };
        if (formData.type === 'bike') {
          updates.bikeModel = fullModelName;
        } else {
          (updates as any).carModel = fullModelName;
        }
        onChange(updates);
      }
    }
  };

  return (
    <div className="grid gap-4">
      {/* Vehicle Type Selection */}
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

      {/* Model Dropdown */}
      {formData.type && (
        <div className="grid gap-2">
          <Label htmlFor="model">Model</Label>
          <Select value={selectedModel || ''} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {vehicleModels.map((model) => (
                <SelectItem key={model.model} value={model.model}>
                  {model.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Variant Dropdown */}
      {selectedModel && (
        <div className="grid gap-2">
          <Label htmlFor="variant">Variant</Label>
          <Select value={selectedVariant || ''} onValueChange={handleVariantChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a variant" />
            </SelectTrigger>
            <SelectContent>
              {vehicleModels.find(m => m.model === selectedModel)?.variants.map((variant) => (
                <SelectItem key={variant.name} value={variant.name}>
                  {variant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Year Dropdown */}
      {selectedVariant && (
        <div className="grid gap-2">
          <Label htmlFor="year">Year</Label>
          <Select value={formData.year?.toString() || ''} onValueChange={(year) => onChange({ ...formData, year: parseInt(year) })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Engine Capacity (Read-only) */}
      <div className="grid gap-2">
        <Label htmlFor="engineCapacity">Engine Capacity (CC)</Label>
        <Input id="engineCapacity" type="number" value={formData.engineCapacity || ''} readOnly />
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
        <Label htmlFor="currentKilometers">Current Kilometers</Label>
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
        <Label htmlFor="lastServiceKilometers">Last Service Kilometers</Label>
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