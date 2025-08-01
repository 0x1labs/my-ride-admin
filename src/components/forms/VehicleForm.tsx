import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleFormData {
  id?: string;
  type: 'bike';
  bikeModel: string;
  year: number;
  engineCapacity: number;
  owner: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: string;
  lastServiceKilometers: number;
  currentKilometers: number;
}

interface VehicleFormProps {
  formData: VehicleFormData;
  onChange: (updates: Partial<VehicleFormData>) => void;
}

const VehicleForm = ({ formData, onChange }: VehicleFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="id">Vehicle Identification Number (VIN)</Label>
        <Input
          id="id"
          value={formData.id || ""}
          onChange={(e) => onChange({ id: e.target.value })}
          placeholder="Enter Vehicle ID (e.g., VH123456)"
          required
        />
      </div>

      <div>
        <Label htmlFor="bikeModel">Bike Model</Label>
        <Input
          id="bikeModel"
          value={formData.bikeModel}
          onChange={(e) => onChange({ bikeModel: e.target.value })}
          placeholder="Enter bike model"
          required
        />
      </div>

      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => onChange({ year: parseInt(e.target.value) })}
          placeholder="Enter year"
          required
        />
      </div>

      <div>
        <Label htmlFor="engineCapacity">Engine Capacity (CC)</Label>
        <Input
          id="engineCapacity"
          type="number"
          value={formData.engineCapacity}
          onChange={(e) => onChange({ engineCapacity: parseInt(e.target.value) })}
          placeholder="Enter engine capacity"
          required
        />
      </div>

      <div>
        <Label htmlFor="owner">Owner Name</Label>
        <Input
          id="owner"
          value={formData.owner}
          onChange={(e) => onChange({ owner: e.target.value })}
          placeholder="Enter owner name"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="Enter phone number"
          required
        />
      </div>

      <div>
        <Label htmlFor="lastService">Last Service Date</Label>
        <Input
          id="lastService"
          type="date"
          value={formData.lastService}
          onChange={(e) => onChange({ lastService: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="nextService">Next Service Date</Label>
        <Input
          id="nextService"
          type="date"
          value={formData.nextService}
          onChange={(e) => onChange({ nextService: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="lastServiceKilometers">Last Service Kilometers</Label>
        <Input
          id="lastServiceKilometers"
          type="number"
          value={formData.lastServiceKilometers}
          onChange={(e) => onChange({ lastServiceKilometers: parseInt(e.target.value) })}
          placeholder="Enter kilometers"
          required
        />
      </div>

      <div>
        <Label htmlFor="currentKilometers">Current Kilometers</Label>
        <Input
          id="currentKilometers"
          type="number"
          value={formData.currentKilometers}
          onChange={(e) => onChange({ currentKilometers: parseInt(e.target.value) })}
          placeholder="Enter current kilometers"
          required
        />
      </div>
    </div>
  );
};

export default VehicleForm;