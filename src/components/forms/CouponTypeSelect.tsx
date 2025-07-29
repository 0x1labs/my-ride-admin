import { useQuery } from "@tanstack/react-query";
import { getCouponTypes } from "@/services/couponTypeService";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CouponType } from "@/types/couponType";

interface CouponTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  onCouponTypeSelect?: (couponType: CouponType | null) => void;
  className?: string;
}

const CouponTypeSelect = ({ 
  value, 
  onValueChange, 
  onCouponTypeSelect,
  className 
}: CouponTypeSelectProps) => {
  const { data: couponTypes = [], isLoading } = useQuery({
    queryKey: ['couponTypes'],
    queryFn: getCouponTypes,
  });

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    
    if (onCouponTypeSelect) {
      const selectedCouponType = couponTypes.find(ct => ct.name === newValue) || null;
      onCouponTypeSelect(selectedCouponType);
    }
  };

  return (
    <div className={className}>
      <Label htmlFor="coupon-type">Coupon Type</Label>
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Loading..." : "Select coupon type"} />
        </SelectTrigger>
        <SelectContent>
          {couponTypes.map((couponType) => (
            <SelectItem 
              key={couponType.id} 
              value={couponType.name}
              className="flex flex-col items-start"
            >
              <div className="font-medium">{couponType.name}</div>
              <div className="text-sm text-muted-foreground">{couponType.description}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CouponTypeSelect;