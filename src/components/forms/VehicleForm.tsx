
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleFormData {
  id?: string;
  type: "car" | "bike";
  make: string;
  model: string;
  variant: string;
  year: number;
  owner: string;
  phone: string;
  lastService: string;
  nextService: string;
  lastServiceKilometers: number;
  currentKilometers: number;
}

interface VehicleFormProps {
  formData: VehicleFormData;
  onChange: (data: Partial<VehicleFormData>) => void;
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
        <Label htmlFor="type">Vehicle Type</Label>
        <Select value={formData.type} onValueChange={(value: "car" | "bike") => onChange({ type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bike">Bike</SelectItem>
            <SelectItem value="car">Car</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="make">Make</Label>
        <Input
          id="make"
          value={formData.make}
          onChange={(e) => onChange({ make: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => onChange({ model: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="variant">Variant</Label>
        <Input
          id="variant"
          value={formData.variant}
          onChange={(e) => onChange({ variant: e.target.value })}
          placeholder="e.g., Superior, Advanced, Base"
        />
      </div>

      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => onChange({ year: parseInt(e.target.value) })}
          required
        />
      </div>

      <div>
        <Label htmlFor="owner">Owner</Label>
        <Input
          id="owner"
          value={formData.owner}
          onChange={(e) => onChange({ owner: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
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
          required
        />
      </div>
    </div>
  );
};

export default VehicleForm;
