import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useServiceTypes } from "@/hooks/useServiceTypes";

interface ServiceTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

const ServiceTypeSelect = ({ value, onValueChange, required = false }: ServiceTypeSelectProps) => {
  const { data: serviceTypes = [], isLoading } = useServiceTypes();

  if (isLoading) {
    return (
      <div>
        <Label>Service Type {required && '*'}</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading service types..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="serviceType">Service Type {required && '*'}</Label>
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Select service type" />
        </SelectTrigger>
        <SelectContent>
          {serviceTypes.map((serviceType) => (
            <SelectItem key={serviceType.id} value={serviceType.name}>
              <div className="flex flex-col">
                <span className="font-medium">{serviceType.name}</span>
                {serviceType.description && (
                  <span className="text-xs text-gray-500 mt-1">{serviceType.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceTypeSelect;