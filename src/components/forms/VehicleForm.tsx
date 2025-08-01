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
    <div className="space-y-4 text-ktm-light-gray">
      <div>
        <Label htmlFor="id">Motorbike Identification Number (VIN)</Label>
        <Input
          id="id"
          value={formData.id || ""}
          onChange={(e) => onChange({ id: e.target.value })}
          placeholder="Enter Motorbike ID (e.g., VH123456)"
          required
          className="bg-ktm-black"
        />
      </div>

      <div>
        <Label htmlFor="type">Motorbike Type</Label>
        <Select value={formData.type} onValueChange={(value: "car" | "bike") => onChange({ type: value })}>
          <SelectTrigger className="bg-ktm-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-ktm-dark-gray text-white">
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="bike">Motorbike</SelectItem>
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
          className="bg-ktm-black"
        />
      </div>

      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => onChange({ model: e.target.value })}
          required
          className="bg-ktm-black"
        />
      </div>

      <div>
        <Label htmlFor="variant">Variant</Label>
        <Input
          id="variant"
          value={formData.variant}
          onChange={(e) => onChange({ variant: e.target.value })}
          placeholder="e.g., Duke, RC, Adventure"
          className="bg-ktm-black"
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
          className="bg-ktm-black"
        />
      </div>

      <div>
        <Label htmlFor="owner">Rider's Name</Label>
        <Input
          id="owner"
          value={formData.owner}
          onChange={(e) => onChange({ owner: e.target.value })}
          required
          className="bg-ktm-black"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          required
          className="bg-ktm-black"
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
          className="bg-ktm-black"
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
          className="bg-ktm-black"
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
          className="bg-ktm-black"
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
          className="bg-ktm-black"
        />
      </div>
    </div>
  );
};

export default VehicleForm;