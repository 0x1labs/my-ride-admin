import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useUpdateVehicle } from "@/hooks/useVehicles";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";

const vehicleSchema = z.object({
  type: z.literal("bike"),
  bikeModel: z.string().min(1, "Bike model is required"),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  engineCapacity: z.coerce.number().min(0, "Engine capacity must be positive"),
  owner: z.string().min(1, "Owner name is required"),
  phone: z.string().min(1, "Phone number is required"),
  lastService: z.string().min(1, "Last service date is required"),
  nextService: z.string().min(1, "Next service date is required"),
  lastServiceKilometers: z.coerce.number().min(0),
  currentKilometers: z.coerce.number().min(0),
  status: z.enum(["active", "overdue", "upcoming"]),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const EditVehicleModal = ({ isOpen, onClose, vehicle }: EditVehicleModalProps) => {
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        type: "bike",
        bikeModel: vehicle.bikeModel,
        year: vehicle.year,
        engineCapacity: vehicle.engineCapacity,
        owner: vehicle.owner,
        phone: vehicle.phone,
        lastService: vehicle.lastService.split('T')[0],
        nextService: vehicle.nextService.split('T')[0],
        lastServiceKilometers: vehicle.lastServiceKilometers,
        currentKilometers: vehicle.currentKilometers,
        status: vehicle.status as "active" | "overdue" | "upcoming",
      });
    }
  }, [vehicle, reset]);

  const onSubmit = (data: VehicleFormData) => {
    if (!vehicle) return;
    updateVehicle(
      { id: vehicle.id, updates: data },
      {
        onSuccess: () => {
          toast.success("Bike updated successfully!");
          onClose();
        },
        onError: (error) => {
          toast.error(`Failed to update bike: ${error.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Bike</DialogTitle>
          <DialogDescription>
            Update the details for {vehicle?.bikeModel}.
          </DialogDescription>
        </DialogHeader>
        <form id="edit-vehicle-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bikeModel" className="text-right">Bike Model</Label>
            <Controller name="bikeModel" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select bike model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Duke">Duke</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.bikeModel && <p className="col-span-4 text-red-500 text-sm">{errors.bikeModel.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">Year</Label>
            <Controller name="year" control={control} render={({ field }) => <Input id="year" type="number" {...field} className="col-span-3" />} />
            {errors.year && <p className="col-span-4 text-red-500 text-sm">{errors.year.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="engineCapacity" className="text-right">Engine Capacity (CC)</Label>
            <Controller name="engineCapacity" control={control} render={({ field }) => <Input id="engineCapacity" type="number" {...field} className="col-span-3" />} />
            {errors.engineCapacity && <p className="col-span-4 text-red-500 text-sm">{errors.engineCapacity.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner" className="text-right">Owner</Label>
            <Controller name="owner" control={control} render={({ field }) => <Input id="owner" {...field} className="col-span-3" />} />
            {errors.owner && <p className="col-span-4 text-red-500 text-sm">{errors.owner.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Controller name="phone" control={control} render={({ field }) => <Input id="phone" {...field} className="col-span-3" />} />
            {errors.phone && <p className="col-span-4 text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastService" className="text-right">Last Service</Label>
            <Controller name="lastService" control={control} render={({ field }) => <Input id="lastService" type="date" {...field} className="col-span-3" />} />
            {errors.lastService && <p className="col-span-4 text-red-500 text-sm">{errors.lastService.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nextService" className="text-right">Next Service</Label>
            <Controller name="nextService" control={control} render={({ field }) => <Input id="nextService" type="date" {...field} className="col-span-3" />} />
            {errors.nextService && <p className="col-span-4 text-red-500 text-sm">{errors.nextService.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastServiceKilometers" className="text-right">Last Svc KM</Label>
            <Controller name="lastServiceKilometers" control={control} render={({ field }) => <Input id="lastServiceKilometers" type="number" {...field} className="col-span-3" />} />
            {errors.lastServiceKilometers && <p className="col-span-4 text-red-500 text-sm">{errors.lastServiceKilometers.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentKilometers" className="text-right">Current KM</Label>
            <Controller name="currentKilometers" control={control} render={({ field }) => <Input id="currentKilometers" type="number" {...field} className="col-span-3" />} />
            {errors.currentKilometers && <p className="col-span-4 text-red-500 text-sm">{errors.currentKilometers.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Controller name="status" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            {errors.status && <p className="col-span-4 text-red-500 text-sm">{errors.status.message}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="edit-vehicle-form" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleModal;