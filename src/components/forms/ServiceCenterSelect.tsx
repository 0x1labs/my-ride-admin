import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useProfiles } from "@/hooks/useProfiles";

interface ServiceCenterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

const ServiceCenterSelect = ({ value, onValueChange, required = false }: ServiceCenterSelectProps) => {
  const { data: profiles = [], isLoading } = useProfiles();

  if (isLoading) {
    return (
      <div>
        <Label>Service Center {required && '*'}</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading service centers..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="serviceCenter">Service Center {required && '*'}</Label>
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Select service center" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.service_center_name}>
              {profile.service_center_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceCenterSelect;